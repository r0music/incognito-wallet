import { MAX_FEE_PER_TX } from '@components/EstimateFee/EstimateFee.utils';
import accountService from '@services/wallet/accountService';
import { COINS, CONSTANT_COMMONS } from '@src/constants';
import PToken from '@src/models/pToken';
import { accountSelector } from '@src/redux/selectors';
import { getDefaultAccountWalletSelector } from '@src/redux/selectors/shared';
import { pTokensSelector } from '@src/redux/selectors/token';
import { walletSelector } from '@src/redux/selectors/wallet';
import { ExHandler } from '@src/services/exception';
import {
  ACCOUNT_CONSTANT,
  constants,
  PrivacyVersion,
} from 'incognito-chain-web-js/build/wallet';
import { actions } from '.';
import {
  PTokenConvert,
  ConvertStatus,
  TokenConvert,
  TRANSACTION_CONVERT_STATUS,
} from './models';
import {
  listTokenConvertSelector,
  listUnifiedTokenSelector,
} from './selectors';

const getPTokenBalance = (tokenID: string) => async (dispatch, getState) => {
  let state = getState();
  const account = accountSelector?.defaultAccountSelector(state);
  const wallet = walletSelector(state);
  const balance = await accountService.getBalance({
    account,
    wallet,
    tokenID,
    version: PrivacyVersion.ver2,
  });
  return balance;
};

const setListTokenConvert = () => async (dispatch, getState) => {
  let state = getState();

  // get list unified token from allTokens
  let allTokens = pTokensSelector(state);
  let unifiedTokens: PToken[] = allTokens?.filter(
    (token: PToken) =>
      token.currencyType ===
      CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.UNIFIED_TOKEN,
  );
  await dispatch(actions.fetchingListUnifiedToken());
  let newUnifiedTokens: TokenConvert[] = [];
  for (var i = 0; i < unifiedTokens.length; i++) {
    const listPTokenConvert = unifiedTokens[i].listUnifiedToken;
    let unifiedTokenBalance: number = 0;
    let newListPTokenConvert: PTokenConvert[] = [];
    for (var j = 0; j < listPTokenConvert?.length; j++) {
      // Get pToken balance of unified token
      const pTokenBalance = await dispatch(
        getPTokenBalance(listPTokenConvert[j]?.tokenId),
      );
      if (pTokenBalance > 0) {
        unifiedTokenBalance = unifiedTokenBalance + pTokenBalance;
        newListPTokenConvert.push({
          ...listPTokenConvert[j],
          balance: pTokenBalance,
          convertStatus: null,
          parentUnifiedTokenId: unifiedTokens[i].tokenId,
          parentUnifiedTokenSymbol: unifiedTokens[i].symbol,
        });
      }
    }
    if (unifiedTokenBalance > 0) {
      newUnifiedTokens.push({
        ...unifiedTokens[i],
        listUnifiedToken: newListPTokenConvert,
        balance: unifiedTokenBalance,
      });
    }
  }

  await dispatch(actions.setListUnifiedToken(newUnifiedTokens));
};

const updateConvertStatus =
  (unifiedTokenId: string, pTokenId: string, status: ConvertStatus) =>
  async (dispatch, getState) => {
    const state = getState();
    // get list token user selected
    let listUnifiedToken: TokenConvert[] = listUnifiedTokenSelector(state);
    // find index of unified token by unifiedTokenId;
    const unifiedTokenIndex = listUnifiedToken.findIndex(
      (token: TokenConvert) => token.tokenId === unifiedTokenId,
    );
    // listPToken of unified token
    const listPToken = listUnifiedToken[unifiedTokenIndex]?.listUnifiedToken;
    // find index of pToken by pTokenId
    const pTokenIndex = listPToken.findIndex(
      (token: PTokenConvert) => token.tokenId === pTokenId,
    );
    // make newListTokenConvert array
    let newListUnifiedToken = [...listUnifiedToken];
    newListUnifiedToken[unifiedTokenIndex].listUnifiedToken[
      pTokenIndex
    ].convertStatus = status;
    dispatch(actions.setListUnifiedToken(newListUnifiedToken));
  };

const createTransactionConvert = () => async (dispatch, getState) => {
  const state = getState();
  const account = accountSelector?.defaultAccountSelector(state);
  const wallet = walletSelector(state);
  const accountWallet = getDefaultAccountWalletSelector(state);
  const listPTokenConvert: PTokenConvert[] = listTokenConvertSelector(state);
  if (!listPTokenConvert?.length) return;
  for (var i = 0; i < listPTokenConvert.length; i++) {
    const pTokenData: PTokenConvert = listPTokenConvert[i];
    let unspentCoinsOfPToken: any[] =
      (await accountWallet.getUnspentCoinsExcludeSpendingCoins({
        tokenID: pTokenData?.tokenId,
        version: PrivacyVersion.ver2,
      })) || [];
    // sort unspentCoins of pToken by price value in ascending order:
    unspentCoinsOfPToken = unspentCoinsOfPToken.sort(
      (a: { Value: any }, b: { Value: any }) =>
        parseFloat(b.Value) - parseFloat(a.Value),
    );
    // calculate number of transaction to convert 1 pToken to unifiedToken
    const numberOfTransactionToConvert =
      (unspentCoinsOfPToken?.length -
        (unspentCoinsOfPToken?.length % constants.MAX_INPUT_PER_TX)) /
        constants.MAX_INPUT_PER_TX +
      1;
    // convert unspentCoins from One-Dimensional array to Two-Dimensional array
    let unspentCoinsOfPTokenToConvert: any[][] = [];
    if (numberOfTransactionToConvert < 2) {
      unspentCoinsOfPTokenToConvert = [unspentCoinsOfPToken];
    } else {
      while (unspentCoinsOfPToken.length > 0) {
        const childUnspentCoinsArray = unspentCoinsOfPToken.splice(
          0,
          numberOfTransactionToConvert,
        );
        unspentCoinsOfPTokenToConvert.push(childUnspentCoinsArray);
      }
    }

    // update convert status for pToken to Processing
    await dispatch(
      updateConvertStatus(
        pTokenData?.parentUnifiedTokenId,
        pTokenData?.tokenId,
        'PROCESSING',
      ),
    );
    // create burning request
    let transactionStatusArray: any[] = [];
    for (var j = 0; j < unspentCoinsOfPTokenToConvert?.length; j++) {
      let convertAmount = unspentCoinsOfPTokenToConvert[j]
        .map((item) => parseFloat(item.Value))
        .reduce((prevValue, nextValue) => prevValue + nextValue);
      const data: any = {
        wallet,
        account,
        fee: MAX_FEE_PER_TX,
        tokenId: pTokenData?.tokenId,
        prvPayments: [],
        info: '',
        txHashHandler: null,
        pUnifiedTokenID: pTokenData?.parentUnifiedTokenId,
        convertAmount: convertAmount,
        networkId: pTokenData?.networkId,
      };

      let numberOfTimeToWait = 0;
      while (true) {
        const prvBalance = await accountService.getBalance({
          account,
          wallet,
          tokenID: COINS.PRV_ID,
          version: PrivacyVersion.ver2,
        });

        if (prvBalance >= MAX_FEE_PER_TX) {
          try {
            const result =
              await accountService.createBurningRequestForConvertUnifiedToken(
                data,
              );
            console.log(
              'createBurningRequestForConvertUnifiedTokenResult:',
              result,
            );
            transactionStatusArray.push(
              TRANSACTION_CONVERT_STATUS.SUCCESSFULLY,
            );
          } catch (error) {
            transactionStatusArray.push(TRANSACTION_CONVERT_STATUS.FAILED);
            console.log('error', error);
          }
          break;
        } else {
          if (numberOfTimeToWait === 3) {
            transactionStatusArray.push(TRANSACTION_CONVERT_STATUS.FAILED);
            break;
          } else {
            setTimeout(() => {
              numberOfTimeToWait = numberOfTimeToWait + 1;
            }, 20000);
          }
        }
      }
    }
    // Check if all transactions have been processed (when transactionStatusArray.length === numberOfTransactionToConvert => Done)
    if (transactionStatusArray.length === numberOfTransactionToConvert) {
      const transactionSuccessArray = transactionStatusArray.filter(
        (status) => status === TRANSACTION_CONVERT_STATUS.SUCCESSFULLY,
      );
      if (transactionSuccessArray?.length === numberOfTransactionToConvert) {
        // only update status is Successfully when all transaction successfully
        await dispatch(
          updateConvertStatus(
            pTokenData?.parentUnifiedTokenId,
            pTokenData?.tokenId,
            'SUCCESSFULLY',
          ),
        );
      } else {
        // if one of transaction failed => update status fail
        await dispatch(
          updateConvertStatus(
            pTokenData?.parentUnifiedTokenId,
            pTokenData?.tokenId,
            'FAILED',
          ),
        );
      }
    }
  }
};

const convertToUnifiedToken = () => async (dispatch, getState) => {
  let state = getState();
  const account: any = accountSelector?.defaultAccountSelector(state);
  const wallet: any = walletSelector(state);
  try {
    // get PRV balance and unspent coins
    const accountWallet = getDefaultAccountWalletSelector(state);
    const prvBalance = await accountService.getBalance({
      account,
      wallet,
      tokenID: COINS.PRV_ID,
      version: PrivacyVersion.ver2,
    });
    const unspentCoinsOfPRV =
      (await accountWallet.getUnspentCoinsExcludeSpendingCoins({
        tokenID: COINS.PRV_ID,
        version: PrivacyVersion.ver2,
      })) || [];
    console.log({ prvBalance, unspentCoinsOfPRV });

    // get list pToken to Convert
    const listPTokenConvert = listTokenConvertSelector(state);

    // validate prv balance and create transaction;
    let minimumPRVBalanceToCreateTransaction =
      MAX_FEE_PER_TX * listPTokenConvert?.length * 2;
    if (minimumPRVBalanceToCreateTransaction < 1000) {
      minimumPRVBalanceToCreateTransaction = 1000;
    }
    const minimumPRVUnspentToCreateTransaction = 9;
    if (prvBalance >= minimumPRVBalanceToCreateTransaction) {
      if (unspentCoinsOfPRV?.length >= minimumPRVUnspentToCreateTransaction) {
        // create transaction
        dispatch(createTransactionConvert());
      } else {
        // split PRV if unspentCoinsOfPRV not enough, after split => create transaction
        let tokenPaymentInfo: any = [];
        for (
          var i = 0;
          i < minimumPRVUnspentToCreateTransaction - unspentCoinsOfPRV?.length;
          i++
        ) {
          tokenPaymentInfo.push({
            PaymentAddress: account?.PaymentAddress,
            Amount: MAX_FEE_PER_TX,
            Message: '',
          });
        }
        const res = await accountService.createAndSendNativeToken({
          wallet,
          account,
          fee: MAX_FEE_PER_TX,
          info: '',
          prvPayments: tokenPaymentInfo,
          txType: ACCOUNT_CONSTANT.TX_TYPE.SEND,
          version: PrivacyVersion.ver2,
        });
        if (res) {
          setTimeout(() => {
            dispatch(createTransactionConvert());
          }, 3000);
        }
      }
    } else {
      throw 'PRV balance not enough to convert';
    }
  } catch (error) {
    new ExHandler(error).showErrorToast();
    throw error;
  }
};

const updateSelectedTokenToConvert =
  (unifiedTokenId: string) => async (dispatch, getState) => {
    const state = getState();
    let listUnifiedToken = listUnifiedTokenSelector(state);
    // find index of token selected
    const tokenSelectedIndex = listUnifiedToken.findIndex(
      (token: TokenConvert) => token.tokenId === unifiedTokenId,
    );
    // Make newListUnifiedToken array
    let newListUnifiedToken = [...listUnifiedToken];
    newListUnifiedToken[tokenSelectedIndex].selected =
      !newListUnifiedToken[tokenSelectedIndex].selected;
    dispatch(actions.setListUnifiedToken(newListUnifiedToken));
  };

export {
  setListTokenConvert,
  convertToUnifiedToken,
  updateSelectedTokenToConvert,
};

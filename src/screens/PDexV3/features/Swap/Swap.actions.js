import { getBalance } from '@src/redux/actions/token';
import { actionGetPDexV3Inst, getPDexV3Instance } from '@screens/PDexV3';
import {
  ACCOUNT_CONSTANT,
  PrivacyVersion,
} from 'incognito-chain-web-js/build/wallet';
import { defaultAccountWalletSelector } from '@src/redux/selectors/account';
import { getPrivacyDataByTokenID } from '@src/redux/selectors/selectedPrivacy';
import { ExHandler } from '@src/services/exception';
import convert from '@src/utils/convert';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import { change, focus } from 'redux-form';
import { delay } from '@src/utils/delay';
import isEmpty from 'lodash/isEmpty';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { batch } from 'react-redux';
import { BIG_COINS } from '@src/screens/Dex/constants';
import uniq from 'lodash/uniq';
import { PRV, PRV_ID } from '@src/constants/common';

import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_SELL_TOKEN,
  ACTION_SET_BUY_TOKEN,
  ACTION_SET_FEE_TOKEN,
  ACTION_SET_FOCUS_TOKEN,
  formConfigs,
  ACTION_SET_SELECTING_TOKEN,
  ACTION_SET_SWAPING_TOKEN,
  ACTION_SET_INITIING_SWAP,
  ACTION_RESET,
  ACTION_SET_PERCENT,
  ACTION_FETCH_SWAP,
  ACTION_FETCHED_LIST_PAIRS,
  ACTION_FETCHING_ORDERS_HISTORY,
  ACTION_FETCHED_ORDERS_HISTORY,
  ACTION_FETCH_FAIL_ORDERS_HISTORY,
  ACTION_FETCHING_ORDER_DETAIL,
  ACTION_FETCHED_ORDER_DETAIL,
} from './Swap.constant';
import {
  buytokenSelector,
  feeSelectedSelector,
  feetokenDataSelector,
  inputAmountSelector,
  selltokenSelector,
  orderDetailSelector,
  swapInfoSelector,
} from './Swap.selector';

export const actionSetPercent = (payload) => ({
  type: ACTION_SET_PERCENT,
  payload,
});

export const actionSetSellTokenFetched = (payload) => ({
  type: ACTION_SET_SELL_TOKEN,
  payload,
});

export const actionSetBuyTokenFetched = (payload) => ({
  type: ACTION_SET_BUY_TOKEN,
  payload,
});

export const actionSetFeeToken = (payload) => ({
  type: ACTION_SET_FEE_TOKEN,
  payload,
});

export const actionSetFocusToken = (payload) => ({
  type: ACTION_SET_FOCUS_TOKEN,
  payload,
});

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = (payload) => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionReset = (payload) => ({
  type: ACTION_RESET,
  payload,
});

export const actionEstimateTrade = () => async (dispatch, getState) => {
  try {
    let state = getState();
    const inputAmount = inputAmountSelector(state);
    const input1Amount = inputAmount(formConfigs.selltoken);
    const input2Amount = inputAmount(formConfigs.buytoken);
    const feetoken = feeSelectedSelector(state);
    if (isEmpty(input1Amount) || isEmpty(input2Amount) || isEmpty(feetoken)) {
      return;
    }
    const {
      focus: focusedInput1,
      tokenId: tokenId1,
      originalAmount: originalAmount1,
      symbol: symbol1,
      pDecimals: pDecimals1,
    } = input1Amount;
    const {
      focus: focusedInput2,
      tokenId: tokenId2,
      originalAmount: originalAmount2,
      symbol: symbol2,
      pDecimals: pDecimals2,
    } = input2Amount;
    let selltoken,
      buytoken,
      amount,
      sellsymbol,
      buysymbol,
      inputtoken,
      inputtokenDecimals;
    if (focusedInput2 && !focusedInput1) {
      selltoken = tokenId2;
      buytoken = tokenId1;
      amount = originalAmount2;
      sellsymbol = symbol2;
      buysymbol = symbol1;
      inputtoken = formConfigs.selltoken;
      inputtokenDecimals = pDecimals1;
    } else {
      selltoken = tokenId1;
      buytoken = tokenId2;
      amount = originalAmount1;
      sellsymbol = symbol1;
      buysymbol = symbol2;
      inputtoken = formConfigs.buytoken;
      inputtokenDecimals = pDecimals2;
    }
    if (!selltoken || !buytoken || !amount) {
      return;
    }
    await dispatch(actionFetching());
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const payload = {
      selltoken,
      buytoken,
      feetoken,
      amount,
    };
    const data = await pDexV3Inst.getEstimateTrade(payload);
    await dispatch(actionFetched(data));
    state = getState();
    const swapInfo = swapInfoSelector(state);
    const feeTokenData = feetokenDataSelector(state);
    const { minFeeAmountFixed } = feeTokenData;
    const { buyAmountExpectedToFixed } = swapInfo;
    batch(() => {
      dispatch(
        change(formConfigs.formName, inputtoken, buyAmountExpectedToFixed),
      );
      dispatch(
        change(formConfigs.formName, formConfigs.feetoken, minFeeAmountFixed),
      );
    });
  } catch (error) {
    console.log('ERROR', error);
    await dispatch(actionFetchFail());
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionSetFocusToken(''));
  }
};

export const actionSetSellToken = (selltoken) => async (dispatch, getState) => {
  try {
    if (!selltoken) {
      return;
    }
    dispatch(actionSetSellTokenFetched(selltoken));
    const state = getState();
    const token = getPrivacyDataByTokenID(state)(selltoken);
    const { pDecimals } = token;
    const balance = await dispatch(getBalance(selltoken));
    if (!balance) {
      return;
    }
    const minimum = convert.toOriginalAmount(1, pDecimals);
    const bnBalance = new BigNumber(balance);
    const bnMinumum = new BigNumber(minimum);
    let sellOriginalAmount = '';
    if (bnBalance.gte(bnMinumum)) {
      sellOriginalAmount = minimum;
    } else {
      sellOriginalAmount = balance;
    }
    let sellamount = '';
    sellamount = format.toFixed(
      convert.toHumanAmount(sellOriginalAmount, token.pDecimals),
      token.pDecimals,
    );
    dispatch(change(formConfigs.formName, formConfigs.selltoken, sellamount));
    dispatch(focus(formConfigs.formName, formConfigs.selltoken));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionSetBuyToken = (buytoken) => async (dispatch, getState) => {
  try {
    dispatch(actionSetBuyTokenFetched(buytoken));
    await dispatch(getBalance(buytoken));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionInitingSwapForm = (payload) => ({
  type: ACTION_SET_INITIING_SWAP,
  payload,
});

export const actionSetInputToken = ({ selltoken, buytoken }) => async (
  dispatch,
) => {
  if (!selltoken || !buytoken) {
    return;
  }
  try {
    let task = [
      dispatch(actionSetSellToken(selltoken)),
      dispatch(actionSetBuyToken(buytoken)),
    ];
    if (selltoken !== PRV.id && buytoken !== PRV.id) {
      task.push(dispatch(getBalance(PRV.id)));
    }
    await Promise.all(task);
  } catch (error) {
    throw error;
  }
};

export const actionFetchedPairs = (payload) => ({
  payload,
  type: ACTION_FETCHED_LIST_PAIRS,
});

export const actionFetchPairs = () => async (dispatch, getState) => {
  let pairs = [];
  try {
    let state = getState();
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    pairs = (await pDexV3Inst.getListPair()) || [];
    pairs = pairs.reduce(
      (prev, current) =>
        (prev = prev.concat([current.tokenId1, current.tokenId2])),
      [],
    );
    pairs = uniq(pairs);
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
  await dispatch(actionFetchedPairs(pairs));
  return pairs;
};

export const actionInitSwapForm = (defaultPair) => async (
  dispatch,
  getState,
) => {
  try {
    let pair = defaultPair;
    await dispatch(actionInitingSwapForm(true));
    if (isEmpty(pair)) {
      const pairs = await dispatch(actionFetchPairs());
      pair = {
        selltoken: PRV_ID,
        buytoken:
          pairs.find(
            (i) =>
              i ===
              'fe75fc6ab38c690effd73c14325e771a19c0dca5de7c7a725bcf8b002755fdab',
          ) || BIG_COINS.USDT,
      };
    }
    const { selltoken, buytoken } = pair;
    batch(() => {
      dispatch(actionSetSellTokenFetched(selltoken));
      dispatch(actionSetBuyTokenFetched(buytoken));
      dispatch(
        change(formConfigs.formName, formConfigs.slippagetolerance, '1'),
      );
      dispatch(actionSetFeeToken(PRV.id));
    });
    await dispatch(actionSetInputToken({ selltoken, buytoken }));
    await dispatch(actionEstimateTrade());
  } catch (error) {
    new ExHandler(error).showErrorToast;
  } finally {
    await dispatch(actionInitingSwapForm(false));
  }
};

export const actionSetSwapingToken = (payload) => ({
  type: ACTION_SET_SWAPING_TOKEN,
  payload,
});

export const actionSwapToken = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { tokenId: selltoken }: SelectedPrivacy = selltokenSelector(state);
    const { tokenId: buytoken }: SelectedPrivacy = buytokenSelector(state);
    if (!selltoken | !buytoken) {
      return;
    }
    await dispatch(actionSetSwapingToken(true));
    await dispatch(
      actionInitSwapForm({
        selltoken: buytoken,
        buytoken: selltoken,
      }),
    );
  } catch (error) {
    console.log('actionSwapToken-error', error);
    new ExHandler(error).showErrorToast;
  } finally {
    await dispatch(actionSetSwapingToken(false));
  }
};

export const actionSetSelectingToken = (payload) => ({
  type: ACTION_SET_SELECTING_TOKEN,
  payload,
});

export const actionSelectToken = (token: SelectedPrivacy, field) => async (
  dispatch,
  getState,
) => {
  if (!token.tokenId || !field) {
    return;
  }
  try {
    await dispatch(actionSetSelectingToken(true));
    const state = getState();
    const selltoken: SelectedPrivacy = selltokenSelector(state);
    const buytoken: SelectedPrivacy = buytokenSelector(state);
    switch (field) {
    case formConfigs.selltoken: {
      if (selltoken.tokenId === token.tokenId) {
        return;
      }
      if (buytoken.tokenId === token.tokenId) {
        await dispatch(actionSwapToken());
      } else {
        batch(() => {
          dispatch(change(formConfigs.formName, formConfigs.selltoken, ''));
          dispatch(change(formConfigs.formName, formConfigs.buytoken, ''));
          dispatch(change(formConfigs.formName, formConfigs.feetoken, ''));
          dispatch(actionSetSellTokenFetched(token.tokenId));
          dispatch(actionSetFocusToken(''));
          dispatch(actionSetFeeToken(PRV.id));
        });
        await dispatch(
          actionSetInputToken({
            selltoken: token.tokenId,
            buytoken: buytoken.tokenId,
          }),
        );
        await dispatch(actionEstimateTrade());
      }
      break;
    }
    case formConfigs.buytoken: {
      if (buytoken.tokenId === token.tokenId) {
        return;
      }
      if (selltoken.tokenId === token.tokenId) {
        await dispatch(actionSwapToken());
      } else {
        batch(() => {
          dispatch(change(formConfigs.formName, formConfigs.feetoken, ''));
          dispatch(change(formConfigs.formName, formConfigs.buytoken, ''));
          dispatch(actionSetBuyTokenFetched(token.tokenId));
          dispatch(actionSetBuyToken(token.tokenId));
          dispatch(actionSetFocusToken(''));
          dispatch(actionSetFeeToken(PRV.id));
        });
        await dispatch(
          actionSetInputToken({
            selltoken: selltoken.tokenId,
            buytoken: token.tokenId,
          }),
        );
        await dispatch(actionEstimateTrade());
      }
      break;
    }
    default:
      break;
    }
  } catch (error) {
    console.log('actionSetSelectingToken-error', error);
    new ExHandler(error).showErrorToast;
  } finally {
    await dispatch(actionSetSelectingToken(false));
  }
};

export const actionFetchingSwap = (payload) => ({
  type: ACTION_FETCH_SWAP,
  payload,
});

export const actionFetchSwap = () => async (dispatch, getState) => {
  let tx;
  try {
    const state = getState();
    const { disabledBtnSwap, routing: tradePath } = swapInfoSelector(state);
    if (disabledBtnSwap) {
      return;
    }
    await dispatch(actionFetchingSwap(true));
    const account = defaultAccountWalletSelector(state);
    const sellInputAmount = inputAmountSelector(state)(formConfigs.selltoken);
    const buyInputAmount = inputAmountSelector(state)(formConfigs.buytoken);
    const feetokenData = feetokenDataSelector(state);
    if (!sellInputAmount || !buyInputAmount || !feetokenData) {
      return;
    }
    await delay(2000);
    const pDexV3 = await getPDexV3Instance({ account });
    const {
      tokenId: tokenIDToSell,
      originalAmount: sellAmount,
    } = sellInputAmount;
    const {
      tokenId: tokenIDToBuy,
      originalAmount: minAcceptableAmount,
    } = buyInputAmount;
    const { origininalFeeAmount: tradingFee, feetoken } = feetokenData;
    const params = {
      transfer: { fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX },
      extra: {
        tokenIDToSell,
        sellAmount,
        tokenIDToBuy,
        tradingFee,
        tradePath,
        feetoken,
        version: PrivacyVersion.ver2,
        minAcceptableAmount,
      },
    };
    console.log('params', params);
    tx = await pDexV3.createAndSendSwapRequestTx(params);
    console.log('tx', tx);
    if (!tx) {
      console.log('error');
    }
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    await dispatch(actionFetchingSwap(false));
  }
  return tx;
};

export const actionFetchingOrdersHistory = () => ({
  type: ACTION_FETCHING_ORDERS_HISTORY,
});

export const actionFetchedOrdersHistory = (payload) => ({
  type: ACTION_FETCHED_ORDERS_HISTORY,
  payload,
});

export const actionFetchFailOrderHistory = () => ({
  type: ACTION_FETCH_FAIL_ORDERS_HISTORY,
});

export const actionFetchHistory = () => async (dispatch, getState) => {
  let history = [];
  try {
    await dispatch(actionFetchingOrdersHistory());
    const pDexV3 = await dispatch(actionGetPDexV3Inst());
    history = await pDexV3.getSwapHistory({ version: PrivacyVersion.ver2 });
    await dispatch(actionFetchedOrdersHistory(history));
  } catch (error) {
    new ExHandler(error).showErrorToast();
    await dispatch(actionFetchFailOrderHistory());
  }
};

export const actionFetchingOrderDetail = () => ({
  type: ACTION_FETCHING_ORDER_DETAIL,
});

export const actionFetchedOrderDetail = (payload) => ({
  type: ACTION_FETCHED_ORDER_DETAIL,
  payload,
});

export const actionFetchDataOrderDetail = () => async (dispatch, getState) => {
  let _order = {};
  const state = getState();
  const { order } = orderDetailSelector(state);
  if (!order?.requestTx) {
    return;
  }
  try {
    await dispatch(actionFetchingOrderDetail());
    const pDexV3 = await dispatch(actionGetPDexV3Inst());
    _order = await pDexV3.getOrderSwapDetail({
      requestTx: order?.requestTx,
      version: PrivacyVersion.ver2,
    });
  } catch (error) {
    _order = { ...order };
    new ExHandler(error).showErrorToast();
  } finally {
    _order = _order || order;
    await dispatch(actionFetchedOrderDetail(_order));
  }
};
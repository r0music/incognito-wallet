import { getDefaultAccountWalletSelector } from '@src/redux/selectors/shared';
import FollowActionName from '@screens/Wallet/features/FollowList/FollowList.actionName';
import { setListToken, setToken } from '@src/redux/actions/token';
import { batch } from 'react-redux';
import { accountSelector } from '@src/redux/selectors';
import accountService from '@services/wallet/accountService';
import { PrivacyVersion , PRVIDSTR } from 'incognito-chain-web-js/build/wallet';
import { walletSelector } from '@src/redux/selectors/wallet';
import { setAccount } from '@src/redux/actions/account';
import { isFetchingSelector } from '@screens/Wallet/features/FollowList/FollowList.selector';
import uniqBy from 'lodash/uniqBy';
import { CONSTANT_CONFIGS } from '@src/constants';

const actionFetchingBalance = () => ({
  type: FollowActionName.ACTION_FETCHING_BALANCE
});

const actionFetchedBalance = (payload) => ({
  type: FollowActionName.ACTION_FETCHED_BALANCE,
  payload
});

const actionUpdateTokenList = (payload) => ({
  type: FollowActionName.ACTION_UPDATE_TOKEN_LIST,
  payload
});

const actionFetchedTokenBalance = (payload) => ({
  type: FollowActionName.ACTION_FETCHED_TOKEN_BALANCE,
  payload
});

const actionLoadFollowBalance = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const isFetching = isFetchingSelector(state);
    if (isFetching) return;
    dispatch(actionFetchingBalance());
    const accountWallet = getDefaultAccountWalletSelector(state);
    const account = accountSelector?.defaultAccountSelector(state);
    const pTokensIDs = CONSTANT_CONFIGS.isMainnet
      ? [
          // BTC
          'b832e5d3b1f01a4f0623f7fe91d6673461e1f5d37d91fe78c5c2e6183ff39696',
          // ETH(Unified)
          '3ee31eba6376fc16cadb52c8765f20b6ebff92c0b1c5ab5fc78c8c25703bb19e',
          // USDC(Unified)
          '545ef6e26d4d428b16117523935b6be85ec0a63e8c2afeb0162315eb0ce3d151',
          // USDT(Unified)
          '076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229',
          // DAI(Unified)
          '0d953a47a7a488cee562e64c80c25d3dbe29d3b477ccd2b54408c0553a93f126',
        ]
      : [
          // BTC
          '4584d5e9b2fc0337dfb17f4b5bb025e5b82c38cfa4f54e8a3d4fcdd03954ff82',
          // ETH(Unified)
          'b366fa400c36e6bbcf24ac3e99c90406ddc64346ab0b7ba21e159b83d938812d',
          // USDC(Unified)
          '6fa448f24835b0c72e62004edf391679fdbc391a82e4edb3726d16251509a2d0',
          // USDT(Unified)
          '3a526c0fa9abfc3e3e37becc52c5c10abbb7897b0534ad17018e766fc6133590',
          // DAI(Unified)
          '50092f46f3f9dcebd3176de97c936950977bcc52a22eebb2863b8e4d24261434',
        ];
    const { balance } = await accountWallet.getFollowTokensBalance({
      defaultTokens: pTokensIDs,
    });
    const _balance = uniqBy(balance, 'id');
    const _followTokens = _balance.map(({ id, amount }) => ({
      id,
      amount,
      loading: false,
    }));
    const accountMerge = {
      ...account,
      value: balance.find(({ id }) => id === PRVIDSTR).amount,
    };
    batch(() => {
      dispatch(actionFetchedBalance({ balance: _balance, OTAKey: account.OTAKey }));
      dispatch(setListToken(_followTokens));
      dispatch(setAccount(accountMerge));
    });
  } catch (e) {
    throw e;
  }
};

const actionLoadTokenBalance = ({ tokenID }) => async (dispatch, getState) => {
  try {
    const state = getState();
    const isFetching = isFetchingSelector(state);
    if (isFetching) return;
    dispatch(actionFetchingBalance());
    const account = accountSelector?.defaultAccountSelector(state);
    const wallet = walletSelector(state);
    const balance = await accountService.getBalance({
      account,
      wallet,
      tokenID,
      version: PrivacyVersion.ver2,
    });
    const token = {
      id: tokenID,
      amount: balance,
      loading: false
    };
    await dispatch(setToken(token));
    dispatch(actionFetchedTokenBalance({ token, OTAKey: account.OTAKey }));
  } catch (e) {
    throw e;
  }
};

export default {
  actionLoadFollowBalance,
  actionLoadTokenBalance,
  actionUpdateTokenList,
  actionFetchedTokenBalance,
};

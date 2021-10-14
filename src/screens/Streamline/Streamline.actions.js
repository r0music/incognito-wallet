import { ExHandler } from '@src/services/exception';
import { getDefaultAccountWalletSelector } from '@src/redux/selectors/shared';
import { PrivacyVersion } from 'incognito-chain-web-js/build/wallet';
import { batch } from 'react-redux';
import {selectedPrivacySelector, tokenSelector} from '@src/redux/selectors';
import {switchAccountSelector} from '@src/redux/selectors/account';
import {PRV_ID} from '@screens/Dex/constants';
import cloneDeep from 'lodash/cloneDeep';
import { streamlineSelector } from './Streamline.selector';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_INIT_PROCCESS,
  ACTION_FETCHED_ALL_TXS,
  ACTION_TOGGLE_PENDING,
  ACTION_REMOVE_LOCAL_UTXOS,
  ACTION_FETCHED_UTXO,
  ACTION_CLEAR_STREAM_LINE,
  ACTION_FETCHING_UTXO,
} from './Streamline.actionsName';

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = (payload) => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetch = () => async (dispatch, getState) => {
  let error;
  try {
    const state = getState();
    const accountWallet = getDefaultAccountWalletSelector(state);
    const selectedPrivacy = selectedPrivacySelector.selectedPrivacy(state);
    const { isFetching } = streamlineSelector(state);

    if (isFetching) return;

    await dispatch(actionFetching());

    const address = accountWallet?.getPaymentAddress();
    const tokenID = selectedPrivacy?.tokenId;
    const result = await accountWallet.consolidate({ transfer: { tokenID }, extra: { version: PrivacyVersion.ver2 } });

    if (result) {
      const payload = {
        address,
        utxos: result?.map((item) => item?.txId),
        tokenID,
      };
      await dispatch(actionFetched(payload));
    }
  } catch (e) {
    error = e;
    if (
      error &&
      error?.code === 'WEB_JS_ERROR(-3002)' &&
      error?.stackTraceCode === ''
    ) {
      error = new Error('Something’s not quite right. Please try again later.');
      return new ExHandler(error).showErrorToast();
    }
    new ExHandler(error).showErrorToast(true);
  } finally {
    dispatch(actionFetchedAllTxs());
  }
};

export const actionInitProccess = (payload) => ({
  type: ACTION_INIT_PROCCESS,
  payload,
});

export const actionFetchedAllTxs = () => ({
  type: ACTION_FETCHED_ALL_TXS,
});

export const actionTogglePending = (payload) => ({
  type: ACTION_TOGGLE_PENDING,
  payload,
});

export const actionRemoveLocalUTXOs = (payload) => ({
  type: ACTION_REMOVE_LOCAL_UTXOS,
  payload,
});

export const actionFetchedUTXO = (payload) => ({
  type: ACTION_FETCHED_UTXO,
  payload,
});

export const actionClearStreamLine = () => ({
  type: ACTION_CLEAR_STREAM_LINE
});

export const actionFetchingUTXO = (payload) => ({
  type: ACTION_FETCHING_UTXO,
  payload
});

export const actionConditionConsolidate = ({ version = PrivacyVersion.ver2 } = {}) => async (dispatch, getState) => {
  try {
    const state = getState();
    const switchingAccount = switchAccountSelector(state);
    if (switchingAccount) return;
    /** start fetching UTXOS */
    dispatch(actionFetchingUTXO(true));
    const accountWallet = getDefaultAccountWalletSelector(state);
    let followed = cloneDeep(tokenSelector.tokensFollowedSelector(state));
    const address = accountWallet?.getPaymentAddress();
    followed = [{ id: PRV_ID }].concat(followed);
    await accountWallet.getCoinsInMempoolCached();
    const tasks = followed.map(async ({ id: tokenID }) => {
      const unspentCoins = (await accountWallet.getUnspentCoinsExcludeSpendingCoins({ tokenID, version })) || [];
      return {
        tokenID,
        address,
        unspentCoins,
      };
    });
    const newUTXOS = (await Promise.all(tasks)).filter(item => !!item);
    batch(() => {
      dispatch(actionFetchingUTXO(false));
      dispatch(actionFetchedUTXO(newUTXOS));
    });
  } catch (e) {
    dispatch(actionFetchingUTXO(false));
    console.log('actionConditionConsolidate error: ', e);
  }
};

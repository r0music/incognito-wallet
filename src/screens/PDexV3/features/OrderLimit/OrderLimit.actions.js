import { PrivacyVersion } from 'incognito-chain-web-js/build/wallet';
import { activedTabSelector } from '@src/components/core/Tabs/Tabs.selector';
import { PRV } from '@src/constants/common';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { getBalance } from '@src/redux/actions/token';
import { getPrivacyDataByTokenID } from '@src/redux/selectors/selectedPrivacy';
import { ExHandler } from '@src/services/exception';
import { actionFetchListFollowingPools } from '@screens/PDexV3/features/Pools';
import convert from '@src/utils/convert';
import { actionSetNFTTokenData } from '@src/redux/actions/account';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import isEmpty from 'lodash/isEmpty';
import { change, focus } from 'redux-form';
import { actionGetPDexV3Inst } from '@screens/PDexV3';
import { batch } from 'react-redux';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_POOL_ID,
  ACTION_SET_INITIING,
  ACTION_SET_FEE_TOKEN,
  ACTION_SET_SELL_TOKEN,
  ACTION_SET_BUY_TOKEN,
  ACTION_RESET,
  ROOT_TAB_ORDER_LIMIT,
  TAB_BUY_ID,
  TAB_SELL_ID,
  formConfigs,
  ACTION_SET_PERCENT,
  ACTION_FETCHED_OPEN_ORDERS,
  ACTION_WITHDRAWING_ORDER,
  ACTION_FETCHED_WITHDRAWING_ORDER_TXS,
  ACTION_FETCHING_ORDERS_HISTORY,
  ACTION_FETCH_ORDERING,
  ACTION_FETCHED_ORDERS_HISTORY,
  ACTION_FETCH_FAIL_ORDERS_HISTORY,
  ACTION_FETCHING_ORDER_DETAIL,
  ACTION_FETCHED_ORDER_DETAIL,
} from './OrderLimit.constant';
import {
  poolSelectedDataSelector,
  inputAmountSelector,
  orderLimitDataSelector,
  orderDetailSelector,
} from './OrderLimit.selector';
import { calDefaultPairOrderLimit } from './OrderLimit.utils';

export const actionSetPercent = (payload) => ({
  type: ACTION_SET_PERCENT,
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

export const actionSetFeeToken = (payload) => ({
  type: ACTION_SET_FEE_TOKEN,
  payload,
});

export const actionSetPoolSelected = (payload) => ({
  type: ACTION_SET_POOL_ID,
  payload,
});

export const actionIniting = (payload) => ({
  type: ACTION_SET_INITIING,
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

export const actionSetSellToken = (selltokenId) => async (
  dispatch,
  getState,
) => {
  try {
    if (!selltokenId) {
      return;
    }
    dispatch(actionSetSellTokenFetched(selltokenId));
    const state = getState();
    const selltoken: SelectedPrivacy = getPrivacyDataByTokenID(state)(
      selltokenId,
    );
    const { pDecimals } = selltoken;
    const balance = await dispatch(getBalance(selltokenId));
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
      convert.toHumanAmount(sellOriginalAmount, pDecimals),
      pDecimals,
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

export const actionSetInputToken = ({ selltoken, buytoken }) => async (
  dispatch,
  getState,
) => {
  if (!selltoken || !buytoken) {
    return;
  }
  try {
    await dispatch(actionSetSellToken(selltoken));
    await dispatch(actionSetBuyToken(buytoken));
    if (selltoken !== PRV.id && buytoken !== PRV.id) {
      dispatch(getBalance(PRV.id));
    }
  } catch (error) {
    throw error;
  }
};

export const actionInit = (refresh = false) => async (dispatch, getState) => {
  try {
    await dispatch(actionIniting(true));
    if (refresh) {
      await dispatch(actionFetchListFollowingPools());
    }
    let state = getState();
    const pool = poolSelectedDataSelector(state);
    if (isEmpty(pool)) {
      return;
    }
    dispatch(actionSetPercent(0));
    const activedTab = activedTabSelector(state)(ROOT_TAB_ORDER_LIMIT);
    const token1: SelectedPrivacy = pool?.token1;
    const token2: SelectedPrivacy = pool?.token2;
    let selltokenId, buytokenId, x, y;
    switch (activedTab) {
    case TAB_BUY_ID: {
      selltokenId = token2.tokenId;
      x = token2;
      buytokenId = token1.tokenId;
      y = token1;
      break;
    }
    case TAB_SELL_ID: {
      selltokenId = token1.tokenId;
      x = token1;
      buytokenId = token2.tokenId;
      y = token2;
      break;
    }
    default:
      break;
    }
    await dispatch(
      actionSetInputToken({ selltoken: selltokenId, buytoken: buytokenId }),
    );
    state = getState();
    const sellInputAmount = inputAmountSelector(state)(formConfigs.selltoken);
    const { originalAmount: x0 } = sellInputAmount;
    const { rate, y0Fixed: buyAmount } = calDefaultPairOrderLimit({
      pool,
      x,
      y,
      x0,
    });
    batch(() => {
      dispatch(change(formConfigs.formName, formConfigs.buytoken, buyAmount));
      dispatch(change(formConfigs.formName, formConfigs.rate, rate));
    });
    await dispatch(actionSetNFTTokenData());
    dispatch(actionFetchWithdrawOrderTxs());
    dispatch(actionFetchOrdersHistory());
  } catch (error) {
    new ExHandler(error).showErrorToast;
  } finally {
    await dispatch(actionIniting(false));
  }
};

export const actionFetchedOpenOrders = (payload) => ({
  type: ACTION_FETCHED_OPEN_ORDERS,
  payload,
});

export const actionFetchedWithdrawingOrderTxs = (payload) => ({
  type: ACTION_FETCHED_WITHDRAWING_ORDER_TXS,
  payload,
});

export const actionFetchWithdrawOrderTxs = () => async (dispatch, getState) => {
  let withdrawTxs = [];
  try {
    const state = getState();
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const pool = poolSelectedDataSelector(state);
    if (!pool?.poolId) {
      return [];
    }
    const poolid = pool?.poolId;
    withdrawTxs = await pDexV3Inst.getWithdrawOrderTxs({
      poolid,
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    await dispatch(actionFetchedWithdrawingOrderTxs(withdrawTxs));
  }
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

export const actionFetchOrdersHistory = () => async (dispatch, getState) => {
  try {
    await dispatch(actionFetchingOrdersHistory());
    const state = getState();
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const pool = poolSelectedDataSelector(state);
    if (!pool) {
      return;
    }
    const orders =
      (await pDexV3Inst.getOrderLimitHistory({
        poolid: pool?.poolId,
        version: PrivacyVersion.ver2,
        token1ID: pool?.token1Id,
        token2ID: pool?.token2Id,
      })) || [];
    await dispatch(actionFetchedOrdersHistory(orders));
  } catch (error) {
    await dispatch(actionFetchFailOrderHistory());
    new ExHandler(error).showErrorToast();
  }
};

export const actionWithdrawingOrder = (payload) => ({
  type: ACTION_WITHDRAWING_ORDER,
  payload,
});

export const actionWithdrawOrder = ({ requestTx, txType }) => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const pool = poolSelectedDataSelector(state);
    const { sellTokenId, buyTokenId } = orderLimitDataSelector(state);
    if (!requestTx || !pool?.poolId) {
      return;
    }
    await dispatch(actionWithdrawingOrder(requestTx));
    const poolid = pool?.poolId;
    const data = {
      withdrawTokenIDs: [sellTokenId, buyTokenId],
      poolPairID: poolid,
      orderID: requestTx,
      amount: 0,
      version: PrivacyVersion.ver2,
      txType,
    };
    await pDexV3Inst.createAndSendWithdrawOrderRequestTx({ extra: data });
    await dispatch(actionFetchWithdrawOrderTxs());
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    await dispatch(actionWithdrawingOrder(requestTx));
  }
};

export const actionFetchingBookOrder = (payload) => ({
  type: ACTION_FETCH_ORDERING,
  payload,
});

export const actionBookOrder = () => async (dispatch, getState) => {
  await dispatch(actionFetchingBookOrder(true));
  try {
    const state = getState();
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const { poolId: poolPairID } = poolSelectedDataSelector(state);
    const {
      tokenId: tokenIDToSell,
      originalAmount: sellAmount,
    } = inputAmountSelector(state)(formConfigs.selltoken);
    const { originalAmount: minAcceptableAmount } = inputAmountSelector(state)(
      formConfigs.buytoken,
    );
    const extra = {
      tokenIDToSell,
      poolPairID,
      sellAmount,
      version: PrivacyVersion.ver2,
      minAcceptableAmount,
    };
    const tx = await pDexV3Inst.createAndSendOrderRequestTx({ extra });
    return tx;
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    await dispatch(actionFetchingBookOrder(false));
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
  const pool = poolSelectedDataSelector(state);
  if (!order?.requestTx || !pool) {
    return;
  }
  try {
    const { requestTx, fromStorage } = order;
    const { poolId, token1Id, token2Id } = pool;
    await dispatch(actionFetchingOrderDetail());
    const pDexV3 = await dispatch(actionGetPDexV3Inst());
    const params = {
      requestTx,
      poolid: poolId,
      token1ID: token1Id,
      token2ID: token2Id,
      fromStorage,
      version: PrivacyVersion.ver2,
    };
    console.log('params', params);
    _order = await pDexV3.getOrderLimitDetail(params);
  } catch (error) {
    _order = { ...order };
    new ExHandler(error).showErrorToast();
  } finally {
    _order = _order || order;
    dispatch(actionFetchWithdrawOrderTxs());
    dispatch(actionSetNFTTokenData());
    await dispatch(actionFetchedOrderDetail(_order));
  }
};
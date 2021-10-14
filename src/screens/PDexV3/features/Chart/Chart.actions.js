import { actionFetchListPools } from '@screens/PDexV3/features/Pools';
import { ExHandler } from '@src/services/exception';
import { getPDexV3Instance, actionGetPDexV3Inst } from '@screens/PDexV3';
import { defaultAccountWalletSelector } from '@src/redux/selectors/account';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_FETCHED_PRICE_HISTORY,
  ACTION_CHANGE_PERIOD,
  ACTION_CHANGE_DATA_POINT,
  ACTION_FETCHED_ORDER_BOOK,
  ACTION_SET_SELECTED_POOL_ID,
  ACTION_FETCHING_PRICE_HISTORY,
  ACTION_RESET,
} from './Chart.constant';
import { priceHistorySelector, orderBookSelector } from './Chart.selector';

export const actionReset = () => ({
  type: ACTION_RESET,
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

export const actionFetchingPriceHistory = () => ({
  type: ACTION_FETCHING_PRICE_HISTORY,
});

export const actionFetchedPriceHistory = (payload) => ({
  type: ACTION_FETCHED_PRICE_HISTORY,
  payload,
});

export const actionChangePeriod = (payload) => ({
  type: ACTION_CHANGE_PERIOD,
  payload,
});

export const actionChangeDataPoint = (payload) => ({
  type: ACTION_CHANGE_DATA_POINT,
  payload,
});

export const actionFetchPriceHistory = () => async (dispatch, getState) => {
  let data = [];
  try {
    const state = getState();
    const pdexV3Inst = await dispatch(actionGetPDexV3Inst());
    const { period: periodStr, datapoint, poolid } = priceHistorySelector(
      state,
    );
    if (!poolid) {
      return;
    }
    await dispatch(actionFetchingPriceHistory());
    let intervals = '';
    let period = '';
    switch (periodStr) {
    case '15m':
      period = 'PT15M';
      intervals = 'P1D';
      break;
    case '1h':
      period = 'PT1H';
      intervals = 'P3D';
      break;
    case '4h':
      period = 'PT4H';
      intervals = 'P7D';
      break;
    case '1d':
      period = 'P1D';
      intervals = 'P60D';
      break;
    case 'W':
      period = 'P1W';
      intervals = 'P12M';
      break;
    case 'M':
      period = 'P1M';
      intervals = 'P12M';
      break;
    default:
      break;
    }
    const res =
      (await pdexV3Inst.getPriceHistory({
        poolid,
        period,
        intervals,
      })) || [];
    data = res.slice(0, Math.min(datapoint, res.length));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
  dispatch(
    actionFetchedPriceHistory({
      data,
    }),
  );
};

export const actionFetchedOrderBook = (payload) => ({
  type: ACTION_FETCHED_ORDER_BOOK,
  payload,
});

export const actionFetchOrderBook = () => async (dispatch, getState) => {
  let data = [];
  try {
    const state = getState();
    const pdexV3Inst = await dispatch(actionGetPDexV3Inst());
    const { poolid } = orderBookSelector(state);
    console.log('fetch poolid', poolid);
    if (!poolid) {
      return [];
    }
    data = await pdexV3Inst.getPendingOrder({
      poolid,
    });
    data.sell = data.sell || [];
    data.buy = data.buy || [];
    await dispatch(actionFetchedOrderBook(data));
  } catch (error) {
    console.log('error actionFetchOrderBook', error);
    new ExHandler(error).showErrorToast();
  }
  return data;
};

export const actionFetch = () => async (dispatch) => {
  try {
    await dispatch(actionFetching());
    await Promise.all([
      dispatch(actionFetchListPools()),
      dispatch(actionFetchPriceHistory()),
      dispatch(actionFetchOrderBook()),
    ]);
    await dispatch(actionFetched());
  } catch (error) {
    await dispatch(actionFetchFail());
  }
};

export const actionSetSelectedPool = (payload) => ({
  type: ACTION_SET_SELECTED_POOL_ID,
  payload,
});

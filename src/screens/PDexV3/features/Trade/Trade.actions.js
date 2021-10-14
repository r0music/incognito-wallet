import { getInternalTokenList, getPTokenList } from '@src/redux/actions/token';
import { actionSetNFTTokenData } from '@src/redux/actions/account';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
} from './Trade.constant';

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

export const actionFetch = () => async (dispatch) => {
  try {
    await dispatch(actionFetching());
    const task = [
      dispatch(getPTokenList()),
      dispatch(getInternalTokenList()),
      dispatch(actionSetNFTTokenData()),
    ];
    await Promise.all(task);
    await dispatch(actionFetched());
  } catch (error) {
    await dispatch(actionFetchFail());
  }
};

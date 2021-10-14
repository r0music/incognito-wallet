import { defaultAccountWalletSelector } from '@src/redux/selectors/account';
import { ExHandler } from '@src/services/exception';
import { getPDexV3Instance } from '@screens/PDexV3';
import uniq from 'lodash/uniq';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_FETCHED_TRADING_VOLUME_24H,
  ACTION_FETCHED_LIST_POOLS,
  ACTION_FETCHED_LIST_POOLS_DETAIL,
  ACTION_FETCHED_LIST_POOLS_FOLLOWING,
  ACTION_FREE_LIST_POOL,
  ACTION_RESET,
} from './Pools.constant';
import { followPoolIdsSelector } from './Pools.selector';

export const actionReset = () => ({
  type: ACTION_RESET,
});

export const actionFetchedTradingVolume24h = (payload) => ({
  type: ACTION_FETCHED_TRADING_VOLUME_24H,
  payload,
});

export const actionFetchedListPools = (payload) => ({
  type: ACTION_FETCHED_LIST_POOLS,
  payload,
});

export const actionFetchedListPoolsDetail = (payload) => ({
  type: ACTION_FETCHED_LIST_POOLS_DETAIL,
  payload,
});

export const actionFetchedListPoolsFollowing = (payload) => ({
  type: ACTION_FETCHED_LIST_POOLS_FOLLOWING,
  payload,
});

export const actionFetchTradingVolume24h = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const tradingVolume24h = await pDexV3Inst.getTradingVolume24h('all');
    console.log('tradingVolume24h', tradingVolume24h);
    dispatch(actionFetchedTradingVolume24h(tradingVolume24h));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionSetFetching = ({ isFetching }) => ({
  type: ACTION_FETCHING,
  payload: { isFetching },
});

export const actionFetched = () => ({
  type: ACTION_FETCHED,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionFreeListPools = () => ({
  type: ACTION_FREE_LIST_POOL,
});

export const actionFetchListPools = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const followIds = followPoolIdsSelector(state);
    await dispatch(actionSetFetching({ isFetching: true }));
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const pools = (await pDexV3Inst.getListPools('all')) || [];
    let poolsIDs = pools.map((pool) => pool?.poolId) || [];
    poolsIDs = [...followIds, ...poolsIDs];
    poolsIDs = uniq(poolsIDs);
    const payload =
      poolsIDs
        .map((poolId) => pools.find((pool) => pool?.poolId === poolId))
        .filter(({ poolId }) => !!poolId) || [];
    // .filter((pool) => !!pool.isVerify)
    await dispatch(actionFetchedListPools(payload));
  } catch (error) {
    throw error;
  } finally {
    await dispatch(actionSetFetching({ isFetching: false }));
  }
};

export const actionFetchListFollowingPools = () => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const followIds = (await pDexV3Inst.getListFollowingPools()) || [];
    await dispatch(actionFetchedListPoolsFollowing({ followIds }));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionFetchPools = () => async (dispatch) => {
  try {
    dispatch(actionSetFetching({ isFetching: true }));
    await dispatch(actionFetchListFollowingPools());
    await dispatch(actionFetchListPools());
    dispatch(actionFetched());
  } catch (error) {
    new ExHandler(error).showErrorToast();
    dispatch(actionFetchFail());
  }
};

export const actionToggleFollowingPool = (poolId) => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const followPoolIds = followPoolIdsSelector(state);
    const isFollowed =
      followPoolIds.findIndex((_poolId) => _poolId === poolId) > -1;
    if (isFollowed) {
      await pDexV3Inst.removeFollowingPool({ poolId });
    } else if (!isFollowed) {
      await pDexV3Inst.addFollowingPool({ poolId });
    }
    await dispatch(actionFetchListFollowingPools());
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

import TYPES from '@screens/PDexV3/features/Staking/Staking.constant';
import {actionGetPDexV3Inst} from '@screens/PDexV3';
import {ExHandler} from '@services/exception';
import {getBalance} from '@src/redux/actions/token';
import {PRVIDSTR} from 'incognito-chain-web-js/build/wallet';
import {batch} from 'react-redux';
import uniq from 'lodash/uniq';
import {stakingSelector} from '@screens/PDexV3/features/Staking';
import {actionSetNFTTokenData} from '@src/redux/actions/account';

const actionFetching = ({ isFetching }) => ({
  type: TYPES.ACTION_FETCHING,
  payload: { isFetching }
});

const actionUpdateData = (payload) => ({
  type: TYPES.ACTION_UPDATE_DATA,
  payload,
});

const actionGetBalances = (tokenIDs) => async (dispatch) => {
  try {
    if (!tokenIDs.includes(PRVIDSTR)) {
      tokenIDs.push(PRVIDSTR);
    }
    tokenIDs.forEach((tokenId) => {
      dispatch(getBalance(tokenId));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

const actionFetchCoins = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const isFetching = stakingSelector.isFetchingCoinsSelector(state);
    if (isFetching) return;
    batch(() => {
      dispatch(actionFetching({ isFetching: true }));
      dispatch(actionSetNFTTokenData());
    });
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const data = (await pDexV3Inst.getStakingData()) || [];
    // const data = [
    //   {
    //     id: '0000000000000000000000000000000000000000000000000000000000000004-0ac5376ecb2b9ff2d738c53cd8e917fe2f07ee31126aab579a2fb3e666780d49',
    //     createdAt: '0001-01-01T00:00:00Z',
    //     updatedAt: '0001-01-01T00:00:00Z',
    //     amount: 96700,
    //     reward: {
    //       '0000000000000000000000000000000000000000000000000000000000000004': 1e9,
    //       '497159cf6c9f8d5a7cffd38d392649fee7b61558689ba631b26ef1b2dd8c9a06': 49000,
    //       'ffd8d42dc40a8d166ea4848baf8b5f6e9fe0e9c30d60062eb7d44a8df9e00854': 2172617,
    //     },
    //     tokenId: '0000000000000000000000000000000000000000000000000000000000000004',
    //     nftId: '0ac5376ecb2b9ff2d738c53cd8e917fe2f07ee31126aab579a2fb3e666780d49'
    //   },
    //   {
    //     id: '497159cf6c9f8d5a7cffd38d392649fee7b61558689ba631b26ef1b2dd8c9a06-0ac5376ecb2b9ff2d738c53cd8e917fe2f07ee31126aab579a2fb3e666780d49',
    //     createdAt: '0001-01-01T00:00:00Z',
    //     updatedAt: '0001-01-01T00:00:00Z',
    //     amount: 1e9,
    //     reward: {
    //       '0000000000000000000000000000000000000000000000000000000000000004': 128918,
    //       '4584d5e9b2fc0337dfb17f4b5bb025e5b82c38cfa4f54e8a3d4fcdd03954ff82': 400
    //     },
    //     tokenId: '497159cf6c9f8d5a7cffd38d392649fee7b61558689ba631b26ef1b2dd8c9a06',
    //     nftId: '0ac5376ecb2b9ff2d738c53cd8e917fe2f07ee31126aab579a2fb3e666780d49'
    //   },
    //   {
    //     id: '0000000000000000000000000000000000000000000000000000000000000004-06031997',
    //     createdAt: '0001-01-01T00:00:00Z',
    //     updatedAt: '0001-01-01T00:00:00Z',
    //     amount: 1e9,
    //     reward: {
    //       '0000000000000000000000000000000000000000000000000000000000000004': 1e9,
    //       '4584d5e9b2fc0337dfb17f4b5bb025e5b82c38cfa4f54e8a3d4fcdd03954ff82': 400
    //     },
    //     tokenId: '0000000000000000000000000000000000000000000000000000000000000004',
    //     nftId: '06031997'
    //   },
    //   {
    //     id: 'ffd8d42dc40a8d166ea4848baf8b5f6e9fe0e9c30d60062eb7d44a8df9e00854-06041997',
    //     createdAt: '0001-01-01T00:00:00Z',
    //     updatedAt: '0001-01-01T00:00:00Z',
    //     amount: 2e9,
    //     reward: {
    //       '0000000000000000000000000000000000000000000000000000000000000004': 128918,
    //       '4584d5e9b2fc0337dfb17f4b5bb025e5b82c38cfa4f54e8a3d4fcdd03954ff82': 400
    //     },
    //     tokenId: 'ffd8d42dc40a8d166ea4848baf8b5f6e9fe0e9c30d60062eb7d44a8df9e00854',
    //     nftId: '06041997'
    //   },
    // ];
    const tokenIDs = uniq((data || []).map(({ tokenId }) => tokenId));
    batch(() => {
      dispatch(actionGetBalances(tokenIDs));
      dispatch(actionUpdateData(data));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetching({ isFetching: false }));
  }
};

const actionSetInvestCoin = ({ tokenID }) => ({
  type: TYPES.ACTION_SET_INVEST_COIN,
  payload: { tokenID }
});

const actionSetWithdrawInvestCoin = ({ tokenID }) => ({
  type: TYPES.ACTION_SET_WITHDRAW_INVEST_COIN,
  payload: { tokenID }
});

const actionSetWithdrawRewardCoin = ({ tokenID }) => ({
  type: TYPES.ACTION_SET_WITHDRAW_REWARD_COIN,
  payload: { tokenID }
});

const actionChangeAccount = () => ({
  type: TYPES.ACTION_CHANGE_ACCOUNT,
});

const actionUpdateFetchingHistories = () => ({
  type: TYPES.ACTION_FETCHING_HISTORIES,
});

const actionUpdateFetchedHistories = () => ({
  type: TYPES.ACTION_FETCHED_HISTORIES,
});

const actionUpdateHistories = ({ histories, key }) => ({
  type: TYPES.ACTION_UPDATE_HISTORIES,
  payload: { histories, key }
});

const actionSetHistoriesKey = ({ tokenID, nftID }) => ({
  type: TYPES.ACTION_SET_HISTORIES_KEY,
  payload: { tokenID, nftID }
});

const actionFetchHistories = () => async (dispatch, getState) => {
  const state = getState(getState);
  const { isFetching, isLoadMore } = stakingSelector.stakingHistoriesStatus(state);
  if (isFetching || isLoadMore) return;
  try {
    dispatch(actionUpdateFetchingHistories());
    const { tokenID, nftID, key } = stakingSelector.stakingHistoriesKeySelector(state);
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const histories = (await pDexV3Inst.getStakingHistories({ tokenID, nftID })) || [];
    dispatch(actionUpdateHistories({ histories, key }));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionUpdateFetchedHistories());
  }
};

const actionUpdateFetchingPool = ({ isFetching }) => ({
  type: TYPES.ACTION_UPDATE_FETCHING_POOL,
  payload: { isFetching }
});

const actionSetStakingPools = ({ pools }) => ({
  type: TYPES.ACTION_SET_POOL,
  payload: { pools }
});

const actionFetchStakingPools = () => async (dispatch, getState) => {
  const state = getState(getState);
  const isFetching = stakingSelector.isFetchingPoolSelector(state);
  if (isFetching) return;
  try {
    batch(() => {
      dispatch(actionUpdateFetchingPool({ isFetching: true }));
      dispatch(actionSetNFTTokenData());
    });
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const pools = (await pDexV3Inst.getStakingPool()) || [];
    const tokenIds = pools.map(({ tokenId }) => tokenId);
    batch(() => {
      dispatch(actionSetStakingPools({ pools }));
      dispatch(actionGetBalances([...tokenIds, PRVIDSTR]));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionUpdateFetchingPool({ isFetching: false }));
  }
};


export default ({
  actionFetchCoins,
  actionSetInvestCoin,
  actionSetWithdrawInvestCoin,
  actionSetWithdrawRewardCoin,
  actionChangeAccount,
  actionSetHistoriesKey,
  actionFetchHistories,
  actionFetchStakingPools,
  actionGetBalances,
});

import { defaultAccountWalletSelector } from '@src/redux/selectors/account';
import { ExHandler } from '@src/services/exception';
import { getPDexV3Instance } from '@src/screens/PDexV3';
import {batch} from 'react-redux';
import {actionSetNFTTokenData} from '@src/redux/actions/account';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_SHARE_DETAIL,
} from './Portfolio.constant';
import { portfolioSelector } from './Portfolio.selector';

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

export const actionSetShareDetail = (payload) => ({
  type: ACTION_SET_SHARE_DETAIL,
  payload,
});

export const actionFetch = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { isFetching } = portfolioSelector(state);
    if (isFetching) {
      return;
    }
    await dispatch(actionFetching());
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });

    /** get list share  */
    const [{
      accessOTAContribute,
      nftContribute,
    }] = await Promise.all([
      await pDexV3Inst.getListShare(),
      await dispatch(actionSetNFTTokenData()),
    ]);

    /** get share detail need total Pool contribute, APY, AMP */
    const rawData = (accessOTAContribute || []).concat(nftContribute || []);
    const poolIds = rawData.map(({ poolId }) => poolId);
    let poolDetails = {};
    if (poolIds.length > 0) {
      const detailList = (await pDexV3Inst.getListPoolsDetail(poolIds)) || [];
      detailList.forEach((pool) => {
        poolDetails = {
          ...poolDetails,
          [pool.poolId]: pool
        };
      });
    }

    /** update reducer */
    batch(() => {
      dispatch(actionSetShareDetail(poolDetails));
      dispatch(actionFetched({
        nftShare: nftContribute,
        accessOTAShare: accessOTAContribute
      }));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
    await dispatch(actionFetchFail());
  }
};

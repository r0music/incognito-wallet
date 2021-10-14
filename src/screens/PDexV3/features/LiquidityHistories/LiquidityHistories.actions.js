import {liquidityHistorySelector, TYPES} from '@screens/PDexV3/features/LiquidityHistories';
import {batch} from 'react-redux';
import {ExHandler} from '@services/exception';
import {actionGetPDexV3Inst} from '@screens/PDexV3';

const actionFetchingContribute = ({ isFetching }) => ({
  type: TYPES.ACTION_SET_FETCHING_CONTRIBUTE_HISTORIES,
  payload: { isFetching }
});

const actionFetchingRemoveLP = ({ isFetching }) => ({
  type: TYPES.ACTION_SET_FETCHING_REMOVE_HISTORIES,
  payload: { isFetching }
});

const actionFetchingWithdrawFeeLP = ({ isFetching }) => ({
  type: TYPES.ACTION_SET_FETCHING_WITHDRAW_FEE_HISTORIES,
  payload: { isFetching }
});

const actionSetContribute = ({ histories }) => ({
  type: TYPES.ACTION_SET_CONTRIBUTE_HISTORIES,
  payload: { histories }
});

const actionSetRemoveLP = ({ histories }) => ({
  type: TYPES.ACTION_SET_REMOVE_HISTORIES,
  payload: { histories }
});

const actionSetWithdrawFeeLP = ({ histories }) => ({
  type: TYPES.ACTION_SET_WITHDRAW_FEE_HISTORIES,
  payload: { histories }
});

const actionGetContributeHistories = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const isFetching = liquidityHistorySelector.isFetchingContribute(state);
    if (isFetching) return;
    dispatch(actionFetchingContribute({ isFetching: true }));
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const histories = await pDexV3Inst.getContributeHistories();
    dispatch(actionSetContribute({ histories }));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetchingContribute({ isFetching: false }));
  }
};

const actionGetRemoveLPHistories = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const isFetching = liquidityHistorySelector.isFetchingRemoveLP(state);
    if (isFetching) return;
    dispatch(actionFetchingRemoveLP({ isFetching: true }));
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const histories = await pDexV3Inst.getRemoveLPHistories();
    dispatch(actionSetRemoveLP({ histories }));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetchingRemoveLP({ isFetching: false }));
  }
};

const actionGetWithdrawLPHistories = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const isFetching = liquidityHistorySelector.isFetchingWithdrawFeeLP(state);
    if (isFetching) return;
    dispatch(actionFetchingRemoveLP({ isFetching: true }));
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const histories = await pDexV3Inst.getWithdrawFeeLPHistories();
    dispatch(actionSetWithdrawFeeLP({ histories }));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetchingRemoveLP({ isFetching: false }));
  }
};

const actionGetHistories = () => async (dispatch) => {
  try {
    batch(() => {
      dispatch(actionGetContributeHistories());
      dispatch(actionGetRemoveLPHistories());
      dispatch(actionGetWithdrawLPHistories());
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export default ({
  actionFetchingContribute,
  actionFetchingRemoveLP,
  actionFetchingWithdrawFeeLP,

  actionSetContribute,
  actionSetRemoveLP,
  actionSetWithdrawFeeLP,

  actionGetContributeHistories,
  actionGetRemoveLPHistories,
  actionGetWithdrawLPHistories,
  actionGetHistories,
});

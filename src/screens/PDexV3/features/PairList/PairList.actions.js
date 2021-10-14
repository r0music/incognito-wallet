import TYPES from '@screens/PDexV3/features/PairList/PairList.constants';
import {ExHandler} from '@services/exception';
import {defaultAccountWalletSelector} from '@src/redux/selectors/account';
import {getPDexV3Instance} from '@screens/PDexV3';

const actionSetFetching = ({ isFetching }) => ({
  type: TYPES.ACTION_FETCHING,
  payload: { isFetching }
});

const actionSetPairs = ({ pairs }) => ({
  type: TYPES.ACTION_SET_PAIRS,
  payload: { pairs }
});

const actionFetchPairs = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const account = defaultAccountWalletSelector(state);
    dispatch(actionSetFetching({ isFetching: true }));
    const pDexV3Inst = await getPDexV3Instance({ account });
    const pairs = await pDexV3Inst.getListPair();
    dispatch(actionSetPairs({ pairs }));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionSetFetching({ isFetching: false }));
  }
};

export default ({
  actionSetFetching,
  actionFetchPairs,
});

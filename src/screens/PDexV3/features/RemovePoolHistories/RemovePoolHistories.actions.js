import TYPES from '@screens/PDexV3/features/RemovePoolHistories/RemovePoolHistories.constants';
import {defaultAccountSelector} from '@src/redux/selectors/account';
import {getPDexV3Instance} from '@screens/PDexV3';

const actionSetHistories = ({ histories, originalHistories, offset, isEnd }) => ({
  type: TYPES.ACTION_SET_HISTORIES,
  payload: { histories, originalHistories, offset, isEnd }
});

const actionFetchData = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const account = defaultAccountSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const histories = await pDexV3Inst.getRemovePoolHistories();
    dispatch(actionSetHistories({ histories }));
  } catch (error) {
    console.log('[contribute histories] actionFetchData: ', error);
  }
};

export default ({
  actionFetchData
});

import TYPES from '@screens/PDexV3/features/RemovePoolHistories/RemovePoolHistories.constants';

const initialState = {
  histories: [],
  originalHistories: [],
  offset: -1,
  isEnd: false
};

const removePoolHistoriesReducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_SET_HISTORIES:
    return {
      ...state,
      ...action.payload,
    };
  default:
    return state;
  }
};

export default removePoolHistoriesReducer;

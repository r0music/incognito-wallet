import TYPES from '@screens/PDexV3/features/PairList/PairList.constants';

const initialState = {
  isFetching: false,
  pairs: []
};

const pairListReducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_SET_PAIRS: {
    const { pairs } = action.payload;
    return {
      ...state,
      pairs,
    };
  }
  case TYPES.ACTION_FETCHING: {
    const { isFetching } = action.payload;
    return {
      ...state,
      isFetching,
    };
  }
  default:
    return state;
  }
};

export default pairListReducer;

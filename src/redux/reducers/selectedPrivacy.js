import types from '@src/redux/types/selectedPrivacy';

const initialState = { tokenID: null };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET:
      return {
        ...state,
        tokenID: action.data,
      };
    case types.CLEAR:
      return {
        ...state,
        tokenID: null,
      };

    default:
      return state;
  }
};

export default reducer;

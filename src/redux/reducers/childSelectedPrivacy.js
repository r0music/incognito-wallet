import type from '@src/redux/types/childSelectedPrivacy';

const initialState = { data: null };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case type.SET:
      return {
        ...state,
        data: action.data,
      };
    case type.CLEAR:
      return {
        ...state,
        data: null,
      };

    default:
      return state;
  }
};

export default reducer;

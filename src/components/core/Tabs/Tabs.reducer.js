import { ACTION_CHANGE_TAB } from './Tabs.constant';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case ACTION_CHANGE_TAB: {
    const { rootTabID, tabID } = action.payload;
    return {
      ...state,
      [rootTabID]: tabID,
    };
  }
  default:
    return state;
  }
};

export default reducer;

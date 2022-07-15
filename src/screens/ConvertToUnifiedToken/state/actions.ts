import Types from './types';

const setListUnifiedToken = (payload): any => {
  return {
    type: Types.SET_LIST_UNIFIED_TOKEN,
    payload,
  };
};

const fetchingListUnifiedToken = (): any => {
  return {
    type: Types.FETCHING_LIST_UNIFIED_TOKEN,
  };
};

const updateListUnifiedToken = (payload): any => {
  return {
    type: Types.UPDATE_LIST_UNIFIED_TOKEN,
    payload,
  };
};

export {
  setListUnifiedToken,
  fetchingListUnifiedToken,
  updateListUnifiedToken,
};

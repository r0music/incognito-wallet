import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_SHARE_DETAIL,
} from './Portfolio.constant';

const initialState = {
  isFetching: false,
  isFetched: false,

  // Data get from share detail, get AMP, total pool contribute...
  shareDetails: {},

  // Pure data collected from list share
  dataShare: {
    nftShare: [],
    accessOTAShare: [],
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ACTION_FETCHING: {
    return {
      ...state,
      isFetching: true,
    };
  }
  case ACTION_FETCHED: {
    const { nftShare, accessOTAShare } = action.payload;
    return {
      ...state,
      isFetching: false,
      isFetched: true,
      dataShare: {
        nftShare: nftShare || [],
        accessOTAShare: accessOTAShare || []
      }
    };
  }
  case ACTION_FETCH_FAIL: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
    };
  }
  case ACTION_SET_SHARE_DETAIL: {
    return {
      ...state,
      shareDetails: action.payload
    };
  }
  default:
    return state;
  }
};

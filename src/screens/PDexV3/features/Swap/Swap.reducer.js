import { ACCOUNT_CONSTANT } from 'incognito-chain-web-js/build/wallet';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_SELL_TOKEN,
  ACTION_SET_BUY_TOKEN,
  ACTION_SET_FEE_TOKEN,
  ACTION_SET_FOCUS_TOKEN,
  ACTION_SET_SELECTING_TOKEN,
  ACTION_SET_SWAPING_TOKEN,
  ACTION_SET_INITIING_SWAP,
  ACTION_RESET,
  ACTION_SET_PERCENT,
  ACTION_FETCH_SWAP,
  ACTION_FETCHED_LIST_PAIRS,
  ACTION_FETCHING_ORDERS_HISTORY,
  ACTION_FETCHED_ORDERS_HISTORY,
  ACTION_FETCH_FAIL_ORDERS_HISTORY,
  ACTION_FETCHING_ORDER_DETAIL,
  ACTION_FETCHED_ORDER_DETAIL,
  ACTION_SET_DEFAULT_PAIR,
  ACTION_SET_SELECTED_PLATFORM,
} from './Swap.constant';

const initialState = {
  isFetching: false,
  isFetched: false,
  selectedPlatform: null,
  data: {},
  dataOtherPlatforms: {}, 
  dataDisplays: {},
  platforms: [],
  buytoken: '',
  selltoken: '',
  feetoken: '',
  estimateTrade: null,
  focustoken: '',
  networkfee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
  swapingToken: false,
  selecting: false,
  initing: false,
  percent: 0,
  swaping: false,
  pairs: [],
  pancakeTokens: [],
  swapHistory: {
    isFetching: false,
    isFetched: false,
    data: [],
  },
  orderDetail: {
    order: {},
    fetching: false,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ACTION_SET_DEFAULT_PAIR: {
    const { selltoken, buytoken } = action.payload;
    return {
      ...state,
      selltoken,
      buytoken,
    };
  }
  case ACTION_FETCHING_ORDER_DETAIL: {
    const { orderDetail } = state;
    return {
      ...state,
      orderDetail: {
        ...orderDetail,
        fetching: true,
      },
    };
  }
  case ACTION_FETCHED_ORDER_DETAIL: {
    const { orderDetail } = state;
    return {
      ...state,
      orderDetail: {
        ...orderDetail,
        fetching: false,
        order: { ...action.payload },
      },
    };
  }
  case ACTION_FETCHING_ORDERS_HISTORY: {
    const { swapHistory } = state;
    return {
      ...state,
      swapHistory: { ...swapHistory, isFetching: true },
    };
  }
  case ACTION_FETCHED_ORDERS_HISTORY: {
    const { swapHistory } = state;
    return {
      ...state,
      swapHistory: {
        ...swapHistory,
        isFetching: false,
        isFetched: true,
        data: [...action.payload],
      },
    };
  }
  case ACTION_FETCH_FAIL_ORDERS_HISTORY: {
    const { swapHistory } = state;
    return {
      ...state,
      swapHistory: {
        ...swapHistory,
        isFetched: false,
        isFetching: false,
      },
    };
  }
  case ACTION_FETCHED_LIST_PAIRS: {
    return {
      ...state,
      pairs: action.payload.pairs,
      pancakeTokens: action.payload.pancakeTokens,
    };
  }
  case ACTION_FETCH_SWAP: {
    return {
      ...state,
      swaping: action.payload,
    };
  }
  case ACTION_SET_PERCENT: {
    return {
      ...state,
      percent: action.payload,
    };
  }
  case ACTION_RESET: {
    return initialState;
  }
  case ACTION_FETCHING: {
    return {
      ...state,
      isFetching: true,
    };
  }
  case ACTION_FETCHED: {
    return {
      ...state,
      isFetching: false,
      isFetched: true,
      data: { ...action.payload.data },
      dataOtherPlatforms: {...action.payload.dataOtherPlatforms},
      platforms: action.payload.platforms,
      dataDisplays: {...action.payload.dataDisplays},
    };
  }
  case ACTION_FETCH_FAIL: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
    };
  }
  case ACTION_SET_INITIING_SWAP: {
    return {
      ...state,
      initing: action.payload,
    };
  }
  case ACTION_SET_SELL_TOKEN: {
    return {
      ...state,
      selltoken: action.payload,
    };
  }
  case ACTION_SET_BUY_TOKEN: {
    return {
      ...state,
      buytoken: action.payload,
    };
  }
  case ACTION_SET_FEE_TOKEN: {
    return {
      ...state,
      feetoken: action.payload,
    };
  }
  case ACTION_SET_FOCUS_TOKEN: {
    return {
      ...state,
      focustoken: action.payload,
    };
  }
  case ACTION_SET_SELECTING_TOKEN: {
    return {
      ...state,
      selecting: action.payload,
    };
  }
  case ACTION_SET_SWAPING_TOKEN: {
    return {
      ...state,
      swapingToken: action.payload,
    };
  }
  case ACTION_SET_SELECTED_PLATFORM: {
    return {
      ...state,
      selectedPlatform: action.payload,
    };
  }
  default:
    return state;
  }
};

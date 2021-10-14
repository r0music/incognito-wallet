import { ACTION_SET_POOL_ID } from '@screens/PDexV3/features/OrderLimit/OrderLimit.constant';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_FETCHED_PRICE_HISTORY,
  ACTION_CHANGE_PERIOD,
  ACTION_FETCHED_ORDER_BOOK,
  ACTION_SET_SELECTED_POOL_ID,
  ACTION_FETCHING_PRICE_HISTORY,
  ACTION_RESET,
} from './Chart.constant';

const initialState = {
  isFetching: false,
  isFetched: false,
  poolid: '',
  orderBook: {
    data: {
      buy: [],
      sell: [],
    },
    decimal: 0.1,
  },
  priceHistory: {
    data: [],
    period: '15m',
    datapoint: 50,
    fetching: false,
  },
  tradingVolume24: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ACTION_RESET: {
    return {
      ...initialState,
    };
  }
  case ACTION_SET_POOL_ID: {
    return {
      ...state,
      poolid: action.payload,
    };
  }
  case ACTION_SET_SELECTED_POOL_ID: {
    return {
      ...state,
      poolid: action.payload,
    };
  }
  case ACTION_FETCHED_ORDER_BOOK: {
    return {
      ...state,
      orderBook: {
        ...state.orderBook,
        data: action.payload,
      },
    };
  }
  case ACTION_CHANGE_PERIOD: {
    return {
      ...state,
      priceHistory: {
        ...state.priceHistory,
        period: action.payload,
      },
    };
  }
  case ACTION_FETCHING_PRICE_HISTORY: {
    return {
      ...state,
      priceHistory: {
        ...state.priceHistory,
        fetching: true,
      },
    };
  }
  case ACTION_FETCHED_PRICE_HISTORY: {
    return {
      ...state,
      priceHistory: {
        ...state.priceHistory,
        ...action.payload,
        fetching: false,
      },
    };
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
      data: { ...action.payload },
    };
  }
  case ACTION_FETCH_FAIL: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
    };
  }
  default:
    return state;
  }
};

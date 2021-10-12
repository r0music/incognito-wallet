import { ACTION_SET_POOL_ID } from '@screens/PDexV3/features/OrderLimit/OrderLimit.constant';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_FETCHED_PRICE_HISTORY,
  ACTION_CHANGE_PERIOD,
  ACTION_FETCHED_ORDER_BOOK,
  ACTION_SET_SELECTED_POOL_ID,
} from './Chart.constant';

const initialState = {
  isFetching: true,
  isFetched: false,
  poolid: '',
  orderBook: {
    data: [],
    decimal: 0.1,
  },
  priceHistory: {
    data: {
      buy: [],
      sell: [],
    },
    period: '1d',
    datapoint: 50,
    fromtime: new Date().getTime(),
  },
  tradingVolume24: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ACTION_SET_POOL_ID: {
    console.log('SET POOL ID FOR ME', action.payload);
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
  case ACTION_FETCHED_PRICE_HISTORY: {
    return {
      ...state,
      priceHistory: {
        ...state.priceHistory,
        ...action.payload,
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
import {TYPES} from '@screens/PDexV3/features/Liquidity';
import {ACCOUNT_CONSTANT, PRVIDSTR} from 'incognito-chain-web-js/build/wallet';

const contributeState = {
  isFetching: false,
  poolId: '',
  accessKey: '',
  data: undefined,
  inputToken: undefined,
  outputToken: undefined,
  feeAmount: ACCOUNT_CONSTANT.MAX_FEE_PER_TX * 2,
  feeToken: PRVIDSTR,
};

const createPoolState = {
  focusField: undefined,
  inputToken: undefined,
  outputToken: undefined,
  feeAmount: ACCOUNT_CONSTANT.MAX_FEE_PER_TX * 2,
  feeToken: PRVIDSTR,
  amp: undefined,
  rate: undefined,
  isFetching: false,
  isTyping: false,
};

const removePoolState = {
  shareId: '',
  isFetching: false,
  isFetched: false,
  inputToken: undefined,
  outputToken: undefined,
  feeAmount: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
  feeToken: PRVIDSTR,
};

const initialState = {
  contribute: {
    ...contributeState
  },
  createPool: {
    ...createPoolState
  },
  removePool: {
    ...removePoolState
  },
};

const liquidityReducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_SET_CONTRIBUTE_ID: {
    const { poolId, nftId } = action.payload;
    return {
      ...state,
      contribute: {
        ...state.contribute,
        poolId,
        nftId,
      }
    };
  }
  case TYPES.ACTION_FETCHING_CONTRIBUTE_DATA: {
    const { isFetching } = action.payload;
    return {
      ...state,
      contribute: {
        ...state.contribute,
        isFetching,
      }
    };
  }
  case TYPES.ACTION_SET_CONTRIBUTE_POOL_DATA: {
    const { data, inputToken, outputToken } = action.payload;
    return {
      ...state,
      contribute: {
        ...state.contribute,
        data,
        inputToken,
        outputToken,
      }
    };
  }
  case TYPES.ACTION_SET_CREATE_POOL_TOKEN: {
    return {
      ...state,
      createPool: {
        ...state.createPool,
        ...action.payload
      }
    };
  }
  case TYPES.ACTION_FREE_CREATE_POOL_TOKEN: {
    return {
      ...state,
      createPool: {
        ...createPoolState
      }
    };
  }
  case TYPES.ACTION_SET_FETCHING_CREATE_POOL: {
    const { isFetching } = action.payload;
    return {
      ...state,
      createPool: {
        ...state.createPool,
        isFetching
      }
    };
  }
  case TYPES.ACTION_SET_FOCUS_CREATE_POOL: {
    const { focusField } = action.payload;
    return {
      ...state,
      createPool: {
        ...state.createPool,
        focusField
      }
    };
  }
  case TYPES.ACTION_SET_TYPING_CREATE_POOL: {
    const { isTyping } = action.payload;
    return {
      ...state,
      createPool: {
        ...state.createPool,
        isTyping
      }
    };
  }
  case TYPES.ACTION_SET_RATE_CREATE_POOL: {
    const { amp, rate } = action.payload;
    return {
      ...state,
      createPool: {
        ...state.createPool,
        amp,
        rate,
      }
    };
  }
  case TYPES.ACTION_SET_REMOVE_POOL_TOKEN: {
    return {
      ...state,
      removePool: {
        ...state.removePool,
        ...action.payload,
      }
    };
  }
  case TYPES.ACTION_SET_REMOVE_SHARE_ID: {
    return {
      ...state,
      removePool: {
        ...state.removePool,
        shareId: action.payload,
      }
    };
  }
  case TYPES.ACTION_FREE: {
    return {
      ...state,
      contribute: {
        ...contributeState
      },
      createPool: {
        ...createPoolState
      },
      removePool: {
        ...removePoolState
      },
    };
  }
  default:
    return state;
  }
};

export default liquidityReducer;

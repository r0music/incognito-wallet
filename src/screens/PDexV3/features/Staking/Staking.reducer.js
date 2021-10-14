import TYPES from '@screens/PDexV3/features/Staking/Staking.constant';
import {ACCOUNT_CONSTANT, PRVIDSTR} from 'incognito-chain-web-js/build/wallet';

const historiesState = {
  histories: {
    isFetching: false,
    isFetched: false,
    tokenID: undefined,
    nftID: undefined,
    data: {}
  }
};

const stakingState = {
  isFetching: false,
  coins: [],
  fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
  feeToken: PRVIDSTR,
};

const stakingPool = {
  isFetchingPool: false,
  pools: [],
};

const initialState = {
  ...stakingState,
  ...stakingPool,
  ...historiesState,
  invest: {
    tokenID: undefined,
  },
  withdrawInvest: {
    tokenID: undefined,
  },
  withdrawReward: {
    tokenID: undefined,
  },
};

const stakingReducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_FETCHING: {
    const { isFetching } = action.payload;
    return {
      ...state,
      isFetching,
    };
  }
  case TYPES.ACTION_UPDATE_DATA: {
    return {
      ...state,
      coins: action.payload
    };
  }
  case TYPES.ACTION_SET_INVEST_COIN: {
    const { tokenID } = action.payload;
    return {
      ...state,
      invest: {
        tokenID
      }
    };
  }
  case TYPES.ACTION_SET_WITHDRAW_INVEST_COIN: {
    const { tokenID } = action.payload;
    return {
      ...state,
      withdrawInvest: {
        tokenID
      }
    };
  }
  case TYPES.ACTION_SET_WITHDRAW_REWARD_COIN: {
    const { tokenID } = action.payload;
    return {
      ...state,
      withdrawReward: {
        tokenID
      }
    };
  }
  case TYPES.ACTION_CHANGE_ACCOUNT: {
    return {
      ...state,
      ...stakingState,
      ...historiesState,
    };
  }
  case TYPES.ACTION_FETCHING_HISTORIES: {
    return {
      ...state,
      histories: {
        ...state.histories,
        isFetching: true,
        isFetched: false,
      }
    };
  }
  case TYPES.ACTION_FETCHED_HISTORIES: {
    return {
      ...state,
      histories: {
        ...state.histories,
        isFetching: false,
        isFetched: true,
      }
    };
  }
  case TYPES.ACTION_SET_HISTORIES_KEY: {
    const { tokenID, nftID } = action.payload;
    return {
      ...state,
      histories: {
        ...state.histories,
        tokenID,
        nftID,
      }
    };
  }
  case TYPES.ACTION_UPDATE_HISTORIES: {
    const { histories, key } = action.payload;
    return {
      ...state,
      histories: {
        ...state.histories,
        data: {
          ...state.histories.data,
          [key]: histories
        }
      }
    };
  }
  case TYPES.ACTION_UPDATE_FETCHING_POOL: {
    const { isFetching } = action.payload;
    return {
      ...state,
      isFetchingPool: isFetching,
    };
  }
  case TYPES.ACTION_SET_POOL: {
    const { pools } = action.payload;
    return {
      ...state,
      pools,
    };
  }
  default:
    return state;
  }
};

export default stakingReducer;

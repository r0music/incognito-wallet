import {TYPES} from '@screens/PDexV3/features/LiquidityHistories';

const contributeState = {
  isFetching: false,
  histories: [],
};

const removeLPState = {
  isFetching: false,
  histories: [],
};

const withdrawFeeLPState = {
  isFetching: false,
  histories: [],
};

const initialState = {
  contribute: {
    ...contributeState
  },
  removeLP: {
    ...removeLPState
  },
  withdrawFeeLP: {
    ...withdrawFeeLPState
  },
};

const liquidityHistoriesReducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_SET_FETCHING_CONTRIBUTE_HISTORIES: {
    const { isFetching } = action.payload;
    return {
      ...state,
      contribute: {
        ...state.contribute,
        isFetching,
      }
    };
  }
  case TYPES.ACTION_SET_FETCHING_REMOVE_HISTORIES: {
    const { isFetching } = action.payload;
    return {
      ...state,
      removeLP: {
        ...state.removeLP,
        isFetching,
      }
    };
  }
  case TYPES.ACTION_SET_FETCHING_WITHDRAW_FEE_HISTORIES: {
    const { isFetching } = action.payload;
    return {
      ...state,
      withdrawFeeLP: {
        ...state.withdrawFeeLP,
        isFetching,
      }
    };
  }
  case TYPES.ACTION_SET_CONTRIBUTE_HISTORIES: {
    const { histories } = action.payload;
    return {
      ...state,
      contribute: {
        ...state.contribute,
        histories,
      }
    };
  }
  case TYPES.ACTION_SET_REMOVE_HISTORIES: {
    const { histories } = action.payload;
    return {
      ...state,
      removeLP: {
        ...state.removeLP,
        histories,
      }
    };
  }
  case TYPES.ACTION_SET_WITHDRAW_FEE_HISTORIES: {
    const { histories } = action.payload;
    return {
      ...state,
      withdrawFeeLP: {
        ...state.withdrawFeeLP,
        histories,
      }
    };
  }
  default:
    return state;
  }
};

export default liquidityHistoriesReducer;

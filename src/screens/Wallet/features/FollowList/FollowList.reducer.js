import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import FollowActionName from '@screens/Wallet/features/FollowList/FollowList.actionName';

const initialState = {
  isFetching: false,
  data: {}
};

const setToken = ({ OTAKey, token, data }) => {
  let newList = [...(data[OTAKey] || [])];
  const foundIndex = newList.findIndex((t) => t.id === token.id);
  if (foundIndex >= 0) {
    newList[foundIndex] = { ...newList[foundIndex], ...token };
  }
  return newList;
};

const followReducer = (state = initialState, action) => {
  switch (action.type) {
  case FollowActionName.ACTION_FETCHING_BALANCE: {
    return {
      ...state,
      isFetching: true,
    };
  }
  case FollowActionName.ACTION_FETCHED_BALANCE: {
    const { balance, OTAKey } = action.payload;
    return {
      ...state,
      isFetching: false,
      data: Object.assign(state.data, { [OTAKey]: balance } )
    };
  }
  case FollowActionName.ACTION_UPDATE_TOKEN_LIST: {
    const { newTokens, OTAKey } = action.payload;
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        [OTAKey]: newTokens
      }
    };
  }
  case FollowActionName.ACTION_FETCHED_TOKEN_BALANCE: {
    const { token, OTAKey } = action.payload;
    const newList = setToken({ OTAKey, token, data: state.data });
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        [OTAKey]: newList
      }
    };
  }
  default:
    return state;
  }
};

const persistConfig = {
  key: 'followWallet',
  storage: AsyncStorage,
  whitelist: ['data'],
  stateReconciler: autoMergeLevel2,
};

export default persistReducer(persistConfig, followReducer);

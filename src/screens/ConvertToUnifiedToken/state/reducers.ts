import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import Types from './types';

const initialState: any = {
  isFetchingListUnifiedToken: false,
  listUnifiedToken: [],
};

const reducer = (state = initialState, action: any): any => {
  let { type } = action;
  let newState: any = state;
  switch (type) {
    case Types.SET_LIST_UNIFIED_TOKEN:
      return {
        ...newState,
        isFetchingListUnifiedToken: false,
        listUnifiedToken: action.payload,
      };
    case Types.FETCHING_LIST_UNIFIED_TOKEN:
      return {
        ...newState,
        isFetchingListUnifiedToken: true,
      };
    default:
      break;
  }
  return newState;
};

export { reducer };

const persistConfig = {
  key: 'convertToUnifiedToken',
  storage: AsyncStorage,
  whitelist: [],
  stateReconciler: autoMergeLevel2,
};

export default persistReducer(persistConfig, reducer);

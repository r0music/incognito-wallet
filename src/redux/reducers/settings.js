import type from '@src/redux/types/settings';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import { VIDEOS_LIST } from '@src/redux/constants/configs';

const initialState = {
  data: [],
  error: null,
  videos: VIDEOS_LIST,
  newUserTutorial: false,
  codepushVersion: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case type.SET_SETTINGS:
    return {
      ...state,
      data: action.payload
    };
  case type.SET_VIDEO_TUTORIAL:
    return {
      ...state,
      videos: action.payload || []
    };
  case type.SET_CODE_PUSH_VERSION:
    return {
      ...state,
      codepushVer: action.payload || ''
    };
  case type.SET_NEW_USER_TUTORIAL:
    return {
      ...state,
      newUserTutorial: action.payload
    };
  default:
    return state;
  }
};

const persistConfig = {
  key: 'settings',
  storage: AsyncStorage,
  whitelist: [
    'videos',
    'codepushVersion',
    'newUserTutorial'
  ],
  stateReconciler: autoMergeLevel2,
};

export default persistReducer(persistConfig, reducer);

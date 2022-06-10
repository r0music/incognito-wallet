import type from '@src/redux/types/settings';
import {getSettings as getSettingsAPI} from '@services/api/settings';
import {getFunctionConfigs} from '@services/api/misc';

export const setSettings = (data) => ({
  type: type.SET_SETTINGS,
  payload: data
});

export const setVideoTutorial = (data) => ({
  type: type.SET_VIDEO_TUTORIAL,
  payload: data
});

export const getSettings = () => async dispatch => {
  const settings = await getSettingsAPI();
  return dispatch(setSettings(settings));
};

export const getVideoTutorial = () => async dispatch => {
  try {
    const configs = await getFunctionConfigs() || {};
    const videos = configs.find(item => item.name === 'video_tutorial');
    if (videos) {
      const tutorial = JSON.parse(videos.message) || [];
      return dispatch(setVideoTutorial(tutorial));
    }
  } catch (e) {
    console.log('getVideoTutorial errors: ', e);
  }
};

export const setNewUserTutorial = (payload) =>({
  type: type.SET_NEW_USER_TUTORIAL,
  payload,
});

export const setCodePushVersion = (data) => ({
  type: type.SET_CODE_PUSH_VERSION,
  payload: data
});

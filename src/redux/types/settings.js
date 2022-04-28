import { genNamspace } from '@src/utils/reduxUtils';

const n = genNamspace('SETTINGS');

const TYPES = {
  SET_SETTINGS: n('SET_SETTINGS'),
  SET_VIDEO_TUTORIAL: n('SET_VIDEO_TUTORIAL'),
  SET_NEW_USER_TUTORIAL: n('SET_NEW_USER_TUTORIAL'),
  SET_CODE_PUSH_VERSION: n('SET_CODE_PUSH_VERSION')
};

export default TYPES;

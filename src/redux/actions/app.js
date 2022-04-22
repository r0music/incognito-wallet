import type from '@src/redux/types/app';
import { CONSTANT_APP } from '@src/constants';
import { updateMetrics } from '@src/services/api/user';
import { accountSelector } from '@src/redux/selectors';
import { profileSelector, userIdSelector } from '@src/screens/Profile';

export const setAppStatus = status => {
  if (Object.values(CONSTANT_APP.STATUS).includes(status)) {
    return ({
      type: type.SET_STATUS,
      data: status
    });
  }
};

export const requestUpdateMetrics = (type) => async () => {
  try {
    return updateMetrics({ type });
  } catch (e) {
    console.log('Ignore: ', e);
  }
};
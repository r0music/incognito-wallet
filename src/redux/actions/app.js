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

export const requestUpdateMetrics = (type) => async (dispatch, getState) => {
  try {
    const state = getState();
    const profile = profileSelector(state);
    if (profile === undefined) {
      return;
    }
    const userId = profile?.data?.id;
    const account = accountSelector.defaultAccountSelector(state);
    dispatch(updateMetrics({
      userId, 
      type, 
      paymentAddress: account?.paymentAddress,
    }));
  } catch (e) {
    console.log('Ignore: ', e);
  }

  return;
};
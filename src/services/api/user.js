import { ANALYTICS } from '@src/constants';
import userModel from '@src/models/user';
import axios from 'axios';
import http from '../http';


// export const subscribeEmail = email => http.post('/auth/subscribe', {
//   Email: email,
// });

// export const getTokenFromEmail = email => http.post('/auth/token', {
//   Email: email,
// });

export const getToken = (deviceId, deviceFirebaseToken) => {
  if (!deviceId)  throw new Error('Missing device ID');
  if (!deviceFirebaseToken)  throw new Error('Missing device firebase token');

  return http.post('/auth/new-token', { DeviceID: deviceId, DeviceToken:deviceFirebaseToken })
    .then(userModel.parseTokenData);
};

export const updateMetrics = info => async (dispatch, getState) => {
  if (!info?.userId || !info?.type || !info?.paymentAddress) {
    console.log('info is invalid');
    return;
  }
  let timenow = Math.round((new Date()).getTime() / 1000);
  try {
    axios.post(ANALYTICS.ANALYTIC_ENDPOINT, {
      created_at: timenow,
      user_id: info?.userId.toString(),
      type_id: info?.type,
      payment_address: info?.paymentAddress,
    });
  } catch(e) {
    console.log('Ignore: ', e);
  }
};
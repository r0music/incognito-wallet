/* eslint-disable import/no-cycle */
import { setTokenHeader } from '@src/services/http';
import { getToken as getFirebaseToken } from '@src/services/firebase';
import DeviceInfo from 'react-native-device-info';
import { getToken as getUserToken } from '@src/services/api/user';
import LocalDatabase from '@utils/LocalDatabase';
import { v4 } from 'uuid';
import { cachePromise } from './cache';

export const getTokenNoCache = async () => {
  let firebaseToken = '';
  try {
    firebaseToken = await getFirebaseToken();
  } catch (error) {
    firebaseToken = (await LocalDatabase.getDeviceId()) || v4() + new Date().getTime();
  }
  const uniqueId =
    (await LocalDatabase.getDeviceId()) || v4();
  const tokenData = await getUserToken(uniqueId, firebaseToken);
  await LocalDatabase.saveDeviceId(uniqueId);
  const { token } = tokenData;
  return token;
};

export const getToken = async () => {
  const result = await cachePromise(
    'AUTH_TOKEN',
    () => getTokenNoCache(),
    100000000000,
  );
  return result;
};

export const login = async () => {
  const token = await getToken();
  setTokenHeader(token);
  return token;
};

global.login = login;

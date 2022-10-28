import firebase from 'react-native-firebase';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import { v4 } from 'uuid';
import LocalDatabase from '@utils/LocalDatabase';

const TAG = 'firebase';

export const logEvent = async (event, data = {}) => {
  if (!_.isEmpty(event)) {
    try {
      const deviceId = v4();
      const instance = firebase.analytics();
      const result = await instance.logEvent(event, {
        deviceId,
        ...data,
      });

      // console.debug('FIREBASE EVENT', event);
    } catch (error) {
      console.debug(TAG, 'logEvent error = ', error);
    }
  }
};

export const getToken = async () => {
  let firebaseToken = '';
  try {
    firebaseToken = await LocalDatabase.getFirebaseId();
    if (!firebaseToken) {
      firebaseToken = v4() + new Date().getTime();
      await LocalDatabase.saveFirebaseId(firebaseToken);
    }
  } catch {
    firebaseToken = v4() + new Date().getTime();
  }
  console.log('FIREBASE TOKEN', firebaseToken);
  return firebaseToken;
};

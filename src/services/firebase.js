// import firebase from 'react-native-firebase';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import { v4 } from 'uuid';

const TAG = 'firebase';


///OK
export const logEvent = async (event, data = {}) => {
  if (!_.isEmpty(event)) {
    try {
      const deviceId = DeviceInfo.getUniqueId();
      // const instance = firebase.analytics();
      // const result = await instance.logEvent(event, {
      //   deviceId,
      //   ...data,
      // });

      // console.debug('FIREBASE EVENT', event);
    } catch (error) {
      console.debug(TAG, 'logEvent error = ', error);
    }
  }
};

export const getToken = async () => {
  // let firebaseToken = '';
  // try {
  //   // firebaseToken = await firebase.messaging().getToken();
  // } catch {
  //   firebaseToken = v4();
  // }
  let firebaseToken = v4();
  console.log('FIREBASE TOKEN', firebaseToken);
  return firebaseToken;
};

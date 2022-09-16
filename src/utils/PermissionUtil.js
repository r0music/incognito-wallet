// eslint-disable-next-line react-native/split-platform-components
import {PermissionsAndroid, Platform} from 'react-native';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { isIOS, isAndroid } from './platform';

const cameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'To scan QR codes, please give Incognito access to your camera.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );
    return Promise.resolve(granted === PermissionsAndroid.RESULTS.GRANTED);
  } catch (err) {
    console.warn(err);
    return Promise.reject(err);
  }
};

const CameraRationale = {
  title: 'Camera Permission',
  message: 'To scan QR codes, please give Incognito access to your camera.',
  buttonNeutral: 'Ask Me Later',
  buttonNegative: 'Cancel',
  buttonPositive: 'OK'
};

const handleCameraPermission = () => {
  return new Promise((resolve, reject) => {
    try {
      check(Platform.select({ ios: PERMISSIONS.IOS.CAMERA, android: PERMISSIONS.ANDROID.CAMERA }))
        .then((result) => {
          switch (result) {
          case RESULTS.DENIED:
            //The permission has not been requested / is denied but requestable,
            request(
              Platform.select({
                ios: PERMISSIONS.IOS.CAMERA,
                android: PERMISSIONS.ANDROID.CAMERA
              }),
              CameraRationale)
              .then((granted) => {
                resolve(granted === RESULTS.GRANTED);
              });
            break;
            // return Promise.resolve(granted === PermissionsAndroid.RESULTS.GRANTED);
          case RESULTS.GRANTED: //The permission is granted
            resolve(true);
            break;
          case RESULTS.UNAVAILABLE: //This feature is not available (on this device / in this context)
            resolve(false);
            break;
          case RESULTS.BLOCKED: //The permission is denied and not requestable anymore
            resolve(false);
            break;
          }
        });
    } catch (error) {
      console.warn(error);
      reject(error);
    }
  });
};

const locationPermission = async () => {
  if (isAndroid()) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'To find Node, please give this app access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );
      return Promise.resolve(granted === PermissionsAndroid.RESULTS.GRANTED);
    } catch (err) {
      console.warn(err);
      return Promise.reject(err);
    }
  } else {
    try {
      const granted = await request(
        PERMISSIONS.IOS.LOCATION_ALWAYS);
      const whenInUse = await request(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return Promise.resolve(granted === RESULTS.GRANTED || whenInUse === RESULTS.GRANTED);
    } catch (err) {
      console.warn(err);
      return Promise.reject(err);
    }
  }
};

// I dont want just add props inside, because of we will defrag it then soon
const checkPermission = () => {
  if (isIOS()) {
    return new Promise((resolve, reject) => check(PERMISSIONS.IOS.LOCATION_ALWAYS)
      .then((result) => {
        switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
        }
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      })
    );
  }
  else {
    return new Promise((resolve, reject) => check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then((result) => {
        switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
        }
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      })
    );
  }
};

const ENUM_RESULT_PERMISSION = {
  UNAVAILABLE: {
    CODE: RESULTS.UNAVAILABLE,
    MESSAGE: 'This feature is not available for requesting. Please go to Settings and enable it to ALWAYS'
  },
  DENIED: {
    CODE: RESULTS.DENIED,
    MESSAGE: 'The permission has not been requested or is denied. Please go to Settings and enable it to ALWAYS'
  },
  GRANTED: {
    CODE: RESULTS.GRANTED,
    MESSAGE: 'The permission is granted'
  },
  BLOCKED: {
    CODE: RESULTS.BLOCKED,
    MESSAGE: 'The permission is denied. Please go to Settings and enable it to ALWAYS'
  },
};

export { cameraPermission, locationPermission, checkPermission, ENUM_RESULT_PERMISSION, handleCameraPermission };


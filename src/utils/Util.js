/**
 * @providesModule Util
 */
import { CustomError } from '@src/services/exception';
import knownCode from '@src/services/exception/customError/code/knownCode';
import _ from 'lodash';
import { Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { NavigationActions, StackActions } from 'react-navigation';
// import timer from 'react-native-timer';
const timer = require('react-native-timer');

const chars = 'abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890';
const TAG = 'Util';
export default class Util {
  static getIconLinkWithSymbol=(symbol = '')=>{
    return `./node_modules/cryptocurrency-icons/32@2x/color/${_.toLower(symbol)}@2x.png`;
  }
  static resetRoute = (navigation, routeName, params = {}) => {
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName, params })]
    });

    navigation.dispatch(resetAction);
  };
  static hashCode = str => {
    return str
      .split('')
      .reduce(
        (prevHash, currVal) =>
          ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
        0
      );
  };

  static phoneInfo = () => {
    try {
      return `${DeviceInfo.getBrand()}-${DeviceInfo.getSystemVersion()}`;
    } catch (error) {
      return'';
    }
  };

  static openSetting = async (
    sessionName = '',
    isOpenSettingDefault = true
  ) => {
    try {
      const isSupported = await Linking.canOpenURL(
        `app-settings://${sessionName}`
      );
      if (isSupported) {
        Linking.openURL(`app-settings://${sessionName}`);
      } else if (isOpenSettingDefault) {
        Linking.openURL('app-settings:');
      }
      return Promise.resolve(isSupported);
    } catch (error) {
      return Promise.reject('error');
    }
  };

  static currentDateString = (): String => {
    try {
      let today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();

      today = `${mm}/${dd}/${yyyy}`;
      return today;
    } catch (error) {
      console.log(TAG, ' currentDateString error');
    }
    return '';
  };

  static delay = timeSecond =>
    new Promise(res => setTimeout(() => res(), timeSecond * 1000));

  static makeCancelable = promise => {
    let rejectFn;

    const wrappedPromise = new Promise((resolve, reject) => {
      rejectFn = reject;

      Promise.resolve(promise)
        .then(resolve)
        .catch(reject);
    });

    wrappedPromise.cancel = () => {
      rejectFn({ canceled: true });
    };

    return wrappedPromise;
  };
  static isEmailValid(email) {
    // eslint-disable-next-line no-useless-escape
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  }

  static isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  static timeout = (fn, timeSecond = 1) => {
    return new Promise(resolve => {
      setTimeout(() => resolve(fn), timeSecond * 1000);
    });
  };
  static until= async (fn)=> {
    while (!fn()) {
      await Util.delay(0);
    }
  }

  /**
   * @param {Promise} promiseFunc - promiseFunc will be retried when return Error object.
   * @param {Int} count  = 6
   * @param {Int} delayToTry  = 1 second
   */
   static tryAtMost = async(promiseFunc, count = 6,delayToTry = 1) =>{
     if (count > 0 && promiseFunc ) {
       const result = await promiseFunc().catch(e => e);
       console.log(`tryAtMost result = ${result}, count = ${count}---isEROR = ${result instanceof Error}`);
       if (result instanceof Error) {
         if(_.isNumber(delayToTry)){
           await Util.delay(delayToTry);
         }
         return await Util.tryAtMost(promiseFunc, count - 1, delayToTry);
       }
       return result;
     }
     return Promise.reject(`Tried ${count} times and failed`);
   };

  static createRandomString= (length) =>{

    let pwd = _.sampleSize(chars, length || 12) ; // lodash v4: use _.sampleSize
    return pwd.join('');
  }

  /**
   * @param {Promise} promiseObj
   * @param {Int} timeSecond  = 1
   */
  static excuteWithTimeout = (promiseObj, timeSecond = 1) => {
    return new Promise(function(resolve, reject) {
      const ss = Util.createRandomString(10);
      timer.setTimeout(ss,function() {
        reject(new CustomError(knownCode.timeout_promise,{message:'timeout '+ ss}));
        timer.clearTimeout(ss);
      }, timeSecond * 1000);
      const resolveWrap = (data?)=>{
        timer?.clearTimeout(ss);
        resolve(data);
      };
      const rejectWrap = (error?)=>{
        timer?.clearTimeout(ss);
        reject(error);
      };
      promiseObj.then(resolveWrap, rejectWrap);
    });
  };

  static sleep = (sleepTime = 2000) => {
    return new Promise(resolve => setTimeout(resolve, sleepTime));
  };
}

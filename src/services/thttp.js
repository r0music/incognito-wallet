import axios from 'axios';
import { getToken as getFirebaseToken } from '@services/firebase';
import DeviceInfo from 'react-native-device-info';
import LocalDatabase from '@utils/LocalDatabase';
import userModel from '@models/user';
import { v4 } from 'uuid';
import { CustomError, ErrorCode, ExHandler } from './exception';

const HEADERS = { 'Content-Type': 'application/json' };
const TIMEOUT = 20000;
let currentAccessToken = '';

const instance = axios.create({
  baseURL: 'https://test-api2.incognito.org',
  timeout: TIMEOUT,
  headers: {
    ...HEADERS,
    Authorization: '',
  },
});

let pendingSubscribers = [];
let isAlreadyFetchingAccessToken = false;

function onAccessTokenFetched(accessToken) {
  pendingSubscribers = pendingSubscribers.filter((callback) =>
    callback(accessToken),
  );
}

function addSubscriber(callback) {
  pendingSubscribers.push(callback);
}

async function login() {
  try {
    let firebaseToken = '';
    try {
      firebaseToken = await getFirebaseToken();
    } catch (error) {
      // Use this to authenticate app for device without Google Services (Chinese Phone)
      firebaseToken = (await LocalDatabase.getDeviceId()) || v4() + new Date().getTime();
      console.debug('Can not get firebase token');
    }
    const uniqueId =
      (await LocalDatabase.getDeviceId()) || v4();
    const tokenData = await instance
      .post('/auth/new-token', {
        DeviceID: uniqueId,
        DeviceToken: firebaseToken,
      })
      .then(userModel.parseTokenData);
    const { token } = tokenData;
    setTokenHeader(token);
    return token;
  } catch (e) {
    throw new CustomError(ErrorCode.user_login_failed, { rawError: e });
  }
}

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: 'Bearer ' + currentAccessToken,
      },
    };
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (res) => {
    const config = res?.config;
    const result = res?.data?.Result;
    return Promise.resolve(result);
  },
  (errorData) => {
    const errResponse = errorData?.response;
    const originalRequest = errorData?.config;

    // can not get response, alert to user
    if (errorData?.isAxiosError && !errResponse) {
      return new ExHandler(
        new CustomError(ErrorCode.network_make_request_failed),
      ).throw();
    }

    // Unauthorized
    if (errResponse?.status === 401) {
      if (!isAlreadyFetchingAccessToken) {
        isAlreadyFetchingAccessToken = true;
        login().then((token) => {
          isAlreadyFetchingAccessToken = false;
          onAccessTokenFetched(token);
        });
      }

      const retryOriginalRequest = new Promise((resolve) => {
        addSubscriber((accessToken) => {
          originalRequest.headers.Authorization = 'Bearer ' + accessToken;
          setTokenHeader(accessToken);
          resolve(instance(originalRequest));
        });
      });

      return retryOriginalRequest;
    }

    // get response of error
    // wrap the error with CustomError to custom error message, or logging
    const data = errResponse?.data;
    if (data && data.Error) {
      throw new CustomError(data.Error?.Code, {
        name: CustomError.TYPES.API_ERROR,
        message: data.Error?.Message,
      });
    }

    return Promise.reject(errorData);
  },
);

export const setTokenHeader = (token) => {
  try {
    currentAccessToken = token;
    axios.defaults.headers.Authorization = `Bearer ${token}`;
  } catch {
    throw new Error('Can not set token request');
  }
};

export default instance;

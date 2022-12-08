import axios from 'axios';
import {CONSTANT_CONFIGS} from '@src/constants';
import Log from '@src/services/log';
import {CustomError, ErrorCode, ExHandler} from './exception';

const CancelToken = axios.CancelToken;
const HEADERS = {'Content-Type': 'application/json'};
const TIMEOUT = 45000;
const sources = {};

const CANCEL_MESSAGE = 'Request cancelled';

export const CANCEL_KEY = 'cancelPrevious';

let currentAccessToken = '';

const instance = axios.create({
  baseURL: CONSTANT_CONFIGS.API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    ...HEADERS,
    Authorization: '',
  },
});

let pendingSubscribers = [];
let isAlreadyFetchingAccessToken = false;

function onAccessTokenFetched(accessToken) {
  pendingSubscribers = pendingSubscribers.filter(callback =>
    callback(accessToken),
  );
}

function addSubscriber(callback) {
  pendingSubscribers.push(callback);
}

// Add a request interceptor
instance.interceptors.request.use(
  config => {
    const newConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: 'Bearer ' + currentAccessToken,
      }
    };

    const path = config.url;
    if (path.includes(CANCEL_KEY)) {
      if (sources[path]) {
        sources[path].cancel(CANCEL_MESSAGE);
      }

      sources[path] = CancelToken.source();
      newConfig.cancelToken = sources[path].token;
    }
    return newConfig;
  },
  error => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  res => {
    const result = res?.data?.Result;
    return Promise.resolve(result);
  },
  errorData => {
    if (errorData?.message === CANCEL_MESSAGE) {
      throw new CustomError(ErrorCode.api_request_cancelled);
    }

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
      Log.log('Token was expired');

      if (!isAlreadyFetchingAccessToken) {
        isAlreadyFetchingAccessToken = true;
        if (typeof global.login === 'function') {
          global.login().then(token => {
            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched(token);
          });
        } else {
          console.debug('Token was expired, but can not re-new it!');
        }
      }

      const retryOriginalRequest = new Promise(resolve => {
        addSubscriber(accessToken => {
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

export const setTokenHeader = token => {
  try {
    if (!token) return;
    currentAccessToken = token;
    axios.defaults.headers.Authorization = `Bearer ${token}`;
  } catch {
    throw new Error('Can not set token request');
  }
};

export const getRuntimeAccessToken = () => {
  return currentAccessToken;
};

export default instance;
/**
 * Document: https://github.com/axios/axios#instance-methodsaxios#request(config)
    axios#get(url[, config])
    axios#delete(url[, config])
    axios#head(url[, config])
    axios#options(url[, config])
    axios#post(url[, data[, config]])
    axios#put(url[, data[, config]])
    axios#patch(url[, data[, config]])
    axios#getUri([config])
 */

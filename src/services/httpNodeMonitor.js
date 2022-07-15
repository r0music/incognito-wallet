import axios from 'axios';
import { CONSTANT_CONFIGS } from '@src/constants';

const HEADERS = { 'Content-Type': 'application/json' };
const TIMEOUT = 20000;

const instance = axios.create({
  baseURL: CONSTANT_CONFIGS.NODE_MONITOR_URL,
  timeout: TIMEOUT,
  headers: {
    ...HEADERS,
    Authorization: '',
  },
});

instance.interceptors.response.use(
  (res) => {
    const result = res?.data;
    const error = res?.data?.Error;
    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve(result);
  },
  async (error) => {
    if (error?.isAxiosError && !error?.response) {
      throw new Error('Send request API failed');
    }
    return Promise.reject(error);
  },
);

export default instance;
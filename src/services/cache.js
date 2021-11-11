export const caches = {};

export const KEYS = {
  PoolConfig: 'pool-configs',
  PoolUserData: (paymentAddress) => `pool-data-${paymentAddress}`,
  PoolHistory: (paymentAddress) => `pool-history-${paymentAddress}`,
  DAppAddress: 'dapp-address',
  FeatureConfigs: 'feature-configs',
  PDESTATE: 'pdestate',
  PDEX_HISTORY: 'history-pdex-trade',
  P_TOKEN: 'ptoken',
  P_CUSTOM_TOKEN: 'pcustomtoken',
  PancakeTokens: 'pancake-tokens',
};

/**
 * Cache data
 * @param key
 * @param data
 * @param expiredTime
 */
export function cache(key, data, expiredTime) {
  caches[key] = {
    data: data,
    expiredTime: new Date().getTime() + expiredTime,
  };
}

export const EXPIRED_TIME = 40000;
/**
 *
 * @param {string} key should be a key of KEYS dictionary above
 * @param {function} promiseFunc
 * @param {number} expiredTime in ms
 * @returns {Promise<*>}
 */
export async function cachePromise(key, promiseFunc, expiredTime = EXPIRED_TIME) {
  const cachedData = getCache(key);
  if (cachedData !== null) {
    return cachedData;
  }
  const data = await promiseFunc();
  if (data) {
    cache(key, data, expiredTime);
  }
  return data;
}

/**
 * Get cache data
 * @param key
 * @returns {null|*}
 */
export function getCache(key) {
  const cacheData = caches[key];

  if (cacheData && cacheData.expiredTime > new Date().getTime()) {
    return cacheData.data;
  }

  return null;
}

/**
 * @param key
 */

export const clearCache = (key) => {
  if (!caches[key]) {
    return;
  }
  return delete caches[key];
};

export const clearAllCaches = () => {
  Object.keys(caches).forEach((key) => delete caches[key]);
};

export const clearWalletCaches = () => {
  Object.keys(caches).forEach((key) => {
    if (key.includes(KEYS.PDEX_HISTORY)) {
      delete caches[key];
    }
  });
};

/* eslint-disable import/no-cycle */
import { CONSTANT_CONFIGS, CONSTANT_KEYS } from '@src/constants';
import storage from '@src/services/storage';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import {
  byteToHexString,
  Validator,
} from 'incognito-chain-web-js/build/wallet';
import { misc, codec } from 'incognito-chain-web-js/lib/privacy/sjcl';
import { randomBytes } from 'react-native-randombytes';
import isEqual from 'lodash/isEqual';
import { cachePromise } from '@src/services/cache';
import LocalDatabase from '@utils/LocalDatabase';

const PASSWORD_DURATION_IN_MS = 7 * 24 * 3600 * 1000; // 7 days
const SUPPORT_EXPORT_SECURE_STORAGE_KEY = 'SUPPORT_EXPORT_SECURE_STORAGE_KEY';

export function clearPassword() {
  storage.removeItem(CONSTANT_KEYS.PASSPHRASE_KEY);
}

export const getAesKeyFromSalt = ({ salt, password }) => {
  try {
    new Validator('getAesKeyFromSalt-salt', salt).string();
    new Validator('getAesKeyFromSalt-password', password).required().string();
    let aesKey = misc.pbkdf2(password, salt, null, 128);
    aesKey = codec.hex.fromBits(aesKey);
    return aesKey;
  } catch (error) {
    console.log('getAesKeyFromSalt error', error);
    throw error;
  }
};

export const checkSupportExpoSecureStore = async ({ accessKey, password }) => {
  let isSupportSecure = false;
  try {
    isSupportSecure = await storage.getItem(SUPPORT_EXPORT_SECURE_STORAGE_KEY);
    new Validator('checkSupportExpoSecureStore-accessKey', accessKey)
      .required()
      .string();
    new Validator('checkSupportExpoSecureStore-password', password)
      .required()
      .string();
    if (typeof isSupportSecure === 'undefined' || isSupportSecure === null) {
      let salt = await getItemAsync(accessKey);
      if (!salt) {
        // generate a new wallet encryption key
        const raw = randomBytes(16);
        salt = byteToHexString(raw);
        await setItemAsync(accessKey, salt);
      }
      let aesKey = getAesKeyFromSalt({ salt, password });
      let reCheckSalt = await getItemAsync(accessKey);
      let reCheckAesKey = getAesKeyFromSalt({ salt: reCheckSalt, password });
      isSupportSecure = isEqual(aesKey, reCheckAesKey);
      await storage.setItem(
        SUPPORT_EXPORT_SECURE_STORAGE_KEY,
        JSON.stringify(isSupportSecure),
      );
      return isSupportSecure;
    }
  } catch (error) {
    console.log('error accessing SecureStorage', error);
  }
  return isSupportSecure;
};

export const getPassphraseNoCache = async () => {
  // TODO : password expiry
  let password = CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT;
  let passcode = await LocalDatabase.getPIN();
  const accessKey = CONSTANT_KEYS.SALT_KEY || 'default-wallet-salt';
  try {
    const checkSupport = await checkSupportExpoSecureStore({
      accessKey,
      password: passcode || password,
    });
    if (checkSupport) {
      const salt = await getItemAsync(accessKey);
      const aesKeyDefault = getAesKeyFromSalt({ salt, password });
      let aesKeyPassCode;
      if (passcode) {
        aesKeyPassCode = getAesKeyFromSalt({ salt, password: passcode });
      }
      const aesKey = aesKeyPassCode || aesKeyDefault;
      return {
        aesKeyDefault,
        password,
        aesKeyPassCode,
        passcode,
        aesKey,
      };
    } else {
      let salt = await storage.getItem(accessKey);
      if (!salt) {
        // generate a new wallet encryption key
        const raw = randomBytes(16);
        salt = byteToHexString(raw);
        await storage.setItem(accessKey, salt);
      }
      const aesKeyDefault = getAesKeyFromSalt({ salt, password });
      let aesKeyPassCode;
      if (passcode) {
        aesKeyPassCode = getAesKeyFromSalt({ salt, password: passcode });
      }
      const aesKey = aesKeyPassCode || aesKeyDefault;
      return {
        aesKeyDefault,
        password,
        passcode,
        aesKeyPassCode,
        aesKey,
      };
    }
  } catch (e) {
    console.log('error getPassphrase ', e);
    throw e;
  }
};

export const getPassphrase = () =>
  cachePromise('PASSPHRASE_WALLET_DEFAULT', () => getPassphraseNoCache(), 1e9);

/* eslint-disable import/no-cycle */
import { setTokenHeader } from '@src/services/http';
import { refreshAccessTokenVer2 } from '@src/services/api/user';
import LocalDatabase from '@utils/LocalDatabase';
import { v4 } from 'uuid';
import RNRestart from 'react-native-restart';

export const getTokenNoCache = async () => {
  let _accessToken = '';
  try {
    const [deviceID, accessToken] = await Promise.all([
      LocalDatabase.getDeviceIDVer2(),
      LocalDatabase.getAccessTokenVer2()
    ]);
    setTokenHeader(accessToken);
    const { token: newAccessToken } = await refreshAccessTokenVer2({ deviceID });
    if (accessToken !== newAccessToken) {
      setTokenHeader(newAccessToken);
    }
    _accessToken = newAccessToken;
    await LocalDatabase.saveAccessTokenVer2(_accessToken);

    // keep old logic, new logic don't use
    const uniqueId = (await LocalDatabase.getDeviceId());
    if (!uniqueId) {
      await LocalDatabase.saveDeviceId(v4());
    }
  } catch (error) {
    // REFRESH TOKEN WITH ERROR, RESTART APP
    await LocalDatabase.saveAccessTokenVer2('');
    setTimeout(() => {
      RNRestart.Restart();
    }, 1000);
  }
  return _accessToken;
};

export const getToken = async () => {
  const token = await getTokenNoCache();
  return token;
};

export const login = async () => {
  const token = await getToken();
  setTokenHeader(token);
  return token;
};

global.login = login;

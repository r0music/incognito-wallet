import http from '@services/http';
import { formatBodyGetNodesInfo } from '@screens/Node/Node.builder';
import httpNodeMonitor from '@services/httpNodeMonitor';

export const apiGetNodeReward = async (device) => {
  return new Promise(async (resolve, reject) => {
    try {
      const body = await formatBodyGetNodesInfo(device);
      http
        .post('pnode/get-node-info', body)
        .then((res) => {
          resolve(res || []);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const apiGetNodeInfo = async ({ blsKey }) => {
  let isOnline = false;
  try {
    const res = await httpNodeMonitor
      .post('pubkeystat/stat', { mpk: blsKey });
    if (res && res.length > 0) {
      const result = res[0];
      isOnline = result.Status === 'ONLINE';
    }
  } catch (error) {
    console.log('ERROR: ', error);
  }
  return {
    isOnline
  };
};
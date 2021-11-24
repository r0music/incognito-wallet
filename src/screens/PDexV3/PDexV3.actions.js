import { defaultAccountWalletSelector } from '@src/redux/selectors/account';
import Server from '@src/services/wallet/Server';
import storage from '@src/services/storage';
import { PDexV3, Validator } from 'incognito-chain-web-js/build/wallet';
import http from '@src/services/http';
import { CONSTANT_CONFIGS } from '@src/constants';

export const getPDexV3Instance = async ({ account = {} } = {}) => {
  try {
    const server = await Server.getDefault();
    // new Validator('getPDexV3Instance-account', account).required().object();
    let pDexV3Inst = new PDexV3();
    pDexV3Inst.setRPCTradeService(server.tradeServices);
    pDexV3Inst.setStorageServices(storage);
    if (account) {
      pDexV3Inst.setAccount(account);
    }
    pDexV3Inst.setRPCTxServices(server.pubsubServices);
    return pDexV3Inst;
  } catch (error) {
    console.log('getPDexV3Instance-error', error);
  }
};

export const actionGetPDexV3Inst = () => async (dispatch, getState) => {
  const state = getState();
  const account = defaultAccountWalletSelector(state);
  const pDexV3 = await getPDexV3Instance({ account });
  return pDexV3;
};

export const getPancakeHistory = async ({ account = {} } = {}) => {
  try {
    const url = `/trade/history?filter[wallet_address]=${account?.PaymentAddress}`;
    const histories = await http.get(url);
    return histories?.history;
  } catch (error) {
    console.log('getPancakeHistory-error', error);
  }
};
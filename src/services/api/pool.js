import http, { CANCEL_KEY } from '@src/services/http';
import { PoolConfigModel, PoolHistory, UserCoinPoolModel } from '@models/pool';
import { cachePromise, KEYS } from '@services/cache';

export async function getPoolConfigNoCache() {
  return http.get(`pool/staker/configs?${CANCEL_KEY}`)
    .then(data => new PoolConfigModel(data));
}

export async function getPoolConfig() {
  return cachePromise(KEYS.PoolConfig, getPoolConfigNoCache, 60000);
}

export const getUserPoolDataNoCache = (paymentAddress, coins) => () => {
  const url = `/pool/staker/balance-info?p_stake_address=${paymentAddress}&${CANCEL_KEY}`;
  return http.get(url)
    .then(data => data.map(item => new UserCoinPoolModel(item, coins)));
};

export async function getUserPoolData(paymentAddress, coins) {
  return cachePromise(KEYS.PoolUserData(paymentAddress), getUserPoolDataNoCache(paymentAddress, coins), 5000);
}

export async function provide(paymentAddress, tx, signPublicKeyEncode, amount, verifyCode) {
  const url = '/pool/staker/create-stake';
  return http.post(url, {
    'IncognitoTx': tx,
    'PStakeAddress': paymentAddress,
    'SignPublicKeyEncode': signPublicKeyEncode,
    'Amount': amount,
    'g-recaptcha-response': verifyCode,
    'CaptchaVersion': 'v3',
  });
}

export async function submitProvideRawTx({
  paymentAddress,
  signPublicKeyEncode,
  tx,
  rawData,
  amount,
  captchaCode,
  tokenId,
  locked,
  termID
}) {
  const url = '/pool/staker/submit-rawdata';
  return http.post(url, {
    'PStakeAddress': paymentAddress,
    'SignPublicKeyEncode': signPublicKeyEncode,
    'IncognitoTx': tx,
    'RawData': rawData,
    'Amount': amount,
    'TermID': termID,
    'g-recaptcha-response': captchaCode,
    'CaptchaVersion': 'v3',
    'TokenID': tokenId,
    'Locked': locked,
  });
}

export async function migratePRVProvide({paymentAddress, signEncode, verifyCode, amount, termID}) {
  const url = '/pool/staker/migrate-to-prv-lock';
  return http.post(url, {
    'PStakeAddress': paymentAddress,
    'SignEncode': signEncode,
    'PaymentAddress': paymentAddress,
    'Amount': amount,
    'TermID': termID,
    'g-recaptcha-response': verifyCode,
    'CaptchaVersion': 'v3',
  });
}


export async function checkPreviousProvision({
  tokenId,
  paymentAddress,
}) {
  const url = '/pool/staker/check-provision-pending';
  return http.post(url, {
    'PStakeAddress': paymentAddress,
    'TokenID': tokenId,
  });
}


export async function withdrawReward(paymentAddress, signEncode, verifyCode) {
  const url = '/pool/staker/withdraw-reward';
  return http.post(url, {
    'PStakeAddress': paymentAddress,
    'SignEncode': signEncode,
    'PaymentAddress': paymentAddress,
    'Amount': 0,
    'g-recaptcha-response': verifyCode,
    'CaptchaVersion': 'v3',
  });
}

export async function withdrawProvision(paymentAddress, signEncode, amount, tokenId, verifyCode) {
  const url = '/pool/staker/create-unstake';
  return http.post(url, {
    'PStakeAddress': paymentAddress,
    'SignEncode': signEncode,
    'Amount': amount,
    'TokenID': tokenId,
    'g-recaptcha-response': verifyCode,
    'CaptchaVersion': 'v3',
  });
}

export async function getHistories(account, page, limit, coins) {
  const url = `/pool/staker/history?p_stake_address=${account.PaymentAddress}&page=${page}&limit=${limit}&type=1,2,6,8,10&${CANCEL_KEY}`;
  return http.get(url)
    .then(data => ({
      items: data.Items.map(item => new PoolHistory(item, account, coins)),
      total: data.Total,
    }));
}

export async function checkPNodeReward(Txs) {
  return http.post('/pnode/check-tx', {
    'Txs': Txs,
  }, { timeout: 100000 }).then(data => data);
}

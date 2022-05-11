import http from '@src/services/http';
import orderBy from 'lodash/orderBy';

export const getWalletAccounts = async (masterAccountPublicKey) => {
  let result = [];
  try {
    const url = `hd-wallet/recovery?Key=${masterAccountPublicKey}`;
    const res = await http.get(url);
    result =
      res?.Accounts?.map((account) => ({
        name: account?.Name,
        id: account?.AccountID,
      })) || [];
  } catch {
    //
  }
  result = orderBy(result || [], 'id', 'asc');
  return result;
};

export const updateWalletAccounts = (masterAccountPublicKey, accounts) => {
  const accountInfos = accounts.map((item) => ({
    Name: item.name,
    AccountID: item.id,
  }));
  return http
    .put('hd-wallet/recovery', {
      Key: masterAccountPublicKey,
      Accounts: accountInfos,
    })
    .catch((e) => e);
};

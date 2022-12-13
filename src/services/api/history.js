import http from '@src/services/http';
import historyModel from '@src/models/history';
import http4 from '@src/services/http4';

export const getpTokenHistory = ({
  paymentAddress,
  tokenId,
  signPublicKeyEncode,
}) => {
  return http
    .post('eta/history', {
      WalletAddress: paymentAddress,
      PrivacyTokenAddress: tokenId,
      SignPublicKeyEncode: signPublicKeyEncode,
    })
    .then((res) => {
      return (
        res &&
        res.map((history) => {
          return historyModel.parsePrivateTokenFromApi(history);
        })
      );
    });
};

export const removeHistory = ({
  historyId,
  currencyType,
  decentralized,
  signPublicKeyEncode,
}) => {
  if (typeof historyId !== 'number' && !Number.isFinite(historyId))
    throw new Error('Invalid historyId');
  if (typeof currencyType !== 'number' && !Number.isFinite(currencyType))
    throw new Error('Invalid currencyType');

  let body = {
    CurrencyType: currencyType,
    ID: historyId,
    Decentralized: decentralized,
  };

  if (signPublicKeyEncode) {
    body.SignPublicKeyEncode = signPublicKeyEncode;
  }

  return http.post('eta/remove', body);
};

export const retryExpiredDeposit = ({
  id,
  decentralized,
  walletAddress,
  currencyType,
  userPaymentAddress,
  privacyTokenAddress,
  erc20TokenAddress,
  type,
  TxOutchain,
  signPublicKeyEncode,
}) => {
  if (typeof id !== 'number' && !Number.isFinite(id)) {
    throw new Error('Invalid history Id');
  }
  if (typeof decentralized !== 'number') {
    throw new Error('Invalid decentralized');
  }
  if (typeof walletAddress !== 'string') {
    throw new Error('Invalid walletAddress');
  }
  if (typeof currencyType !== 'number') {
    throw new Error('Invalid currencyType');
  }
  if (typeof userPaymentAddress !== 'string') {
    throw new Error('Invalid userPaymentAddress');
  }
  if (typeof privacyTokenAddress !== 'string') {
    throw new Error('Invalid privacyTokenAddress');
  }
  if (typeof erc20TokenAddress !== 'string') {
    throw new Error('Invalid erc20TokenAddress');
  }
  if (typeof type !== 'number') {
    throw new Error('Invalid type');
  }
  if (TxOutchain && typeof TxOutchain !== 'string') {
    throw new Error('Invalid TxOutChain');
  }
  let body = {
    ID: id,
    Decentralized: decentralized,
    WalletAddress: walletAddress,
    AddressType: type,
    CurrencyType: currencyType,
    PaymentAddress: userPaymentAddress,
    PrivacyTokenAddress: privacyTokenAddress,
    Erc20TokenAddress: erc20TokenAddress,
  };

  if (signPublicKeyEncode) {
    body.SignPublicKeyEncode = signPublicKeyEncode;
  }

  if (TxOutchain) {
    body.TxOutchain = TxOutchain;
  }
  return http.post('eta/retry', body);
};

export const getHistoryUnShieldEVM = ({ txIdList }) => {
  if (!txIdList) throw new Error('Missing txIdList');
  if (!Array.isArray(txIdList)) throw new Error('txIdList is not Array!');
  return http4
    .post('unshield/status', {
      TxList: txIdList,
    })
    .then((res) => {
      const mockupData = {
        Result: {
          '5fcecef9cb51e1a463c95d2f54f58b2ca9d7fba8e7c62783063ba7a4b44bce59': {
            inc_request_tx_status: 'accepted',
            network: 'bsc',
            outchain_tx: 'abc',
            outchain_status: 'success',
          },
          c95d38dab14f32b9f4f0a3e09f22ea703dfbedc9d4d68819983e8b2dbcf5c969: {
            inc_request_tx_status: 'accepted',
            network: 'bsc',
            outchain_tx: 'failed',
          },
        },
      };
      return res || mockupData;
    });
};

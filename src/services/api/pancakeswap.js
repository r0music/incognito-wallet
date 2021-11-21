import http from '@src/services/http';
import { PanCakeTokenModel } from '@models/pancakeswap';
import { cachePromise, KEYS } from '@services/cache';

export async function getPancakeTokensNoCache() {
  return http.get('trade/tokens')
    .then(tokens => tokens.map(item => new PanCakeTokenModel(item)));
}

export async function getPancakeTokens() {
  return cachePromise(KEYS.PancakeTokens, getPancakeTokensNoCache, 10);
}

export async function getPancakeTradingFee({paymentAddress, srcTokenID, destTokenID, srcAmt}) {
  let body = {
    WalletAddress: paymentAddress,
    SrcTokens: srcTokenID,
    DestTokens: destTokenID,
    SrcQties: srcAmt.toString(),
  };
  return http.post('/trade/estimate-fees', body)
    .then(res => {
      const { FeeAddress, PrivacyFees, ID, SignAddress } = res;
      return {
        tradeID: ID, 
        feeAddress: FeeAddress,
        signAddress: SignAddress,
        originalTradeFee: PrivacyFees.Level1,
      };
    });
}

export async function submitPancakeTradingTx(
  {tradeID, burnTxID, paymentAddress, srcTokenID, destTokenID, paths, srcAmt, isNative, expectedDestAmt}
) {
  let body = {
    'ID': tradeID,
    'BurnTx': burnTxID,
    'WalletAddress': paymentAddress,
    'SrcTokens': srcTokenID,
    'DestTokens': destTokenID,
    'IsNative': isNative,
    'Path': paths,
    'UserFeeSelection': 2, 
    'UserFeeLevel': 1,
    'SrcQties': srcAmt?.toString(),
    'ExpectedOutputAmount': expectedDestAmt?.toString(),
  };
  return http.post('/trade/submit-trading-tx', body)
    .then(res => {
      console.log('res submitPancakeTradingTx: ', submitPancakeTradingTx);
      return res;
    });
}


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

export async function getPancakeTradingFee({paymentAddress, srcTokenID, destTokenID, srcAmt, destAmt}) {
  let body = {
    WalletAddress: paymentAddress,
    SrcTokens: srcTokenID,
    DestTokens: destTokenID,
    SrcQties: srcAmt,
    MaxAmountOut: destAmt,
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


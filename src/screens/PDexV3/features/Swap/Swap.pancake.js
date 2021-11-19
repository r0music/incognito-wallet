import { useSelector } from 'react-redux';
import { defaultAccountSelector } from '@src/redux/selectors/account';
import { walletSelector } from '@src/redux/selectors/wallet';
import accountService from '@services/wallet/accountService';

import {
  BurningPBSCForDepositToSCRequestMeta,
  PrivacyVersion,
} from 'incognito-chain-web-js/build/wallet';

export const handleBurningTokenToSwapOtherPlatforms = async (payload = {}, txHashHandler) => {
  try {
    const { originalBurnAmount, tokenId, networkFee, signKey, feeAddress, tradeFee, tradeID } = payload;
    const account = useSelector(defaultAccountSelector);
    const wallet = useSelector(walletSelector);
    const info = toString(tradeID) || '';

    const res = await accountService.createBurningRequest({
      wallet,
      account,
      fee: networkFee,
      tokenId,
      burnAmount: originalBurnAmount,
      prvPayments: [
        {
          paymentAddress: feeAddress,
          amount: tradeFee,
        },
      ],
      info,
      remoteAddress: signKey,
      txHashHandler,
      burningType: BurningPBSCForDepositToSCRequestMeta,
      version: PrivacyVersion.ver2,
    });
    if (res.txId) {
      return { ...res, burningTxId: res?.txId };
    } else {
      throw new Error('Burned token, but doesnt have txID, please check it');
    }
  } catch (e) {
    throw e;
  }
};

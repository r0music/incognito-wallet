import {createSelector} from 'reselect';
import {liquiditySelector} from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import {getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector} from '@src/redux/selectors/selectedPrivacy';
import {
  getDataByShareIdSelector,
} from '@screens/PDexV3/features/Portfolio/Portfolio.selector';
import {sharedSelector} from '@src/redux/selectors';
import {getInputShareAmount} from '@screens/PDexV3/features/Liquidity/Liquidity.utils';
import BigNumber from 'bignumber.js';
import format from '@utils/format';
import convert from '@utils/convert';
import {formConfigsRemovePool} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import {getValidRealAmountNFTSelector} from '@src/redux/selectors/account';
import {
  ACCOUNT_CONSTANT,
} from 'incognito-chain-web-js/build/wallet';

const removePoolSelector = createSelector(
  liquiditySelector,
  ({ removePool }) => removePool
);

const isFetchingSelector = createSelector(
  removePoolSelector,
  ({ isFetching }) => isFetching,
);

export const feeAmountSelector = createSelector(
  removePoolSelector,
  getPrivacyDataByTokenIDSelector,
  ({ feeAmount, feeToken }, getPrivacyDataByTokenID) => {
    const token = getPrivacyDataByTokenID(feeToken);
    const tokenAmount = token.amount;
    const showFaucet = tokenAmount < feeAmount;
    return { feeAmount, feeToken, token, feeAmountStr: format.amountFull(feeAmount, token.pDecimals, showFaucet) };
  },
);

export const tokenSelector = createSelector(
  removePoolSelector,
  getPrivacyDataByTokenIDSelector,
  ({ inputToken, outputToken }, getPrivacyDataByTokenID) => {
    if (!inputToken || !outputToken) return {};
    const _inputToken = getPrivacyDataByTokenID(inputToken);
    const _outputToken = getPrivacyDataByTokenID(outputToken);
    return {
      inputToken: _inputToken,
      outputToken: _outputToken,
    };
  },
);

export const shareDataSelector = createSelector(
  removePoolSelector,
  getDataByShareIdSelector,
  ({ shareId }, getDataByShareId) => {
    const dataShare = getDataByShareId(shareId);
    return dataShare || {};
  }
);

export const poolIDSelector = createSelector(
  shareDataSelector,
  ({ poolId }) => poolId,
);

export const maxShareAmountSelector = createSelector(
  poolIDSelector,
  shareDataSelector,
  tokenSelector,
  (poolId, shareData, { inputToken, outputToken }) => {
    if (!shareData) return {
      share: 0,
      totalShare: 0,
      sharePercent: 0,
      maxInputShare: 0,
      maxInputShareStr: '',
      maxOutputShare: 0,
      maxOutputShareStr: '',
    };
    const { share, totalShare, token1PoolValue, token2PoolValue } = shareData;
    const sharePercent = new BigNumber(share).dividedBy(totalShare).toNumber();
    const maxInputShare = new BigNumber(sharePercent).multipliedBy(token1PoolValue).toNumber() || 0;
    const maxOutputShare = new BigNumber(sharePercent).multipliedBy(token2PoolValue).toNumber() || 0;
    const maxInputHuman = convert.toHumanAmount(maxInputShare, inputToken.pDecimals);
    const maxInputShareStr = format.toFixed(maxInputHuman, inputToken.pDecimals);
    const maxOutputHuman = convert.toHumanAmount(maxOutputShare, outputToken.pDecimals);
    const maxOutputShareStr = format.toFixed(maxOutputHuman, outputToken.pDecimals);
    return {
      maxInputShare,
      maxOutputShare,
      share,
      totalShare,
      sharePercent,
      maxInputShareStr,
      maxOutputShareStr,
      maxInputHuman,
      maxOutputHuman,
    };
  }
);

export const inputAmountSelector = createSelector(
  (state) => state,
  sharedSelector.isGettingBalance,
  tokenSelector,
  feeAmountSelector,
  maxShareAmountSelector,
  getInputShareAmount,
);

export const nftTokenSelector = createSelector(
  shareDataSelector,
  getValidRealAmountNFTSelector,
  ({ nftId: _nftId, versionTx }, getValidRealAmountNFT) => {
    /** Case AccessOTA **/
    if (versionTx === ACCOUNT_CONSTANT.PDEX_TRANSACTION_TYPE.ACCESS_ID) {
      return _nftId;
    }

    /** Case NFT ID **/
    let _nftToken;
    const nftToken = getValidRealAmountNFT(_nftId);
    if (nftToken) {
      _nftToken = nftToken;
    }
    return _nftToken;
  }
);

export const disableRemovePool = createSelector(
  isFetchingSelector,
  inputAmountSelector,
  nftTokenSelector,
  ( isFetching, inputAmount, nftToken ) => {
    const { error: inputError, originalInputAmount: amount1 } = inputAmount(formConfigsRemovePool.formName, formConfigsRemovePool.inputToken);
    const { error: outputError, originalInputAmount: amount2 } = inputAmount(formConfigsRemovePool.formName, formConfigsRemovePool.outputToken);
    const disabled = !!inputError || !!outputError || !amount1 || !amount2 || !nftToken || isFetching;
    return { disabled };
  }
);

const compressRemovePoolParams = createSelector(
  inputAmountSelector,
  poolIDSelector,
  feeAmountSelector,
  shareDataSelector,
  (inputAmount, poolId, fee, shareData) => {
    const {
      tokenId: tokenId1,
      originalInputAmount: amount1,
      withdraw: shareAmount
    } = inputAmount(formConfigsRemovePool.formName, formConfigsRemovePool.inputToken);
    const {
      tokenId: tokenId2,
      originalInputAmount: amount2
    } = inputAmount(formConfigsRemovePool.formName, formConfigsRemovePool.outputToken);

    let params = {
      fee: fee.feeAmount,
      poolTokenIDs: [tokenId1, tokenId2],
      poolPairID: poolId,
      shareAmount,
      // nftID: nftId,
      amount1: String(amount1),
      amount2: String(amount2),
    };
    if (shareData.versionTx === ACCOUNT_CONSTANT.PDEX_TRANSACTION_TYPE.ACCESS_ID) {
      params = {
        ...params,
        burnOTA: shareData?.currentAccessOta,
        accessID: shareData.nftId,
      };
    } else {
      params = {
        ...params,
        nftID: shareData.nftId,
      };
    }
    return {
      params,
      versionTx: shareData.versionTx
    };
  }
);
export default ({
  isFetchingSelector,
  feeAmountSelector,
  poolIDSelector,
  tokenSelector,
  shareDataSelector,
  inputAmountSelector,
  maxShareAmountSelector,
  disableRemovePool,
  nftTokenSelector,
  compressRemovePoolParams,
});

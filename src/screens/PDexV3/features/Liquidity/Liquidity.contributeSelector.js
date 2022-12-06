import {createSelector} from 'reselect';
import {liquiditySelector} from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import {getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector} from '@src/redux/selectors/selectedPrivacy';
import {listShareSelector} from '@screens/PDexV3/features/Portfolio/Portfolio.selector';
import {sharedSelector} from '@src/redux/selectors';
import {getPoolSize} from '@screens/PDexV3';
import {getInputAmount} from '@screens/PDexV3/features/Liquidity/Liquidity.utils';
import format from '@utils/format';
import {formConfigsContribute} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import {nftTokenDataSelector} from '@src/redux/selectors/account';
import BigNumber from 'bignumber.js';

const contributeSelector = createSelector(
  liquiditySelector,
  (liquidity) => liquidity?.contribute,
);

const poolIDSelector = createSelector(
  contributeSelector,
  ({ poolId }) => poolId,
);

const statusSelector = createSelector(
  contributeSelector,
  ({ isFetching }) => isFetching,
);

const poolDataSelector = createSelector(
  contributeSelector,
  ({ data }) => data,
);

const tokenSelector = createSelector(
  contributeSelector,
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

export const feeAmountSelector = createSelector(
  contributeSelector,
  getPrivacyDataByTokenIDSelector,
  ({ feeAmount, feeToken }, getPrivacyDataByTokenID) => {
    const token = getPrivacyDataByTokenID(feeToken);
    const tokenAmount = token.amount;
    const showFaucet = tokenAmount < feeAmount;
    return { feeAmount, feeToken, token, feeAmountStr: format.amountFull(feeAmount, token.pDecimals), showFaucet };
  },
);

export const inputAmountSelector = createSelector(
  (state) => state,
  sharedSelector.isGettingBalance,
  tokenSelector,
  feeAmountSelector,
  getInputAmount
);

export const mappingDataSelector = createSelector(
  contributeSelector,
  getPrivacyDataByTokenIDSelector,
  tokenSelector,
  sharedSelector.isGettingBalance,
  feeAmountSelector,
  inputAmountSelector,
  (
    { data: poolData, nftId },
    getPrivacyDataByTokenID,
    { inputToken, outputToken },
    isGettingBalance,
    { token: feeToken },
    inputAmount,
  ) => {
    if (!poolData || !inputToken || !outputToken) return {};
    const { token1Value: token1PoolValue, token2Value: token2PoolValue, price, virtual1Value, virtual2Value } = poolData;
    const poolSize = getPoolSize(inputToken, outputToken, token1PoolValue, token2PoolValue);
    const input = inputAmount(formConfigsContribute.formName, formConfigsContribute.inputToken);
    const output = inputAmount(formConfigsContribute.formName, formConfigsContribute.outputToken);
    const isLoadingBalance =
      isGettingBalance.includes(inputToken?.tokenId)
      || isGettingBalance.includes(outputToken?.tokenId)
      || isGettingBalance.includes(feeToken?.tokenId);

    // Calculator current price
    let currentPrice = format.amountVer2(price, 0);
    let currentPriceStr = `1 ${input.symbol} = ${currentPrice} ${output.symbol}`;

    const percent = 100;
    // Ratio
    let token1Ratio = new BigNumber(token1PoolValue)
      .div(new BigNumber(token1PoolValue)
        .plus(new BigNumber(token2PoolValue)
          .div(new BigNumber(virtual2Value)
            .div(virtual1Value))))
      .multipliedBy(percent).toFixed(2);
    let token2Ratio = new BigNumber(percent).minus(token1Ratio);
    token1Ratio = format.amountVer2(token1Ratio, 0);
    token2Ratio = format.amountVer2(token2Ratio.toString(), 0);
    const poolRatioStr = `${token1Ratio}% ${input.symbol} - ${token2Ratio}% ${output.symbol}`;

    const hookFactories = [
      {
        label: 'Pool size',
        value: poolSize,
      },
      {
        label: 'Current price',
        value: currentPriceStr,
      },
      {
        label: 'Pool ratio',
        value: poolRatioStr
      },
      {
        label: `${input.symbol} Balance`,
        value: input.maxAmountDisplay,
      },
      {
        label: `${output.symbol} Balance`,
        value: output.maxAmountDisplay,
      },
    ];
    return {
      ...poolData,
      hookFactories,
      inputToken,
      outputToken,
      token1PoolValue,
      token2PoolValue,
      isLoadingBalance,
      nftId,
    };
  }
);

export const nftTokenSelector = createSelector(
  poolIDSelector,
  nftTokenDataSelector,
  contributeSelector,
  listShareSelector,
  (
    poolId,
    nftData,
    { nftId },
    listShare,
  ) => {
    const { nftToken } = nftData;
    let res = {
      nftToken,
    };
    if (nftId) {
      res.nftToken = nftId;
      return res;
    }
    if (listShare && listShare.length > 0) {
      const pool = listShare.find(share => share.poolId === poolId);
      if (pool && pool.nftId) {
        res.nftToken = pool.nftId;
      }
    }
    return res;
  }
);

export const disableContribute = createSelector(
  statusSelector,
  inputAmountSelector,
  nftTokenSelector,
  ( isFetching, inputAmount, nftData ) => {
    const { nftToken } = nftData;
    const { error: inputError } = inputAmount(formConfigsContribute.formName, formConfigsContribute.inputToken);
    const { error: outputError } = inputAmount(formConfigsContribute.formName, formConfigsContribute.outputToken);
    const isDisabled = isFetching || !!inputError || !!outputError || !nftToken;
    return { isDisabled, nftTokenAvailable: !!nftToken };
  }
);

export default ({
  contributeSelector,
  poolIDSelector,
  statusSelector,
  poolDataSelector,
  tokenSelector,
  feeAmountSelector,
  mappingDataSelector,
  inputAmountSelector,
  nftTokenSelector,
  disableContribute,
});

import { liquiditySelector } from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import { sharedSelector } from '@src/redux/selectors';
import { getPoolSize } from '@screens/PDexV3';
import { getInputAmount } from '@screens/PDexV3/features/Liquidity/Liquidity.utils';
import format from '@utils/format';
import { formConfigsContribute } from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import { createSelector } from 'reselect';
import { accessOTAShareFormatedSelector } from '@screens/PDexV3/features/Portfolio';

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

const accessKeySelector = createSelector(
  contributeSelector,
  accessOTAShareFormatedSelector,
  ({ accessID, poolId }, listOTAShare) => {
    let _accessID = '';
    if (accessID) {
      _accessID = accessID;
    } else {
      const foundShare = listOTAShare.find((share) => share.poolId === poolId);
      if (foundShare) {
        _accessID = foundShare.nftId;
      }
    }
    return _accessID;
  },
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
    { data: poolData, accessID },
    getPrivacyDataByTokenID,
    { inputToken, outputToken },
    isGettingBalance,
    { token: feeToken },
    inputAmount,
  ) => {
    if (!poolData || !inputToken || !outputToken) return {};
    const { token1Value: token1PoolValue, token2Value: token2PoolValue } = poolData;
    const poolSize = getPoolSize(inputToken, outputToken, token1PoolValue, token2PoolValue);
    const input = inputAmount(formConfigsContribute.formName, formConfigsContribute.inputToken);
    const output = inputAmount(formConfigsContribute.formName, formConfigsContribute.outputToken);
    const isLoadingBalance =
      isGettingBalance.includes(inputToken?.tokenId)
      || isGettingBalance.includes(outputToken?.tokenId)
      || isGettingBalance.includes(feeToken?.tokenId);

    const hookFactories = [
      {
        label: 'Pool size',
        value: poolSize,
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
      accessID,
    };
  }
);

export const disableContribute = createSelector(
  statusSelector,
  inputAmountSelector,
  ( isFetching, inputAmount ) => {
    const { error: inputError } = inputAmount(formConfigsContribute.formName, formConfigsContribute.inputToken);
    const { error: outputError } = inputAmount(formConfigsContribute.formName, formConfigsContribute.outputToken);
    const isDisabled = isFetching || !!inputError || !!outputError;
    return { isDisabled };
  }
);

const compressParamsContribute = createSelector(
  inputAmountSelector,
  feeAmountSelector,
  poolIDSelector,
  mappingDataSelector,
  accessKeySelector,
  (inputAmount, feeSelector, poolId, { amp }, accessID) => {
    const {
      tokenId: tokenId1,
      originalInputAmount: originalInputAmount1
    } = inputAmount(formConfigsContribute.formName, formConfigsContribute.inputToken);
    const {
      tokenId: tokenId2,
      originalInputAmount: originalInputAmount2
    } = inputAmount(formConfigsContribute.formName, formConfigsContribute.outputToken);
    return {
      fee: feeSelector.feeAmount / 2,
      tokenId1,
      tokenId2,
      amount1: String(originalInputAmount1),
      amount2: String(originalInputAmount2),
      poolPairID: poolId,
      amp,
      accessID: accessID,
    };
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
  disableContribute,
  compressParamsContribute,
});

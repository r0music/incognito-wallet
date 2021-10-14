import { PRV } from '@src/constants/common';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import isNaN from 'lodash/isNaN';
import convert from '@src/utils/convert';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import { formValueSelector } from 'redux-form';
import floor from 'lodash/floor';
import { formConfigs } from './Swap.constant';

export const minFeeValidator = (feetokenData) => {
  if (!feetokenData) {
    return undefined;
  }
  try {
    const {
      origininalFeeAmount,
      minFeeOriginal,
      symbol,
      minFeeAmountText,
    } = feetokenData;
    if (
      new BigNumber(origininalFeeAmount).isLessThan(
        new BigNumber(minFeeOriginal),
      )
    ) {
      return `Amount must be larger than ${minFeeAmountText} ${symbol}`;
    }
  } catch (error) {
    console.log('minFeeValidator-error', error);
  }
  return undefined;
};

export const availablePayFeeByPRVValidator = ({
  origininalFeeAmount,
  prvBalance = 0,
  usingFeeBySellToken,
  networkfee,
} = {}) => {
  if (usingFeeBySellToken) {
    return undefined;
  }
  try {
    let availablePRVBalance = new BigNumber(prvBalance)
      .minus(origininalFeeAmount)
      .minus(networkfee);
    if (availablePRVBalance.isLessThan(0)) {
      return `Your ${PRV.symbol} balance is insufficient.`;
    }
  } catch (error) {
    console.log('availablePayFeeByPRVValidator-error', error);
  }
  return undefined;
};

export const maxAmountValidatorForSellInput = (sellInputAmount) => {
  try {
    if (!sellInputAmount) {
      return undefined;
    }
    const {
      originalAmount,
      availableOriginalAmount,
      symbol,
      availableAmountText,
    } = sellInputAmount || {};
    if (
      new BigNumber(originalAmount).gt(new BigNumber(availableOriginalAmount))
    ) {
      return new BigNumber(availableOriginalAmount).gt(0)
        ? `Max amount you can swap is ${availableAmountText} ${symbol}`
        : `Your ${symbol} balance is insufficient.`;
    }
  } catch (error) {
    console.log('maxAmountValidatorForSellInput-error', error);
  }

  return undefined;
};

export const maxAmountValidatorForSlippageTolerance = (slippagetolerance) => {
  try {
    if (!slippagetolerance) {
      return undefined;
    }
    let slippagetoleranceAmount = convert.toNumber(slippagetolerance, true);
    if (isNaN(slippagetoleranceAmount) || !slippagetoleranceAmount) {
      return 'Must be a number';
    }
    if (slippagetoleranceAmount >= 100) {
      return `Enter a number from 0 to ${format.number(99.99)} `;
    }
  } catch (error) {
    console.log('maxAmountValidatorForSlippageTolerance-error', error);
  }

  return undefined;
};

export const getInputAmount = (
  state,
  getInputToken,
  focustoken,
  feeData,
  { networkfee },
  isGettingBalance,
) => (field) => {
  try {
    const token: SelectedPrivacy = getInputToken(field);
    if (!token.tokenId) {
      return {
        amount: '',
        originalAmount: 0,
        isFocus: false,
      };
    }
    const selector = formValueSelector(formConfigs.formName);
    const amountText = selector(state, field);
    let amount = convert.toNumber(amountText, true) || 0;
    const originalAmount = convert.toOriginalAmount(amount, token.pDecimals);
    let availableOriginalAmount = token.amount || 0;
    let availableAmountNumber = 0;
    let availableAmountText = '';
    const usingFee =
      token.tokenId === feeData.feetoken && field === formConfigs.selltoken;
    if (usingFee) {
      availableOriginalAmount = new BigNumber(availableOriginalAmount)
        .minus(new BigNumber(feeData.origininalFeeAmount))
        .toNumber();
    }
    if (usingFee && token.isMainCrypto) {
      availableOriginalAmount = new BigNumber(availableOriginalAmount)
        .minus(networkfee)
        .toNumber();
    }
    if (new BigNumber(availableOriginalAmount).isGreaterThan(0)) {
      availableAmountNumber = convert.toHumanAmount(
        availableOriginalAmount,
        token.pDecimals,
      );
      availableAmountText = format.toFixed(
        availableAmountNumber,
        token.pDecimals,
      );
    }
    const focus = token.tokenId === focustoken;
    return {
      focus,
      tokenId: token.tokenId,
      symbol: token.symbol,
      pDecimals: token.pDecimals,
      isMainCrypto: token.isMainCrypto,

      amount,
      originalAmount,
      amountText,

      availableOriginalAmount,
      availableAmountText,
      availableAmountNumber,

      usingFee,
      loadingBalance: isGettingBalance.includes(token.tokenId),

      balance: token.amount,
      balanceStr: format.amountFull(token.amount, token.pDecimals, false),

      tokenData: token,
    };
  } catch (error) {
    console.log('inputAmountSelector error', error);
  }
};

export const calMintAmountExpected = ({ maxGet, slippagetolerance } = {}) => {
  try {
    let maxGetBn = new BigNumber(maxGet);
    const amount = floor(
      maxGetBn.minus(maxGetBn.multipliedBy(slippagetolerance / 100)).toNumber(),
    );
    return amount;
  } catch (error) {
    console.log('error', error);
  }
  return maxGet;
};

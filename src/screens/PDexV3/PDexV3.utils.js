/* eslint-disable import/no-cycle */
import BigNumber from 'bignumber.js';
import format from '@src/utils/format';
import convertUtil from '@utils/convert';
import isNumber from 'lodash/isNumber';
import isNaN from 'lodash/isNaN';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { getShareDataValue } from '@screens/PDexV3/features/Liquidity/Liquidity.utils';

export const convertToUSD = ({ amount, priceUsd, pDecimals }) => {
  const _amount = convertUtil.toNumber(amount, true);
  return Math.ceil(new BigNumber(_amount).multipliedBy(priceUsd).multipliedBy(Math.pow(10, pDecimals)).toNumber());
};

export const getPairRate = ({ token1, token2, token1Value, token2Value }) => {
  try {
    const humanAmountToken1Value = convertUtil.toHumanAmount(
      token1Value,
      token1?.pDecimals,
    );
    const humanAmountToken2Value = convertUtil.toHumanAmount(
      token2Value,
      token2?.pDecimals,
    );
    let rate = new BigNumber(humanAmountToken2Value).dividedBy(
      new BigNumber(humanAmountToken1Value),
    );
    const rawRate = rate.isNaN() ? 0 : rate.toNumber();
    const rateFixed = format.toFixed(rawRate, token2?.pDecimals || 0);
    if (!rateFixed) {
      return '';
    }
    return rateFixed;
  } catch (error) {
    console.log('getPairRate-error', error);
  }
};

export const getOriginalPairRate = ({
  token1,
  token2,
  token1Value,
  token2Value,
}) => {
  let originalRate = 0;
  try {
    const rate = getPairRate({ token1, token2, token1Value, token2Value });
    originalRate = convertUtil.toOriginalAmount(rate, token2?.pDecimals, true);
  } catch (error) {
    originalRate = 0;
    console.log('getOriginalPairRate-error', error);
  }
  return originalRate;
};

export const getExchangeRate = (token1, token2, token1Value, token2Value) => {
  try {
    if (!token1 || !token2 || !token1Value || !token2Value) {
      return '';
    }
    const originalRate = getOriginalPairRate({
      token1,
      token2,
      token1Value,
      token2Value,
    });
    return `1 ${token1?.symbol} ~ ${format.amountVer2(
      originalRate,
      token2?.pDecimals,
    )} ${token2?.symbol}`;
  } catch (error) {
    console.log('getExchangeRate-error', error);
  }
};

export const getPrincipal = ({ token1, token2, shareData }) => {
  const {
    maxInputShareDisplayStr,
    maxOutputShareDisplayStr,
  } = getShareDataValue({
    inputToken: token1,
    outputToken: token2,
    shareData,
  });
  const token1USD = convertToUSD({ amount: maxInputShareDisplayStr, priceUsd: token1.priceUsd, pDecimals: token1.pDecimals });
  const token2USD = convertToUSD({ amount: maxOutputShareDisplayStr, priceUsd: token2.priceUsd, pDecimals: token2.pDecimals });
  const token1USDHuman = convertUtil.toHumanAmount(token1USD, token1.pDecimals);
  const token2USDHuman = convertUtil.toHumanAmount(token2USD, token2.pDecimals);
  return {
    token1: `${maxInputShareDisplayStr} ${token1.symbol}`,
    token2: `${maxOutputShareDisplayStr} ${token2.symbol}`,
    str: `${maxInputShareDisplayStr} ${token1.symbol} + ${maxOutputShareDisplayStr} ${token2.symbol}`,
    token1USD,
    token2USD,
    token1USDHuman,
    token2USDHuman,
  };
};

export const getShareStr = (share, totalShare) => {
  const percent = format.toFixed(
    new BigNumber(share)
      .dividedBy(totalShare || 1)
      .multipliedBy(100)
      .toNumber(),
    3,
  );
  return `${percent}%`;
};

export const getReward = (token1, token2, token1Value, token2Value) => {
  const token1Str = `${format.amountVer2(token1Value, token1.pDecimals)} ${
    token1.symbol
  }`;
  const token2Str = `${format.amountVer2(token2Value, token2.pDecimals)} ${
    token2.symbol
  }`;
  return `${token1Str} + ${token2Str}`;
};

export const getPoolSize = (
  token1: SelectedPrivacy,
  token2: SelectedPrivacy,
  token1PoolValue = 0,
  token2PoolValue = 0,
) => {
  const formattedToken1Pool = format.amountVer2(
    token1PoolValue,
    token1?.pDecimals,
  );
  const formattedToken2Pool = format.amountVer2(
    token2PoolValue,
    token2?.pDecimals,
  );
  return `${formattedToken1Pool} ${token1?.symbol} + ${formattedToken2Pool} ${token2?.symbol}`;
};

export const parseInputWithText = ({ text, token }) => {
  let number = convertUtil.toNumber(text, true);
  number = convertUtil.toOriginalAmount(
    number,
    token.pDecimals,
    token.pDecimals !== 0,
  );
  return number;
};

export const calculateContributeValue = ({
  inputValue,
  outputToken,
  inputPool,
  outputPool,
}) => {
  if (!inputPool || !outputPool) return;
  if (
    !outputToken ||
    !isNumber(inputValue) ||
    isNaN(inputValue) ||
    !inputValue
  ) {
    return '';
  }
  const number = new BigNumber(inputValue)
    .multipliedBy(outputPool)
    .dividedBy(inputPool)
    .toNumber();
  const amount = convertUtil.toHumanAmount(number, outputToken.pDecimals);
  return format.toFixed(amount, outputToken.pDecimals);
};

export const formatBalance = (token1, token2, token1Value, token2Value) => {
  if (
    !token1 ||
    !token2 ||
    token1Value === undefined ||
    token2Value === undefined
  )
    return '';
  const token1Str = `${format.amountVer2(token1Value, token1.pDecimals)} ${
    token1.symbol
  }`;
  const token2Str = `${format.amountVer2(token2Value, token2.pDecimals)} ${
    token2.symbol
  }`;
  return `${token1Str} + ${token2Str}`;
};

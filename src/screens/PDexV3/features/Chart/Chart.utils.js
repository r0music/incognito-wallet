import BigNumber from 'bignumber.js';
import convert from '@src/utils/convert';
import format from '@src/utils/format';
import { getPairRate } from '@screens/PDexV3';

export const mappingOrderBook = (params) => {
  let result = [];
  try {
    const { data = [], token1, token2, isBuy = false, isSell = false } = params;
    result = data.map(
      ({
        token1Amount: token1Value,
        token2Amount: token2Value,
        token1Balance,
        token2Balance,
      }) => {
        const rate = getPairRate({
          token1,
          token2,
          token1Value,
          token2Value,
        });
        const price = convert.toNumber(rate, true);
        let volumeOriginalAmount = 0,
          priceOriginalAmount = 0,
          volume,
          volumeStr;
        priceOriginalAmount = convert.toOriginalAmount(
          price,
          token2?.pDecimals,
          true,
        );
        const priceStr = format.amountVer2(
          priceOriginalAmount,
          token2?.pDecimals,
        );
        if (isBuy) {
          volumeOriginalAmount = token2Balance;
          volume = convert.toHumanAmount(
            volumeOriginalAmount,
            token2?.pDecimals,
          );
          volume = new BigNumber(volume)
            .dividedBy(new BigNumber(price))
            .toNumber();
          volumeOriginalAmount = convert.toOriginalAmount(
            volume,
            token2.pDecimals,
          );
          volumeStr = format.amountVer2(
            volumeOriginalAmount,
            token2?.pDecimals,
          );
        } else if (isSell) {
          volumeOriginalAmount = token1Balance;
          volume = convert.toHumanAmount(
            volumeOriginalAmount,
            token1?.pDecimals,
          );
          volumeStr = format.amountVer2(
            volumeOriginalAmount,
            token1?.pDecimals,
          );
        }
        const res = {
          price,
          priceStr,
          volume,
          volumeStr,
        };
        return res;
      },
    );
  } catch (error) {
    console.log('mappingOrderBook-error', error);
  }
  return result;
};

import convert from '@src/utils/convert';
import format from '@src/utils/format';
import { getPairRate } from '@screens/PDexV3';

export const mappingOrderBook = (params) => {
  let result = [];
  try {
    const { data = [], token1, token2 } = params;
    result = data.map(
      ({ token1Amount: token1Value, token2Amount: token2Value }) => {
        const priceStr = getPairRate({
          token1,
          token2,
          token1Value,
          token2Value,
        });
        const price = convert.toNumber(priceStr, true);
        const volume = convert.toHumanAmount(token1Value, token1?.pDecimals);
        const res = {
          price,
          priceStr,
          volume,
          volumeStr: format.amountFull(token1Value, token1?.pDecimals, true),
        };
        return res;
      },
    );
  } catch (error) {
    console.log('mappingOrderBook-error', error);
  }
  return result;
};

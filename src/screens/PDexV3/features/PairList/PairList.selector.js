import {createSelector} from 'reselect';
import {selectedPrivacySelector} from '@src/redux/selectors';
import formatUtil from '@utils/format';

const pairsSelector = createSelector(
  (state) => state.pDexV3,
  ({ pairs }) => pairs,
);

const pairsDataSelector = createSelector(
  pairsSelector,
  ({ pairs }) => pairs,
);

const isFetchingSelector = createSelector(
  pairsSelector,
  ({ isFetching }) => isFetching,
);

const mapPairsDataSelector = createSelector(
  pairsDataSelector,
  selectedPrivacySelector.getPrivacyDataByTokenID,
  (pairs, getPrivacyDataByTokenID) => {
    return pairs.map(pair => {
      const { tokenId1, tokenId2, token1Amount, token2Amount } = pair;
      const token1 = getPrivacyDataByTokenID(tokenId1);
      const token2 = getPrivacyDataByTokenID(tokenId2);
      const poolSizeStr = `${formatUtil.amountFull(token1Amount, token1.pDecimals, true)} ${token1.symbol} + ${formatUtil.amountFull(token2Amount, token2Amount.pDecimals, true)} ${token2.symbol}`;
      const symbolStr = `${token1.symbol} / ${token2.symbol}`;
      return {
        ...pair,
        token1,
        token2,
        poolSizeStr,
        symbolStr,
      };
    });
  },
);

export default ({
  pairsSelector,
  pairsDataSelector,
  mapPairsDataSelector,
  isFetchingSelector,
});

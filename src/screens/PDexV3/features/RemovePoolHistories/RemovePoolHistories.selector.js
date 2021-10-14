import {createSelector} from 'reselect';
import memoize from 'memoize-one';
import {selectedPrivacySelector} from '@src/redux/selectors';
import {getSubRemovePool} from '@screens/PDexV3/features/RemovePoolHistories/RemovePoolHistories.utils';

export const removePoolHistoriesSelector = createSelector(
  (state) => state.pDexV3,
  ({ removePoolHistories }) => removePoolHistories,
);

export const historiesSelector = createSelector(
  removePoolHistoriesSelector,
  ({ histories }) => histories,
);

export const getHistoryByPairID = createSelector(
  historiesSelector,
  selectedPrivacySelector.getPrivacyDataByTokenID,
  (histories, getPrivacyDataByTokenID) => memoize((pairID) => {
    const history = histories.find(item => item.pairID === pairID);
    const subTextStr = getSubRemovePool(history, getPrivacyDataByTokenID);
    const token1 = getPrivacyDataByTokenID(history?.tokenId1);
    const token2 = getPrivacyDataByTokenID(history?.tokenId2);
    return {
      ...history,
      token1,
      token2,
      subTextStr,
    };
  },)
);


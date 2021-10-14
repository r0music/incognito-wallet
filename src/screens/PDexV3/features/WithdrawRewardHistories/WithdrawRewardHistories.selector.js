import {createSelector} from 'reselect';
import {selectedPrivacySelector} from '@src/redux/selectors';
import memoize from 'memoize-one';
import {getSubRemovePool} from '@screens/PDexV3/features/RemovePoolHistories/RemovePoolHistories.utils';

export const withdrawRewardHistoriesSelector = createSelector(
  (state) => state.pDexV3,
  ({ withdrawRewardHistories }) => withdrawRewardHistories,
);

export const historiesSelector = createSelector(
  withdrawRewardHistoriesSelector,
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
      subTextStr,
      token1,
      token2,
    };
  },)
);

import {createSelector} from 'reselect';
import memoize from 'memoize-one';
import {selectedPrivacySelector} from '@src/redux/selectors';
import {
  getSubTextContribute,
  mapperContributes
} from '@screens/PDexV3/features/ContributeHistories/ContributeHistories.utils';

export const contributeHistoriesSelector = createSelector(
  (state) => state.pDexV3,
  ({ contributeHistories }) => contributeHistories,
);

export const historiesSelector = createSelector(
  contributeHistoriesSelector,
  ({ histories }) => histories,
);

export const getHistoryByPairID = createSelector(
  historiesSelector,
  selectedPrivacySelector.getPrivacyDataByTokenID,
  (histories, getPrivacyDataByTokenID) => memoize((pairID) => {
    const history = histories.find(item => item.pairID === pairID);
    const retryToken = histories?.retryTokenID ? getPrivacyDataByTokenID(histories?.retryTokenID) : undefined;
    const refundToken = histories?.refundTokenID ? getPrivacyDataByTokenID(histories?.refundTokenID) : undefined;
    const subTextStr = getSubTextContribute(history?.contributes, getPrivacyDataByTokenID);
    const mapContributes = mapperContributes(history);
    console.log();
    return {
      ...history,
      retryToken,
      refundToken,
      subTextStr,
      mapContributes,
    };
  })
);

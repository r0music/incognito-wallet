import { selectedPrivacySelector } from '@src/redux/selectors';
import { followTokensWalletSelector } from '@src/screens/Wallet/features/FollowList/FollowList.selector';
import { createSelector } from 'reselect';
import { PTokenConvert, TokenConvert } from './models';

const listUnifiedTokenSelector = createSelector(
  (state: any) => state?.convertToUnifiedToken,
  (data) => data?.listUnifiedToken,
);

const loadingGetListUnifiedTokenSelector = createSelector(
  (state: any) => state?.convertToUnifiedToken,
  (data) => data?.isFetchingListUnifiedToken,
);

const listUnifiedTokenSelectedSelector = createSelector(
  listUnifiedTokenSelector,
  (listUnifiedToken) =>
    listUnifiedToken?.filter((token: TokenConvert) => token?.selected),
);

const listTokenConvertSelector = createSelector(
  listUnifiedTokenSelector,
  (listUnifiedToken) => {
    const listTokenConvert: PTokenConvert[] = [];
    for (var i = 0; i < listUnifiedToken.length; i++) {
      if (listUnifiedToken[i]?.selected) {
        for (var j = 0; j < listUnifiedToken[i].listUnifiedToken.length; j++) {
          listTokenConvert.push(listUnifiedToken[i].listUnifiedToken[j]);
        }
      }
    }
    return listTokenConvert;
  },
);

const checkConvertSelector = createSelector(
  followTokensWalletSelector,
  selectedPrivacySelector.getPrivacyDataByTokenID,
  (followList, getPrivacyDataByTokenID) => {
    for (var i = 0; i < followList?.length; i++) {
      let tokenData = getPrivacyDataByTokenID(followList[i]?.id);
      if (
        tokenData?.movedUnifiedToken &&
        parseFloat(followList[i]?.amount) > 0
      ) {
        return true;
      }
    }
    return false;
  },
);

export {
  listUnifiedTokenSelector,
  listTokenConvertSelector,
  listUnifiedTokenSelectedSelector,
  loadingGetListUnifiedTokenSelector,
  checkConvertSelector,
};

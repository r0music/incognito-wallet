import { createSelector } from 'reselect';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import BigNumber from 'bignumber.js';
import format from '@src/utils/format';
import convert from '@utils/convert';
import { getValidRealAmountNFTSelector, isFetchingNFTSelector } from '@src/redux/selectors/account';
import { formatAccessOTAShare, formatNFTShare } from '@screens/PDexV3/features/Portfolio/Portfolio.utils';

export const portfolioSelector = createSelector(
  (state) => state.pDexV3,
  ({ portfolio }) => {
    return portfolio;
  },
);

export const shareDetailsSelector = createSelector(
  portfolioSelector,
  ({ shareDetails }) => shareDetails
);

export const isFetchingSelector = createSelector(
  portfolioSelector,
  ({ isFetching }) => isFetching
);

const nftShareSelector = createSelector(
  portfolioSelector,
  ({ dataShare }) => dataShare.nftShare
);

const accessOTAShareSelector = createSelector(
  portfolioSelector,
  ({ dataShare }) => dataShare.accessOTAShare
);

export const nftShareFormatedSelector = createSelector(
  nftShareSelector,
  shareDetailsSelector,
  getPrivacyDataByTokenIDSelector,
  getValidRealAmountNFTSelector,
  isFetchingNFTSelector,
  formatNFTShare,
);

export const accessOTAShareFormatedSelector = createSelector(
  accessOTAShareSelector,
  shareDetailsSelector,
  getPrivacyDataByTokenIDSelector,
  formatAccessOTAShare
);

export const listShareSelector = createSelector(
  nftShareFormatedSelector,
  accessOTAShareFormatedSelector,
  (nftShare, accessOTAShare) => [...nftShare, ...accessOTAShare],
);

export const listShareIDsSelector = createSelector(
  listShareSelector,
  (listShare) => listShare.reduce((prev, cur) => {
    if (cur.share) prev.push(cur?.shareId);
    return prev;
  }, []),
);

export const getDataByShareIdSelector = createSelector(
  listShareSelector,
  (listShare) => (shareId) =>
    listShare.find((item) => item?.shareId === shareId),
);

export const getDataShareByPoolIdSelector = createSelector(
  listShareSelector,
  (listShare) => (poolId) =>
    listShare.find((item) => item?.poolId === poolId),
);

export const totalRewardCollectedSelector = createSelector(
  listShareSelector,
  (listShare) => {
    const rewardUSD = listShare.reduce((prev, cur) => {
      return prev.plus(cur.totalRewardUSD);
    }, new BigNumber('0')).toNumber();
    const originalAmount = convert.toOriginalAmount(rewardUSD, 9, true);
    return format.amountVer2(originalAmount, 9);
  }
);

export const totalContributedUSDSelector = createSelector(
  listShareSelector,
  (listShare) => {
    const principalUSD = listShare.reduce((prev, cur) => {
      return prev.plus(cur.token1USDHuman || 0).plus(cur.token2USDHuman || 0);
    }, new BigNumber('0')).toNumber();
    return format.amountVer2(Math.ceil(new BigNumber(principalUSD).multipliedBy(Math.pow(10, 9)).toNumber()), 9);
  }
);

export const modalDataSelector = createSelector(
  portfolioSelector,
  ({ modal }) => modal
);

import { createSelector } from 'reselect';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import BigNumber from 'bignumber.js';
import {
  getExchangeRate,
  getPrincipal,
  getShareStr,
} from '@screens/PDexV3';
import format from '@src/utils/format';
import convert from '@utils/convert';
import {getValidRealAmountNFTSelector, isFetchingNFTSelector} from '@src/redux/selectors/account';

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

export const listShareSelector = createSelector(
  portfolioSelector,
  shareDetailsSelector,
  getPrivacyDataByTokenIDSelector,
  getValidRealAmountNFTSelector,
  isFetchingNFTSelector,
  (portfolio, shareDetails, getPrivacyDataByTokenID, getValidRealAmountNFT, isFetchingNFT) => {
    const { data } = portfolio;
    return data.map((item) => {
      const {
        share,
        totalShare,
        poolId,
        withdrawing,
        withdrawable,
        tokenId1,
        tokenId2,
        rewards,
        nftId
      } = item;
      const poolDetail = shareDetails.find((share) => poolId === share.poolId);
      let { amp, apy, token1Value: token1PoolValue, token2Value: token2PoolValue } = poolDetail || {};
      apy = apy || 0;
      const token1 = getPrivacyDataByTokenID(tokenId1);
      const token2 = getPrivacyDataByTokenID(tokenId2);
      const shareId = `${nftId}-${poolId}`;
      const exchangeRateStr = getExchangeRate(
        token1,
        token2,
        token1PoolValue,
        token2PoolValue,
      );
      const principalStr = getPrincipal({
        token1,
        token2,
        shareData: {
          ...item,
          token1PoolValue,
          token2PoolValue,
        }
      });
      const shareStr = getShareStr(share, totalShare);
      const validNFT = !!getValidRealAmountNFT(nftId);
      const disableBtn = isFetchingNFT || !validNFT;
      let mapRewards = Object.keys(rewards).map(tokenId => ({
        tokenId,
        reward: rewards[tokenId]
      }));
      mapRewards = mapRewards.map(item => {
        const token = getPrivacyDataByTokenID(item.tokenId);
        const rewardUSD = convert.toHumanAmount(new BigNumber(item.reward).multipliedBy(token.priceUsd).toNumber(), token.pDecimals);
        const rewardUSDStr = format.toFixed(rewardUSD, token.pDecimals);
        const rewardUSDSymbolStr = `${rewardUSDStr} ${token.symbol}`;
        const rewardStr = `${format.amountFull(item.reward, token.pDecimals)} ${token.symbol}`;
        return {
          ...item,
          token,
          rewardUSD,
          rewardUSDStr,
          rewardUSDSymbolStr,
          rewardStr
        };
      });
      const totalRewardUSD = mapRewards.reduce((prev, curr) => new BigNumber(prev).plus(curr.rewardUSD).toNumber(), 0);
      const totalRewardAmount = Math.ceil(new BigNumber(totalRewardUSD).multipliedBy(Math.pow(10, 9)).toNumber());
      const totalRewardUSDStr = format.amountVer2(totalRewardAmount, 9);
      const rewardUSDSymbolStr = `${totalRewardUSDStr} $`;
      const hookRewards = mapRewards.map((item, index) => ({
        label: `Reward${index + 1}`,
        valueText: item.rewardStr,
      }));
      const hookFactories = [
        {
          label: 'Principal',
          value: principalStr,
        },
        {
          label: 'Reward',
          value: rewardUSDSymbolStr,
        },
      ];
      const hookFactoriesDetail = [
        {
          label: 'PoolId',
          valueText: poolId,
          copyable: true,
        },
        {
          label: 'APY',
          valueText: `${apy}%`,
        },
        {
          label: 'Principal',
          valueText: principalStr,
          moreLines: true
        },
        {
          label: 'Share',
          valueText: shareStr,
        },
        ...hookRewards,
      ];

      return {
        ...item,
        shareId,
        token1,
        token2,
        exchangeRateStr,
        principalStr,
        shareStr,
        hookFactories,
        amp,
        apy,
        token1PoolValue,
        token2PoolValue,
        hookFactoriesDetail,
        withdrawing,
        withdrawable,
        nftId,
        poolId,
        validNFT,
        disableBtn,
        mapRewards,
        totalRewardUSD,
        totalRewardUSDStr,
        rewardUSDSymbolStr,
      };
    });
  },
);

export const listShareIDsSelector = createSelector(
  listShareSelector,
  (listShare) => listShare.map((item) => item?.shareId),
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

export const totalShareSelector = createSelector(
  listShareSelector,
  (listShare) => {
    const rewardUSD = listShare.reduce((prev, cur) => {
      return prev.plus(cur.totalRewardUSD);
    }, new BigNumber('0')).toNumber();
    const originalAmount = convert.toOriginalAmount(rewardUSD, 9, true);
    return format.amountSuffix(originalAmount, 9);
  }
);

export const modalDataSelector = createSelector(
  portfolioSelector,
  ({ modal }) => modal
);

import { createSelector } from 'reselect';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import BigNumber from 'bignumber.js';
import {
  getExchangeRate,
  getPrincipal,
  getReward,
  getShareStr,
} from '@screens/PDexV3';
import format from '@src/utils/format';
import convert from '@utils/convert';
import {getValidRealAmountNFTSelector, isFetchingNFTSelector} from '@src/redux/selectors/account';
import {PRVIDSTR} from 'incognito-chain-web-js/build/wallet';

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
        token1Reward,
        token2Reward,
        prvReward,
        dexReward,
        nftId
      } = item;
      const poolDetail = shareDetails.find((share) => poolId === share.poolId);
      const { amp, apy, token1Value: token1PoolValue, token2Value: token2PoolValue } = poolDetail || {};
      const dexTokenId = '00000003';
      const token1 = getPrivacyDataByTokenID(tokenId1);
      const token2 = getPrivacyDataByTokenID(tokenId2);
      const shareId = `${amp}-${poolId}`;
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
      const rewardStr = getReward(token1, token2, token1Reward, token2Reward);
      const validNFT = !!getValidRealAmountNFT(nftId);
      const disableBtn = isFetchingNFT || !!validNFT;
      let rewards = [
        { tokenId: tokenId1, reward: token1Reward },
        { tokenId: tokenId2, reward: token2Reward },
        { tokenId: dexTokenId, reward: dexReward },
      ];
      const index = rewards.findIndex(({ tokenId }) => tokenId === PRVIDSTR);
      if(index !== -1) {
        rewards[index].reward = rewards[index].reward + prvReward;
      } else {
        rewards.push({
          tokenId: PRVIDSTR,
          reward: prvReward
        });
      }
      rewards = rewards.map(item => {
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
      const totalRewardUSD = rewards.reduce((prev, curr) => new BigNumber(prev).plus(curr.rewardUSD).toNumber(), 0);
      const totalRewardUSDStr = format.toFixed(totalRewardUSD, 9);
      const rewardUSDSymbolStr = `${totalRewardUSDStr} $`;
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
        },
        {
          label: 'Share',
          valueText: shareStr,
        },
      ].concat(rewards.map((item, index) => ({
        label: `Reward${index + 1}`,
        valueText: item.rewardStr,
      })));

      return {
        ...item,
        shareId,
        token1,
        token2,
        exchangeRateStr,
        principalStr,
        shareStr,
        rewardStr,
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
        rewards,
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
      const { token1, token2, token1Reward, token2Reward } = cur;
      const _reward1USD = convert.toOriginalAmount(new BigNumber(token1Reward).multipliedBy(token1.priceUsd ?? 0).toNumber(), token1.pDecimals);
      const _reward2USD = convert.toOriginalAmount(new BigNumber(token2Reward).multipliedBy(token2.priceUsd ?? 0).toNumber(), token2.pDecimals);
      return prev.plus(_reward1USD).plus(_reward2USD);
    }, new BigNumber('0')).toNumber();
    return format.amountFull(rewardUSD, 9, true);
  }
);

export const modalDataSelector = createSelector(
  portfolioSelector,
  ({ modal }) => modal
);

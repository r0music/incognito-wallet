import { getExchangeRate, getPrincipal, getShareStr } from '@screens/PDexV3';
import BigNumber from 'bignumber.js';
import format from '@utils/format';
import convert from '@utils/convert';

const mapRewardToUSD = ({ rewards, getPrivacyDataByTokenID }) => {
  let mapRewards = Object.keys(rewards).map(tokenId => ({
    tokenId,
    reward: rewards[tokenId]
  }));
  mapRewards = mapRewards.map(item => {
    const token = getPrivacyDataByTokenID(item.tokenId);
    const rewardUSD = convert.toHumanAmount(
      new BigNumber(item.reward)
        .multipliedBy(token.priceUsd)
        .toNumber()
      ,token.pDecimals
    );
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
  return mapRewards;
};

const formatPureData = (poolShare, shareDetails, getPrivacyDataByTokenID) => {
  const {
    share,
    totalShare,
    poolId,
    withdrawing,
    withdrawable,
    tokenId1,
    tokenId2,
    rewards,
    orderRewards,
    nftId,
    versionTx,
  } = poolShare;

  const poolDetail = shareDetails[poolId];
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
  const principal = getPrincipal({
    token1,
    token2,
    shareData: {
      ...poolShare,
      token1PoolValue,
      token2PoolValue,
    }
  });
  const principalUSDHuman = new BigNumber(principal.token1USDHuman).plus(principal.token2USDHuman).toNumber();
  const principalUSD = format.amountVer2(Math.ceil(new BigNumber(principalUSDHuman).multipliedBy(Math.pow(10, 9)).toNumber()), 9);

  const shareStr = getShareStr(share, totalShare);

  const mapLPRewards = mapRewardToUSD({
    rewards: rewards || {},
    getPrivacyDataByTokenID
  }) || [];
  const mapOrderRewards = mapRewardToUSD({
    rewards: orderRewards  || {},
    getPrivacyDataByTokenID
  }) || [];
  const totalRewardUSD = mapLPRewards.concat(mapOrderRewards).reduce((prev, curr) => new BigNumber(prev).plus(curr.rewardUSD).toNumber(), 0);
  const totalRewardAmount = Math.ceil(new BigNumber(totalRewardUSD).multipliedBy(Math.pow(10, 9)).toNumber());
  const totalRewardUSDStr = format.amountVer2(totalRewardAmount, 9);
  const rewardUSDSymbolStr = `$${totalRewardUSDStr}`;

  // Collected contribute pool fee
  const hookLPRewards = mapLPRewards.map((item) => ({
    label: 'Fees collected',
    valueText: item.rewardStr,
  }));

  // Collected order rewards fee
  const hookOrderRewards = mapOrderRewards.map((item) => ({
    label: 'Order reward',
    valueText: item.rewardStr,
  }));

  const hookFactories = [
    {
      label: `${token1.symbol} Balance`,
      value: principal.token1,
    },
    {
      label: `${token2.symbol} Balance`,
      value: principal.token2,
    },
    {
      label: 'Rewards collected',
      value: rewardUSDSymbolStr,
    },
  ];
  const apyStr = format.amount(apy, 0);
  let token1Network = '';
  let token2Network = '';
  if (token1.networkName) {
    token1Network = `(${token1.networkName})`;
  }
  if (token2.networkName) {
    token2Network = `(${token2.networkName})`;
  }
  const hookFactoriesDetail = [
    {
      label: 'APR',
      valueText: `${apyStr}%`,
    },
    {
      label: `${token1.symbol} Balance`,
      valueText: `${principal.token1} ${token1Network}`,
    },
    {
      label: `${token2.symbol} Balance`,
      valueText: `${principal.token2} ${token2Network}`,
    },
    ...hookLPRewards,
    ...hookOrderRewards,
  ];
  return {
    ...poolShare,
    shareId,
    token1,
    token2,
    exchangeRateStr,
    principal,
    shareStr,
    hookFactories,
    amp,
    apy,
    apyStr,
    token1PoolValue,
    token2PoolValue,
    hookFactoriesDetail,
    withdrawing,
    withdrawable,
    nftId,
    poolId,
    mapLPRewards,
    mapOrderRewards,
    totalRewardUSD,
    totalRewardUSDStr,
    rewardUSDSymbolStr,
    totalRewardAmount,
    token1USDHuman: principal.token1USDHuman,
    token2USDHuman: principal.token2USDHuman,
    principalUSD,
  };
};

export const formatNFTShare = (
  nftShare,
  shareDetails,
  getPrivacyDataByTokenID,
  getValidRealAmountNFT,
  isFetchingNFT
) => {
  return nftShare.map((item) => {
    const data = formatPureData(item, shareDetails, getPrivacyDataByTokenID);
    const { nftId } = data;
    const validNFT = !!getValidRealAmountNFT(nftId);
    const disableBtn = isFetchingNFT || !validNFT;
    return {
      ...data,
      validNFT,
      disableBtn,
    };
  });
};


export const formatAccessOTAShare = (
  accessOTAShare,
  shareDetails,
  getPrivacyDataByTokenID,
) => {
  return accessOTAShare.map((item) => {
    const data = formatPureData(item, shareDetails, getPrivacyDataByTokenID);
    const validNFT = true;
    const disableBtn = item.isBurningTx;
    return {
      ...data,
      validNFT,
      disableBtn,
    };
  });
};
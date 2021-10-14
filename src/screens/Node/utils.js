import _ from 'lodash';
// eslint-disable-next-line import/no-cycle
import convert from '@utils/convert';
import { COINS } from '@src/constants';
// eslint-disable-next-line import/no-cycle
import { PRV_ID } from '@screens/Dex/constants';

export const parseNodeRewardsToArray = (rewards, allTokens) => {
  const rewardList = (_(Object.keys(rewards)) || [])
    .map(id => {
      const value = rewards[id];
      const token = allTokens.find(token => token.id === id) || {};
      return token && {...token, balance: value, displayBalance: convert.toHumanAmount(value, token.pDecimals)};
    })
    .filter(coin => coin && coin?.id === PRV_ID)
    .orderBy(item => item.displayBalance, 'desc')
    .value();

  if (rewardList.length === 0) {
    rewardList.push({
      ...COINS.PRV,
      balance: 0,
      displayBalance: 0,
    });
  }

  return rewardList;
};

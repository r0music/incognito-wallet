import React, { useCallback, useState } from 'react';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import { ExHandler } from '@services/exception';
import { MESSAGES } from '@src/constants';
import { getPoolConfig, getUserPoolData } from '@services/api/pool';
import COINS from '@src/constants/coin';
import formatUtils from '@utils/format';
import { useFocusEffect } from 'react-navigation-hooks';
import { useSelector } from 'react-redux';
import { PRV_ID } from '@src/screens/DexV2/constants';
import { selectedPrivacySelector } from '@src/redux/selectors';

const withPoolData = (WrappedComp) => (props) => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [groupedCoins, setGroupedCoins] = useState([]);
  const [userData, setUserData] = useState([]);
  const [groupedUserData, setGroupedUserData] = useState([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [totalRewardsNonLock, setTotalRewardsNonLock] = useState(0);
  const [withdrawable, setWithdrawable] = useState(false);
  const [displayFullTotalRewardsNonLock, setDisplayFullTotalRewardsNonLock] = useState('');
  const [displayClipTotalRewards, setDisplayClipTotalRewards] = useState('');

  const nativeToken = useSelector(
    selectedPrivacySelector.getPrivacyDataByTokenID,
  )(PRV_ID);
  const { account } = props;

  const getConfig = async () => {
    const config = await getPoolConfig();
    setConfig(config);
    const groupedCoins = groupCoins(config.coins);
    setGroupedCoins(groupedCoins);

    return config;
  };

  const groupCoins = (coins) => {
    let groupedCoins = [...coins];
    if (groupedCoins && groupedCoins.length > 1) {
      groupedCoins.map((coin, index) => {
        let newCoin = {...coin};
        let sameCoinIDs = groupedCoins.filter((c) => {
          return groupedCoins.indexOf(c) !== index && c.id === coin.id && c.locked === coin.locked;
        });
        if (sameCoinIDs && sameCoinIDs.length > 0) {
          let maxAPY = newCoin.apy;
          let displayInterest = newCoin.displayInterest;
          let terms = [
            {
              lockTime: coin.lockTime,
              apy: coin.apy,
              termID: coin.termID,
            }
          ];
          sameCoinIDs.forEach(c => {
            if (c.apy > maxAPY) {
              maxAPY = c.apy;
              displayInterest = c.displayInterest;
            }
            terms.push({
              lockTime: c.lockTime,
              apy: c.apy,
              termID: c.termID,
            });
            groupedCoins.splice(groupedCoins.indexOf(c), 1);
          });
          newCoin.terms = terms;
          newCoin.apy = maxAPY;
          newCoin.displayInterest = displayInterest;
        }
        groupedCoins[index] = newCoin;
      });
    } 
    return groupedCoins;
  };

  const getUserData = async (account, coins) => {
    const userData = await getUserPoolData(account.PaymentAddress, coins);
    let groupedUserDataTmp = [...userData];
    let groupedUserData = [];
    if (groupedUserDataTmp && groupedUserDataTmp.length > 0) {
      groupedUserData = groupedUserDataTmp.map((item, index) => {
        let newItem = {...item};
        const sameIDItems = groupedUserDataTmp.filter((i) => {
          return groupedUserDataTmp.indexOf(i) !== index && i.id === item.id && i.locked === item.locked;
        });
        let mapCoin = {...newItem.coin};
        if (sameIDItems && sameIDItems.length > 0) {
          let totalBalance = new BigNumber(item.balance);
          let totalReward = new BigNumber(item.rewardBalance);
          let totalPendingBalance = new BigNumber(item.pendingBalance);
          let totalUnstakePendingBalance = new BigNumber(item.unstakePendingBalance);
          let totalWithdrawPendingBalance = new BigNumber(item.withdrawPendingBalance);
          let terms = [
            {
              lockTime: item.lockTime,
              apy: item.coin.apy,
              termID: item.coin.termID,
            }
          ];
          sameIDItems.map(i => {
            totalBalance = totalBalance.plus(new BigNumber(i.balance));
            totalReward = totalReward.plus(new BigNumber(i.rewardBalance));
            totalPendingBalance = totalPendingBalance.plus(new BigNumber(i.pendingBalance));
            totalUnstakePendingBalance = totalUnstakePendingBalance.plus(new BigNumber(i.unstakePendingBalance));
            totalWithdrawPendingBalance = totalWithdrawPendingBalance.plus(new BigNumber(i.withdrawPendingBalance));
            let foundTerm = terms.find(t => t.lockTime === i.lockTime && t.apy === i.coin.apy && t.termID === i.coin.termID);
            if (!foundTerm) {
              terms.push({
                lockTime: i.lockTime,
                apy: i.coin.apy,
                termID: i.coin.termID,
              });
            }
            if (i.coin.apy > mapCoin.apy) {
              mapCoin = {...i.coin};
            }
          });
          newItem.balance = totalBalance.toNumber();
          newItem.rewardBalance = totalReward.toNumber();
          newItem.pendingBalance = totalPendingBalance.toNumber();
          newItem.unstakePendingBalance = totalUnstakePendingBalance.toNumber();
          newItem.withdrawPendingBalance = totalWithdrawPendingBalance.toNumber();

          newItem.displayReward = formatUtils.amountFull(newItem.rewardBalance, COINS.PRV.pDecimals, true);
          newItem.displayBalance = formatUtils.amountFull(newItem.balance, newItem.pDecimals, true);
          newItem.displayFullBalance = formatUtils.amountFull(newItem.balance, newItem.pDecimals, false);
          newItem.displayPendingBalance = formatUtils.amountFull(newItem.pendingBalance, newItem.pDecimals, true);
          newItem.displayUnstakeBalance = formatUtils.amountFull(newItem.unstakePendingBalance, newItem.pDecimals, true);
          newItem.displayWithdrawReward = formatUtils.amountFull(newItem.withdrawPendingBalance, COINS.PRV.pDecimals, true);
          newItem.terms = terms;
          newItem.coin = mapCoin;
          sameIDItems.map((i) => {
            groupedUserDataTmp.splice(groupedUserDataTmp.indexOf(i), 1);
          });
        }

        return ({
          ...newItem,
        });
      });
    }
    setUserData(userData);
    setGroupedUserData(groupedUserData);

    if (
      userData &&
      userData.some(
        (coin) =>
          coin.balance ||
          coin.rewardBalance ||
          coin.pendingBalance ||
          coin.unstakePendingBalance ||
          coin.WithdrawPendingBalance,
      )
    ) {
      setWithdrawable(true);
    } else {
      setWithdrawable(false);
    }

    const totalReducer = (accumulator, item) =>
      accumulator + item.rewardBalance;
    const totalRewards = userData.reduce(totalReducer, 0);

    const totalReducerNonLock = (accumulator, item) =>
      accumulator + (!item.locked ? item.rewardBalance : 0);
    const totalRewardsNonLock_ = userData.reduce(totalReducerNonLock, 0);

    const displayClipTotalRewards = formatUtils.amountFull(
      totalRewards,
      COINS.PRV.pDecimals,
      true,
    );

    const displayFullTotalRewardsNonLock_ = formatUtils.amountFull(
      totalRewardsNonLock_,
      COINS.PRV.pDecimals,
      false,
    );

    setTotalRewards(totalRewards);
    setTotalRewardsNonLock(totalRewardsNonLock_);
    setDisplayClipTotalRewards(displayClipTotalRewards.toString());
    setDisplayFullTotalRewardsNonLock(displayFullTotalRewardsNonLock_.toString());
  };

  const loadData = async (account) => {
    if (loading || !account) {
      return;
    }

    try {
      setLoading(true);
      const config = await getConfig(account);
      await getUserData(account, config.coins);
    } catch (error) {
      new ExHandler(error, MESSAGES.CAN_NOT_GET_POOL_DATA).showErrorToast();
    } finally {
      setLoading(false);
    }
  };

  const loadDataDebounce = useCallback(_.debounce(loadData, 200), []);

  useFocusEffect(
    useCallback(() => {
      setUserData(null);
      setConfig(null);
      loadDataDebounce.cancel();
      loadDataDebounce(account);
    }, [account.PaymentAddress]),
  );

  return (
    <WrappedComp
      {...{
        ...props,
        loading,
        config,
        groupedCoins,
        userData,
        groupedUserData,
        withdrawable,
        totalRewards,
        displayClipTotalRewards,
        onLoad: loadData,
        nativeToken,
        totalRewardsNonLock,
        displayFullTotalRewardsNonLock,
      }}
    />
  );
};

export default withPoolData;

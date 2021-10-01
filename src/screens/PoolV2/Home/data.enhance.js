import React, { useCallback, useState } from 'react';
import _ from 'lodash';
import { ExHandler } from '@services/exception';
import { MESSAGES } from '@src/constants';
import { getPoolConfig, getUserPoolData } from '@services/api/pool';
import COINS from '@src/constants/coin';
import formatUtils from '@utils/format';
import { useFocusEffect } from 'react-navigation-hooks';
import convert from '@src/utils/convert';
import { useSelector } from 'react-redux';
import { PRV_ID } from '@src/screens/DexV2/constants';
import { selectedPrivacySelector } from '@src/redux/selectors';

const withPoolData = (WrappedComp) => (props) => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [userData, setUserData] = useState([]);
  const [groupedUserData, setGroupedUserData] = useState([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [withdrawable, setWithdrawable] = useState(false);
  const [displayFullTotalRewards, setDisplayFullTotalRewards] = useState('');
  const [displayClipTotalRewards, setDisplayClipTotalRewards] = useState('');

  const nativeToken = useSelector(
    selectedPrivacySelector.getPrivacyDataByTokenID,
  )(PRV_ID);
  const { account } = props;

  const getConfig = async () => {
    const config = await getPoolConfig();
    setConfig(config);

    return config;
  };

  const getUserData = async (account, coins) => {
    const userData = await getUserPoolData(account.PaymentAddress, coins);
    let groupedUserDataTmp = [...userData];
    if (groupedUserDataTmp && groupedUserDataTmp.length > 0) {
      groupedUserDataTmp.map((item, index) => {
        let newItem = {...item};
        const sameIDItems = groupedUserDataTmp.filter((i) => {
          return groupedUserDataTmp.indexOf(i) !== index && i.id === item.id && i.locked === item.locked && i.lockTime === item.lockTime;
        });
        
        if (sameIDItems && sameIDItems.length > 0) {
          let totalBalance = item.balance;
          let totalReward = item.rewardBalance;
          let totalPendingBalance = item.pendingBalance;
          let totalUnstakePendingBalance = item.unstakePendingBalance;
          let totalWithdrawPendingBalance = item.withdrawPendingBalance;
          sameIDItems.map(i => {
            totalBalance += i.balance;
            totalReward += i.rewardBalance;
            totalPendingBalance += i.pendingBalance;
            totalUnstakePendingBalance = i.unstakePendingBalance;
            totalWithdrawPendingBalance = i.withdrawPendingBalance;
          });
          newItem.balance = totalBalance;
          newItem.rewardBalance = totalReward;
          newItem.pendingBalance = totalPendingBalance;
          newItem.unstakePendingBalance = totalUnstakePendingBalance;
          newItem.withdrawPendingBalance = totalWithdrawPendingBalance;

          newItem.displayReward = formatUtils.amountFull(newItem.rewardBalance, COINS.PRV.pDecimals, true);
          newItem.displayBalance = formatUtils.amountFull(newItem.balance, newItem.pDecimals, true);
          newItem.displayFullBalance = formatUtils.amountFull(newItem.balance, newItem.pDecimals, false);
          newItem.displayPendingBalance = formatUtils.amountFull(newItem.pendingBalance, newItem.pDecimals, true);
          newItem.displayUnstakeBalance = formatUtils.amountFull(newItem.unstakePendingBalance, newItem.pDecimals, true);
          newItem.displayWithdrawReward = formatUtils.amountFull(newItem.withdrawPendingBalance, COINS.PRV.pDecimals, true);
          groupedUserDataTmp[index] = newItem;

          sameIDItems.map((i) => {
            groupedUserDataTmp.splice(groupedUserDataTmp.indexOf(i), 1);
          });
        }

        return ({
          ...newItem,
          decimalBalance: convert.toNumber(newItem.displayBalance, true),
        });
      });
      groupedUserDataTmp = _.orderBy(groupedUserDataTmp, ['decimalBalance'], ['desc', 'asc']);
    }
    setUserData(userData);
    setGroupedUserData(groupedUserDataTmp);

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

    const displayClipTotalRewards = formatUtils.amountFull(
      totalRewards,
      COINS.PRV.pDecimals,
      true,
    );
    const displayFullTotalRewards = formatUtils.amountFull(
      totalRewards,
      COINS.PRV.pDecimals,
      false,
    );

    setTotalRewards(totalRewards);
    setDisplayClipTotalRewards(displayClipTotalRewards.toString());
    setDisplayFullTotalRewards(displayFullTotalRewards.toString());
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
        userData,
        groupedUserData,
        withdrawable,
        totalRewards,
        displayFullTotalRewards,
        displayClipTotalRewards,
        onLoad: loadData,
        nativeToken,
      }}
    />
  );
};

export default withPoolData;

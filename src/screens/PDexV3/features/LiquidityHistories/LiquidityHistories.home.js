import React, {memo} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {Header} from '@src/components';
import {Tabs} from '@components/core';
import {TABS} from '@screens/PDexV3/features/LiquidityHistories';
import withHistories from '@screens/PDexV3/features/LiquidityHistories/LiquidityHistories.enhance';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import WithdrawRewardHistories from './LiquidityHistories.withdraw';
import RemovePoolHistories from './LiquidityHistories.removePool';
import ContributeHistories from './LiquidityHistories.contribute';

const Home = ({ onRefresh }) => {
  React.useEffect(() => {
    onRefresh();
  }, []);
  return (
    <View style={mainStyle.container}>
      <Header title="Histories" />
      <Tabs rootTabID={TABS.ROOT_TAB_HOME_LIQUIDITY_HISTORIES} useTab1>
        <View tabID={TABS.TAB_CONTRIBUTE_HISTORIES_ID} label="Add">
          <ContributeHistories />
        </View>
        <View tabID={TABS.TAB_REMOVE_POOL_HISTORIES_ID} label="Remove">
          <RemovePoolHistories />
        </View>
        <View tabID={TABS.TAB_WITHDRAW_REWARD_HISTORIES_ID} label="Withdraw">
          <WithdrawRewardHistories />
        </View>
      </Tabs>
    </View>
  );
};

Home.propTypes = {
  onRefresh: PropTypes.func.isRequired
};

export default withHistories(memo(Home));

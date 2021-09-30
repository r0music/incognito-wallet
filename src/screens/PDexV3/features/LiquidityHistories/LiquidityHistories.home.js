import React, {memo} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import {Tabs} from '@components/core';
import {liquidityHistorySelector, TABS} from '@screens/PDexV3/features/LiquidityHistories';
import withHistories from '@screens/PDexV3/features/LiquidityHistories/LiquidityHistories.enhance';
import {useSelector} from 'react-redux';
import WithdrawRewardHistories from './LiquidityHistories.withdraw';
import RemovePoolHistories from './LiquidityHistories.removePool';
import ContributeHistories from './LiquidityHistories.contribute';

const Home = ({ onRefresh }) => {
  const isFetching = useSelector(liquidityHistorySelector.isFetching);
  return (
    <View style={mainStyle.container}>
      <Header title="Histories" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={(<RefreshControl refreshing={isFetching} onRefresh={onRefresh} />)}
      >
        <Tabs rootTabID={TABS.ROOT_TAB_HOME_LIQUIDITY_HISTORIES}>
          <View
            tabID={TABS.TAB_CONTRIBUTE_HISTORIES_ID}
            label="Add"
            onChangeTab={() => {}}
          >
            <ContributeHistories />
          </View>
          <View
            tabID={TABS.TAB_REMOVE_POOL_HISTORIES_ID}
            label="Remove"
            onChangeTab={() => {}}
          >
            <RemovePoolHistories />
          </View>
          <View
            tabID={TABS.TAB_WITHDRAW_REWARD_HISTORIES_ID}
            label="Withdraw"
            onChangeTab={() => {}}
          >
            <WithdrawRewardHistories />
          </View>
        </Tabs>
      </ScrollView>
    </View>
  );
};

Home.propTypes = {
  onRefresh: PropTypes.func.isRequired
};

export default withHistories(memo(Home));
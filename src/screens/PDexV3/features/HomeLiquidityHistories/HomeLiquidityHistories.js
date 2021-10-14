import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {Header} from '@src/components';
import { styled as mainStyle } from '@screens/PDexV3/PDexV3.styled';
import {Tabs} from '@components/core';
import {
  ROOT_TAB_HOME_LIQUIDITY_HISTORIES,
  TAB_CONTRIBUTE_HISTORIES_ID,
  TAB_REMOVE_POOL_HISTORIES_ID,
  TAB_WITHDRAW_REWARD_HISTORIES_ID
} from '@screens/PDexV3/features/HomeLiquidityHistories';
import ContributeHistories from '@screens/PDexV3/features/ContributeHistories';
import RemovePoolHistories from '@screens/PDexV3/features/RemovePoolHistories';
import WithdrawRewardHistories from '@screens/PDexV3/features/WithdrawRewardHistories';

const HomeLiquidityHistories = () => {
  return (
    <View style={mainStyle.container}>
      <Header title="Histories" />
      <ScrollView style={{ flex: 1 }}>
        <Tabs rootTabID={ROOT_TAB_HOME_LIQUIDITY_HISTORIES}>
          <View
            tabID={TAB_CONTRIBUTE_HISTORIES_ID}
            label="Add"
            onChangeTab={() => {}}
          >
            <ContributeHistories />
          </View>
          <View
            tabID={TAB_REMOVE_POOL_HISTORIES_ID}
            label="Remove"
            onChangeTab={() => {}}
          >
            <RemovePoolHistories />
          </View>
          <View
            tabID={TAB_WITHDRAW_REWARD_HISTORIES_ID}
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

HomeLiquidityHistories.propTypes = {};

export default memo(HomeLiquidityHistories);

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from '@src/components/core';
import History from './Swap.orderHistory';
import {
  ROOT_TAB_SUB_INFO,
  TAB_HISTORY_ID,
  TAB_REWARD_HISTORY_ID,
} from './Swap.constant';
import RewardHistory from './Swap.rewardHistory';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
});

const GroupSubInfo = () => {
  return (
    <View style={styled.container}>
      <Tabs rootTabID={ROOT_TAB_SUB_INFO}>
        <View
          tabID={TAB_HISTORY_ID}
          label="Swap history"
          onChangeTab={() => null}
          upperCase={false}
        >
          <History />
        </View>
        <View tabID={TAB_REWARD_HISTORY_ID} label="Reward history">
          <RewardHistory />
        </View>
      </Tabs>
    </View>
  );
};

GroupSubInfo.propTypes = {};

export default React.memo(GroupSubInfo);

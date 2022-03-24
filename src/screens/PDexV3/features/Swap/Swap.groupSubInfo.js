import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from '@src/components/core';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import History from './Swap.orderHistory';
import {
  TAB_REWARD_HISTORY_ID,
  ROOT_TAB_SWAP_HISTORY,
  TAB_SWAP_HISTORY_ID,
} from './Swap.constant';
import RewardHistory from './Swap.rewardHistory';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
});

const GroupSubInfo = () => {
  const navigation = useNavigation();
  const routeName = navigation?.state?.routeName;
  return (
    <View style={styled.container}>
      <Tabs rootTabID={`${ROOT_TAB_SWAP_HISTORY} ${routeName}`}>
        <View
          tabID={`${TAB_SWAP_HISTORY_ID} ${routeName}`}
          label="Swap history"
          onChangeTab={() => null}
          upperCase={false}
        >
          <History />
        </View>
        {/* Only show Reward history tab when screen is privacy app, not show in Dex
        screen */}
        {routeName !== routeNames.Trade ? (
          <View
            tabID={`${TAB_REWARD_HISTORY_ID} ${routeName}`}
            label="Trading rewards"
            onChangeTab={() => null}
            upperCase={false}
          >
            <RewardHistory />
          </View>
        ) : (
          <View tabID="" label="" onChangeTab={() => null} upperCase={false}>
            <View />
          </View>
        )}
      </Tabs>
    </View>
  );
};

GroupSubInfo.propTypes = {};

export default React.memo(GroupSubInfo);

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs , TouchableOpacity } from '@src/components/core';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import PropTypes from 'prop-types';
import { ChevronIcon } from '@components/Icons';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme';
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
  header: {
    height: 30,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 1,
  }
});

const GroupSubInfo = ({ page, isExpandPage, setShowHistory }) => {
  const navigation = useNavigation();
  const routeName = navigation?.state?.routeName;
  const colors = useSelector(colorsSelector);
  return (
    <View style={styled.container}>
      <Tabs
        rootTabID={`${ROOT_TAB_SWAP_HISTORY} ${routeName}`}
        rightCustom={(
          <TouchableOpacity
            style={[styled.header, { backgroundColor: colors.btnBG3 }]}
            onPress={() => setShowHistory(!isExpandPage)}
          >
            <ChevronIcon toggle={isExpandPage} />
          </TouchableOpacity>
        )}
      >
        <View
          tabID={`${TAB_SWAP_HISTORY_ID} ${routeName}`}
          label="Swap history"
          onChangeTab={() => null}
          upperCase={false}
        >
          <History page={page} />
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
            <RewardHistory page={page} />
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

GroupSubInfo.propTypes = {
  page: PropTypes.number.isRequired,
  isExpandPage: PropTypes.bool.isRequired,
  setShowHistory: PropTypes.func.isRequired
};

export default React.memo(GroupSubInfo);

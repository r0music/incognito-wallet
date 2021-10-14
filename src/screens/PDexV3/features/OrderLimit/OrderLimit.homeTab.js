import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  actionFetchPools,
  FollowingPools,
} from '@screens/PDexV3/features/Pools';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { TradingVol24h } from '@screens/PDexV3/features/Share';
import { useDispatch } from 'react-redux';
import { actionSetPoolSelected } from './OrderLimit.actions';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const TabOrderLimit = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handlePressPool = async (poolId) => {
    await dispatch(actionSetPoolSelected(poolId));
    navigation.navigate(routeNames.OrderLimit);
  };
  React.useEffect(() => {
    dispatch(actionFetchPools());
  }, []);
  return (
    <View style={styled.container}>
      <TradingVol24h />
      <FollowingPools handlePressPool={handlePressPool} />
    </View>
  );
};

TabOrderLimit.propTypes = {};

export default React.memo(TabOrderLimit);

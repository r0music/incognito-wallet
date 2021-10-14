import React, {memo} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import BottomBar from '@components/core/BottomBar';
import ROUTE_NAMES from '@routers/routeNames';
import {useNavigation} from 'react-navigation-hooks';
import withPoolData from '@screens/PoolV2/Home/data.enhance';
import {compose} from 'recompose';
import withDefaultAccount from '@components/Hoc/withDefaultAccount';
import { hasNotch } from 'react-native-device-info';

const styled = StyleSheet.create({
  wrapper: {
    marginBottom: hasNotch() ? 30 : 0,
    paddingVertical: 10,
  }
});

const NodeBottomBar = ({ groupedCoins, loading }) => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate(ROUTE_NAMES.PoolV2ProvideSelectCoin, {
      coins: groupedCoins
    });
  };
  if (loading) return (
    <View style={styled.wrapper}>
      <ActivityIndicator />
    </View>
  );
  return (
    <BottomBar text="Need help running your node? Use a staking service" onPress={onPress} loading={loading} />
  );
};

NodeBottomBar.propTypes = {
  groupedCoins: PropTypes.any.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default compose(
  withDefaultAccount,
  withPoolData,
)(memo(NodeBottomBar));

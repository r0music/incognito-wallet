import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { listPoolsSelector, PoolsList } from '@screens/PDexV3/features/Pools';
import { useSelector } from 'react-redux';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const MarketList = (props) => {
  const { onPressPool } = props;
  const listPools = useSelector(listPoolsSelector);
  return (
    <View style={styled.container}>
      <PoolsList onPressPool={onPressPool} listPools={listPools} />
    </View>
  );
};

MarketList.propTypes = {
  onPressPool: PropTypes.func.isRequired,
};

export default React.memo(MarketList);

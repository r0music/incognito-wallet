import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs } from '@src/components/core';
import PoolsList from './Pools.list';
import {
  listPoolsSelector,
  listPoolsFollowingSelector,
} from './Pools.selector';

const ROOT_TAB_POOLS = 'ROOT_TAB_POOLS';
const TAB_MARKET = `${ROOT_TAB_POOLS}-TAB_MARKET`;
const TAB_FOLLOWING = `${ROOT_TAB_POOLS}-TAB_FOLLOWING`;

const styled = StyleSheet.create({
  container: { flex: 1 },
});

const TabFollowing = React.memo(({ onPressPool }) => {
  const listPools = useSelector(listPoolsFollowingSelector);
  return <PoolsList listPools={listPools} onPressPool={onPressPool} />;
});

const TabMarket = React.memo(({ onPressPool }) => {
  const listPools = useSelector(listPoolsSelector);
  return <PoolsList listPools={listPools} onPressPool={onPressPool} />;
});

const PoolsTab = (props) => {
  const { onPressPool } = props;
  return (
    <View style={styled.container}>
      <Tabs rootTabID={ROOT_TAB_POOLS} styledTabs={styled.styledTabs} useTab1>
        <View tabID={TAB_MARKET} label="Favorites" onChangeTab={() => null}>
          <TabFollowing onPressPool={onPressPool} />
        </View>
        <View tabID={TAB_FOLLOWING} label="All" onChangeTab={() => null}>
          <TabMarket onPressPool={onPressPool} />
        </View>
      </Tabs>
    </View>
  );
};

PoolsTab.propTypes = {
  onPressPool: PropTypes.func.isRequired,
};

export default React.memo(PoolsTab);

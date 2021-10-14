import React, {memo} from 'react';
import {FlatList, View} from 'react-native';
import PropTypes from 'prop-types';
import {batch, useDispatch, useSelector} from 'react-redux';
import withFetch from '@screens/PDexV3/features/Staking/Staking.enhanceFetch';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {stakingActions, stakingSelector} from '@screens/PDexV3/features/Staking';
import {HeaderRow, PoolItem} from '@screens/PDexV3/features/Staking/Staking.item';
import {RefreshControl} from '@components/core';
import routeNames from '@routers/routeNames';
import {useNavigation} from 'react-navigation-hooks';

const StakingPools = ({ handleFetchStakingPools }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const pools = useSelector(stakingSelector.stakingPoolSelector);
  const isFetching = useSelector(stakingSelector.isFetchingPoolSelector);
  const onInvestCoin = (tokenId) => {
    batch(() => {
      dispatch(stakingActions.actionSetInvestCoin({ tokenID: tokenId }));
      navigation.navigate(routeNames.StakingMoreInput);
    });
  };
  const renderItem = (data) => <PoolItem item={data.item} onPress={onInvestCoin} />;
  return (
    <View style={mainStyle.fullFlex}>
      <HeaderRow array={['Name', 'APY']} style={{ marginTop: 10 }} />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={handleFetchStakingPools} />
        }
        data={pools}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

StakingPools.propTypes = {
  handleFetchStakingPools: PropTypes.func.isRequired,
};

export default withFetch(memo(StakingPools));

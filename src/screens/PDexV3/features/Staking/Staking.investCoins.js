import React, {memo} from 'react';
import {RefreshControl, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import {STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import {batch, useDispatch, useSelector} from 'react-redux';
import {
  stakingActions, stakingSelector,
} from '@screens/PDexV3/features/Staking';
import {ScrollView} from '@components/core';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import routeNames from '@routers/routeNames';
import {useNavigation} from 'react-navigation-hooks';
import withFetch from '@screens/PDexV3/features/Staking/Staking.enhanceFetch';
import {HeaderRow, OneRowCoin} from '@screens/PDexV3/features/Staking/Staking.item';
import orderBy from 'lodash/orderBy';
import {PRVIDSTR} from 'incognito-chain-web-js/build/wallet';

const CoinItem = React.memo(({ coin }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { token, userBalanceStr, userBalance, tokenId } = coin;
  const onInvestCoin = () => {
    batch(() => {
      dispatch(stakingActions.actionSetInvestCoin({ tokenID: tokenId }));
      navigation.navigate(routeNames.StakingMoreInput);
    });
  };
  return (
    <OneRowCoin
      valueText={userBalanceStr}
      token={token}
      disabled={!userBalance}
      onPress={onInvestCoin}
    />
  );
});

const StakingMoreCoins = ({ handleFetchStakingPools }) => {
  const coins = orderBy(useSelector(stakingSelector.stakingPoolSelector), [(c) => c.tokenId === PRVIDSTR, 'userBalanceStr'], ['desc', 'asc']);
  const isFetching = useSelector(stakingSelector.isFetchingPoolSelector);
  const renderItem = (coin) => <CoinItem coin={coin} />;
  const onRefresh = () => {
    if (typeof handleFetchStakingPools === 'function') handleFetchStakingPools();
  };
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.selectCoin} />
      <HeaderRow array={['Name', 'Balance']} />
      <ScrollView
        refreshControl={(
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        )}
        style={coinStyled.coinContainer}
      >
        {coins.map(renderItem)}
      </ScrollView>
    </View>
  );
};

CoinItem.propTypes = {
  coin: PropTypes.object.isRequired,
};

StakingMoreCoins.propTypes = {
  handleFetchStakingPools: PropTypes.func.isRequired,
};

export default withFetch(memo(StakingMoreCoins));

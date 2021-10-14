import React from 'react';
import {RefreshControl, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, Row} from '@src/components';
import {STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import {batch, useDispatch, useSelector} from 'react-redux';
import {isFetchingSelector, stakingCoinsSelector} from '@screens/PDexV3/features/Staking/Staking.selector';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {ScrollView, Text} from '@components/core';
import withFetch from '@screens/PDexV3/features/Staking/Staking.enhanceFetch';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import {stakingActions} from '@screens/PDexV3/features/Staking/index';

const CoinItem = React.memo(({ coin }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { token, tokenId, balanceStakingStr, balanceRewardStakingStr } = coin;
  const navigateWithdawInvest = () => {
    batch(() => {
      dispatch(stakingActions.actionSetWithdrawInvestCoin({ tokenID: tokenId }));
      navigation.navigate(routeNames.StakingWithdrawInvest);
    });
  };
  const navigateWithdawReward = () => {
    batch(() => {
      dispatch(stakingActions.actionSetWithdrawRewardCoin({ tokenID: tokenId }));
      navigation.navigate(routeNames.StakingWithdrawReward);
    });
  };
  return (
    <View key={tokenId}>
      {!!balanceStakingStr && (
        <TouchableOpacity style={coinStyled.coin} onPress={navigateWithdawInvest}>
          <Row>
            <Text style={coinStyled.coinName}>{token.symbol}</Text>
            <View style={coinStyled.flex}>
              <Text style={[coinStyled.coinName, coinStyled.textRight]}>{balanceStakingStr}</Text>
            </View>
          </Row>
          <Text style={coinStyled.coinExtra}>{STAKING_MESSAGES.staking}</Text>
        </TouchableOpacity>
      )}
      {!!balanceRewardStakingStr && (
        <TouchableOpacity style={coinStyled.coin} onPress={navigateWithdawReward}>
          <Row>
            <Text style={coinStyled.coinName}>{token.symbol}</Text>
            <View style={coinStyled.flex}>
              <Text style={[coinStyled.coinName, coinStyled.textRight]}>{balanceRewardStakingStr}</Text>
            </View>
          </Row>
          <Text style={coinStyled.coinExtra}>{STAKING_MESSAGES.reward}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const StakingWithdrawCoins = React.memo(({ handleFetchData }) => {
  const coins = useSelector(stakingCoinsSelector);
  const isLoading = useSelector(isFetchingSelector);
  const renderItem = (coin) => <CoinItem coin={coin} />;
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.withdraw} />
      <ScrollView refreshControl={(<RefreshControl refreshing={isLoading} onRefresh={handleFetchData} /> )}>
        <View style={coinStyled.coinContainer}>
          {(coins || []).map(renderItem)}
        </View>
      </ScrollView>
    </View>
  );
});

CoinItem.propTypes = {
  coin: PropTypes.object.isRequired
};

StakingWithdrawCoins.propTypes = {
  handleFetchData: PropTypes.func.isRequired
};

export default withFetch(StakingWithdrawCoins);

import React from 'react';
import {RefreshControl, TouchableOpacity, View} from 'react-native';
import {batch, useDispatch, useSelector} from 'react-redux';
import {isFetchingSelector, stakingActions, stakingCoinsSelector} from '@screens/PDexV3/features/Staking';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {Row} from '@src/components';
import {ScrollView, Text} from '@components/core';
import PropTypes from 'prop-types';
import withFetch from '@screens/PDexV3/features/Staking/Staking.enhanceFetch';
import {defaultAccountSelector} from '@src/redux/selectors/account';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';

const CoinItem = React.memo(({ coin }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { token, tokenId, balanceRewardStakingStr, nftId } = coin;
  const onNavigateHistories = () => {
    batch(() => {
      navigation.navigate(routeNames.StakingHistories);
      dispatch(stakingActions.actionSetHistoriesKey({ tokenID: tokenId, nftID: nftId }));
    });
  };
  return (
    <TouchableOpacity style={coinStyled.coin} key={tokenId} onPress={onNavigateHistories}>
      <Row>
        <View>
          <Text style={coinStyled.coinName}>{token.symbol}</Text>
        </View>
        <View style={coinStyled.flex}>
          <Text style={[coinStyled.coinName, coinStyled.textRight]}>{coin.balanceStakingStr}</Text>
          <Row style={[coinStyled.textRight, coinStyled.justifyRight]} center>
            <Text style={coinStyled.coinInterest}>
              {balanceRewardStakingStr}
            </Text>
          </Row>
        </View>
      </Row>
    </TouchableOpacity>
  );
});

const StakingHome = React.memo(({ handleFetchData, handleChangeAccount }) => {
  const coins = useSelector(stakingCoinsSelector);
  const account = useSelector(defaultAccountSelector);
  const isLoading = useSelector(isFetchingSelector);
  const renderItem = (coin) => <CoinItem coin={coin} />;
  React.useEffect(() => {
    if (typeof handleChangeAccount === 'function') handleChangeAccount();
    if (typeof handleFetchData === 'function') handleFetchData();
  }, [account.paymentAddress]);
  return (
    <View style={coinStyled.coinContainer}>
      <ScrollView refreshControl={(<RefreshControl refreshing={isLoading} onRefresh={handleFetchData} />)}>
        {(coins || []).map(renderItem)}
      </ScrollView>
    </View>
  );
});

CoinItem.propTypes = {
  coin: PropTypes.object.isRequired
};

StakingHome.propTypes = {
  handleFetchData: PropTypes.func.isRequired,
  handleChangeAccount: PropTypes.func.isRequired,
};

export default withFetch(StakingHome);

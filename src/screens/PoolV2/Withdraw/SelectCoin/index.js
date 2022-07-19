import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  ScrollViewBorder,
  TouchableOpacity,
  View,
} from '@components/core';
import mainStyle from '@screens/PoolV2/style';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout/index';
import withCoinsData from '@screens/PoolV2/Withdraw/SelectCoin/coins.enhance';
import withDefaultAccount from '@components/Hoc/withDefaultAccount';
import ROUTE_NAMES from '@routers/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import { Header, Row } from '@src/components/';
import { COINS } from '@src/constants';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';

const SelectCoin = ({
  coins,
  displayFullTotalRewardsNonLock,
  totalRewardsNonLock,
}) => {
  const navigation = useNavigation();

  const getPrivacyDataByTokenID = useSelector(
    selectedPrivacySelector.getPrivacyDataByTokenID,
  );


  const handleWithdrawReward = () =>{
    navigation.navigate(ROUTE_NAMES.PoolV2WithdrawRewards, {
      totalRewardsNonLock,
      displayFullTotalRewardsNonLock,
    });
  };

  const handleSelect = (coin) => {
    navigation.navigate(ROUTE_NAMES.PoolV2WithdrawProvision, {
      coin
    });
  };

  const prv = COINS.PRV;
  const anytime = ' anytime';

  return (
    <>
      <Header title="Withdraw" />
      <ScrollViewBorder style={mainStyle.coinContainerNoMargin}>
        <TouchableOpacity
          style={[mainStyle.coin, !totalRewardsNonLock && mainStyle.disabled]}
          onPress={handleWithdrawReward}
          disabled={!totalRewardsNonLock}
        >
          <Row spaceBetween>
            <Text style={mainStyle.coinName}>{prv.symbol} anytime</Text>
            <Text style={mainStyle.coinName}>
              {displayFullTotalRewardsNonLock}
            </Text>
          </Row>
          <Text style={mainStyle.coinExtra}>Rewards</Text>
        </TouchableOpacity>
        {coins.map((coin) => {
          const {network} = getPrivacyDataByTokenID(coin?.id);
          return (
            <TouchableOpacity
              key={coin.id}
              style={[mainStyle.coin, !coin.balance && mainStyle.disabled]}
              onPress={() => handleSelect(coin)}
              disabled={!coin.balance}
            >
              <Row spaceBetween>
                <Row>
                  <Text style={mainStyle.coinName}>
                    {coin.id === prv.id ? coin.symbol + anytime : coin.symbol}
                  </Text>
                  <View style={mainStyle.networkBox}>
                    <Text style={mainStyle.networkText}>{network}</Text>
                  </View>
                </Row>
                <Text style={mainStyle.coinName}>{coin.displayBalance}</Text>
              </Row>
              <Text style={mainStyle.coinExtra}>Provision</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollViewBorder>
    </>
  );
};

SelectCoin.propTypes = {
  coins: PropTypes.array.isRequired,
  displayFullTotalRewardsNonLock: PropTypes.string.isRequired,
  totalRewardsNonLock: PropTypes.number.isRequired,
};

export default compose(
  withLayout_2,
  withDefaultAccount,
  withCoinsData,
)(SelectCoin);


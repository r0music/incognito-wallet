import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from '@components/core';
import mainStyle from '@screens/PoolV2/style';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout/index';
import withCoinsData from '@screens/PoolV2/Provide/SelectCoin/coins.enhance';
import withDefaultAccount from '@components/Hoc/withDefaultAccount';
import withBalance from '@screens/PoolV2/Provide/SelectCoin/balance.enhance';
import ROUTE_NAMES from '@routers/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import { Header, Row } from '@src/components/';
import { COINS } from '@src/constants';
import {LockTimeComp} from '@screens/PoolV2/Home/CoinList';
import upToIcon from '@src/assets/images/icons/upto_icon.png';

const SelectCoin = ({
  coins
}) => {
  const navigation = useNavigation();

  const handleSelect = (coin) => {
    const prv = coins.find(item => item.id === COINS.PRV_ID);
    navigation.navigate(ROUTE_NAMES.PoolV2ProvideInput, {
      coin,
      isPrv: coin.id && coin.id === COINS.PRV_ID,
      prvBalance: prv.balance,
      coins,
    });
  };

  const renderUpToAPY = (item) => {
    return (
      <Row style={{alignItems: 'center'}}>
        {
          item.locked && 
            (
              <Image
                source={upToIcon}
                style={{
                  width: 14,
                  height: 16,
                  marginBottom: 8,
                }}
              />
            )
        }
        <Text style={mainStyle.coinExtra}> {item.displayInterest}</Text>
      </Row>
    );
  };

  return (
    <View style={mainStyle.flex}>
      <Header title="Select coin" />
      <ScrollView style={mainStyle.coinContainer}>
        {coins.map(coin => (
          <TouchableOpacity
            key={coin.id}
            style={[mainStyle.coin]}
            onPress={() => handleSelect(coin)}
            disabled={!coin.balance}
          >
            <View style={coin.balance === 0 && mainStyle.disabled}>
              <Row spaceBetween>
                <Row>
                  <Text style={mainStyle.coinName}>{coin.symbol}</Text>
                  {!!coin.locked && <LockTimeComp />}
                </Row>
                {coin.displayBalance ?
                  <Text style={mainStyle.coinName}>{coin.displayBalance}</Text> :
                  <ActivityIndicator />
                }
              </Row>
              {renderUpToAPY(coin)}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

SelectCoin.propTypes = {
  coins: PropTypes.array.isRequired,
};

export default compose(
  withLayout_2,
  withDefaultAccount,
  withCoinsData,
  withBalance,
)(SelectCoin);


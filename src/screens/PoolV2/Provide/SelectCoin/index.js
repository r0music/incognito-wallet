import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ScrollViewBorder,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from '@components/core';
import mainStyle from '@screens/PoolV2/style';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout/index';
import withCoinsData from '@screens/PoolV2/Provide/SelectCoin/coins.enhance';
import withDefaultAccount from '@components/Hoc/withDefaultAccount';
import withBalance from '@screens/PoolV2/Provide/SelectCoin/balance.enhance';
import ROUTE_NAMES from '@routers/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import { Header, Row , ImageCached } from '@src/components/';
import { COINS } from '@src/constants';
import { LockTimeComp } from '@screens/PoolV2/Home/CoinList';
import upToIcon from '@src/assets/images/icons/upto_icon.png';
import { colorsSelector } from '@src/theme/theme.selector';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';


const SelectCoin = ({ coins }) => {
  const navigation = useNavigation();
  const getPrivacyDataByTokenID = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID);
  const colors = useSelector(colorsSelector);
  const handleSelect = (coin) => {
    const prv = coins.find((item) => item.id === COINS.PRV_ID);
    navigation.navigate(ROUTE_NAMES.PoolV2ProvideInput, {
      coin,
      isPrv: coin.id && coin.id === COINS.PRV_ID,
      prvBalance: prv.balance,
      coins,
    });
  };

  const renderUpToAPY = (item) => {
    return (
      <Row style={{ alignItems: 'center', marginBottom: 8 }}>
        <Text
          style={[
            mainStyle.coinExtra,
            { marginBottom: 0, marginTop: 2 },
            { color: colors.blue1 },
          ]}
        >
          {item.displayInterest}
        </Text>
        {item.locked && (
          <Image
            source={upToIcon}
            style={{
              width: 14,
              height: 16,
              marginLeft: 4,
              tintColor: colors.blue1
            }}
          />
        )}
      </Row>
    );
  };

  return (
    <>
      <Header title="Select coin" />
      <ScrollViewBorder style={mainStyle.coinContainerNoMargin}>
        {coins.map((coin) => {
          const { iconUrl, network } = getPrivacyDataByTokenID(coin.id);
          return (
            <TouchableOpacity
              key={coin.id}
              style={[mainStyle.coin, { flexDirection: 'row' }]}
              onPress={() => handleSelect(coin)}
              disabled={!coin.balance}
            >
              <ImageCached
                uri={iconUrl}
                style={{
                  width: 32,
                  height: 32,
                  marginTop: 10,
                  marginRight: 14,
                }}
              />
              <View
                style={[coin.balance === 0 && mainStyle.disabled, { flex: 1 }]}
              >
                <Row spaceBetween style={{ marginBottom: 8 }}>
                  <Row style={{ alignItems: 'center' }}>
                    <Text style={[mainStyle.coinName, { marginBottom: 0 }]}>
                      {coin.symbol}
                    </Text>
                    {!!coin.locked && <LockTimeComp />}
                  </Row>
                  {coin.displayBalance ? (
                    <Text style={[mainStyle.coinName, { marginBottom: 0 }]}>
                      {coin.displayBalance}
                    </Text>
                  ) : (
                    <ActivityIndicator />
                  )}
                </Row>
                <Row spaceBetween>
                  <View style={[mainStyle.networkBox, { marginLeft: 0 }]}>
                    <Text style={mainStyle.networkText}>{network}</Text>
                  </View>
                  {renderUpToAPY(coin)}
                </Row>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollViewBorder>
    </>
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

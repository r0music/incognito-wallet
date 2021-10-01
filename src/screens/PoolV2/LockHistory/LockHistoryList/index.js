/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { View, Text, TouchableOpacity, ScrollView } from '@components/core';
import { Row, PRVSymbol } from '@src/components/';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import { useNavigation } from 'react-navigation-hooks';
import ROUTE_NAMES from '@routers/routeNames';
import mainStyles from '@screens/PoolV2/style';
import withData from './data.enhance';
import styles from './style';

const LockHistory = ({
  coin,
  lockHistories,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <Header title="Provide PRV lock detail" onGoBack={() => navigation.navigate(ROUTE_NAMES.PoolV2)} />
      { lockHistories.length > 0 
        ? (
          <ScrollView style={mainStyles.coinContainer}>
            {lockHistories.map((item) => {
              return (
                <TouchableOpacity key={item}>
                  <View style={mainStyles.coin} key={item.symbol}>
                    <Row>
                      <View>
                        <Text style={mainStyles.coinName}>{item.displayBalance} {item.symbol} </Text>
                        <Text style={mainStyles.coinExtra}> Unlock </Text>
                      </View>
                      <View style={[mainStyles.flex]}>
                        <Row
                          style={[mainStyles.textRight, mainStyles.justifyRight]}
                          center
                        >
                          <PRVSymbol style={mainStyles.coinInterest} />
                          <Text style={mainStyles.coinInterest}>
                            &nbsp;{item.displayReward}
                          </Text>
                        </Row>
                        <Text style={[mainStyles.textRight, mainStyles.unlockDate]}>
                          {item.displayUnlockDate}
                        </Text>
                      </View>
                    </Row>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) 
        : (
          <View style={mainStyles.coinContainer}>
            <Text style={[mainStyles.coinExtra, {textAlign: 'center'}]}>There have no providing lock PRV details.</Text>
          </View>
          
        )
      }
    </View>
  );
};

LockHistory.propTypes = {
  coin: PropTypes.object,
  lockHistories: PropTypes.array,
};

LockHistory.defaultProps = {
  coin: null,
  lockHistories: [],
};

export default compose(
  withLayout_2,
  withData,
)(LockHistory);

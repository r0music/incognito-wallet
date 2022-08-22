/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { View, Text, ScrollViewBorder, Divider, Image } from '@components/core';
import emptyListIcon from '@src/assets/images/icons/empty_list.png';
import { SumIconComp } from '@src/screens/PoolV2/Home/CoinList';
import { Row, PRVSymbol } from '@src/components/';
import { COLORS } from '@src/styles';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import { useNavigation } from 'react-navigation-hooks';
import ROUTE_NAMES from '@routers/routeNames';
import mainStyles from '@screens/PoolV2/style';
import { colorsSelector } from '@src/theme';
import { useSelector } from 'react-redux';
import globalStyled from '@src/theme/theme.styled';
import withData, { LockStatus } from './data.enhance';
import styles from './style';

const LockHistory = ({
  coin,
  lockHistories,
}) => {
  const navigation = useNavigation();
  const colors = useSelector(colorsSelector);

  const renderEmptyList = () => {
    return (
      <View style={styles.emptyListContainer} borderTop>
        <Image
          source={emptyListIcon}
          style={{
            width: 60,
            height: 60,
          }}
        />
        <Text style={styles.emptyText}>
          There is no stake.
        </Text>
      </View>
    );
  };

  return (
    <>
      <Header title="Staking service" onGoBack={() => navigation.navigate(ROUTE_NAMES.PoolV2)} />
      { lockHistories.length > 0
        ? (
          <ScrollViewBorder style={[mainStyles.coinContainerNoMargin, { paddingHorizontal: 0, paddingTop: 24 }]}>
            {lockHistories.map((item, index) => {
              const isEndTerm = item.active === LockStatus.Finished;
              return (
                <View key={index}>
                  <View key={item.symbol} style={globalStyled.defaultPaddingHorizontal}>
                    <Row>
                      <View>
                        <Text style={mainStyles.coinName}>{item.displayBalance} {item.symbol} </Text>
                        <Text style={styles.unlockDate}> {item.coin.displayLockTime} </Text>
                        <Text style={styles.unlockDate}> Term ends </Text>
                      </View>
                      <View style={[mainStyles.flex]}>
                        <Row
                          style={[mainStyles.textRight, mainStyles.justifyRight]}
                          centerVertical
                        >
                          {item.locked && <SumIconComp />}
                          <PRVSymbol style={[mainStyles.coinInterest, { color: COLORS.green }]} />
                          <Text style={[mainStyles.coinInterest, { color: COLORS.green }]}>
                            &nbsp;{item.displayReward}
                          </Text>
                        </Row>
                        <Text style={[mainStyles.textRight, styles.unlockDate]}>
                          {item.coin.displayInterest}
                        </Text>
                        <Text style={[mainStyles.textRight, styles.unlockDate]}>
                          {item.displayUnlockDate}
                        </Text>
                        {isEndTerm && (
                          <View style={{
                            backgroundColor: colors.btnBG3, alignSelf: 'flex-end', borderRadius: 12,
                            paddingHorizontal: 8,
                            marginTop: 8
                          }}
                          >
                            <Text style={[
                              mainStyles.textCenter,
                              styles.endTerm,
                              { color: COLORS.green }
                            ]}
                            >
                              Term ended and funds unlocked
                            </Text>
                          </View>
                        )}
                      </View>
                    </Row>
                  </View>
                  {index === lockHistories.length - 1  ? null :  <Divider color={COLORS.lightGrey31} dividerStyled={styles.divider} />}
                </View>
              );
            })}
            <View style={{ height: 30 }} />
          </ScrollViewBorder>
        )
        : renderEmptyList()
      }
    </>
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

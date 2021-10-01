import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RoundCornerButton,
} from '@components/core';
import mainStyles from '@screens/PoolV2/style';
import { Row, PRVSymbol } from '@src/components/';
import { ArrowRightGreyIcon } from '@components/Icons/index';
import { useNavigation } from 'react-navigation-hooks';
import ROUTE_NAMES from '@routers/routeNames';
import { RefreshControl } from 'react-native';
import { PRV_ID } from '@src/screens/DexV2/constants';
import styles from './style';

const CoinList = ({
  coins,
  userData,
  groupedUserData,
  histories,
  withdrawable,
  loading,
  onLoad,
  account,
  isLoadingHistories,
}) => {
  const navigation = useNavigation();

  const handleHistory = () => {
    navigation.navigate(ROUTE_NAMES.PoolV2History, {
      coins,
    });
  };

  const renderEmpty = () => {
    return (
      <>
        <Row style={mainStyles.coin}>
          <Text style={mainStyles.coinName}>Provide liquidity for pDEX</Text>
        </Row>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => onLoad(account)}
            />
          }
          style={styles.scrollView}
        >
          {coins.map((item) => (
            <Row style={mainStyles.coin} key={`${item.id} ${item.locked}`}>
              <Text style={mainStyles.coinName}>{item.name}</Text>
              <Text
                style={[
                  mainStyles.coinExtra,
                  mainStyles.textRight,
                  mainStyles.flex,
                ]}
              >
                {item.displayInterest}
              </Text>
            </Row>
          ))}
          {renderRate()}
        </ScrollView>
      </>
    );
  };

  const renderRate = () => {
    if (!isLoadingHistories && !histories?.length) {
      return (
        <Text style={mainStyles.coinExtra}>
          Rates subject to change at any time.
        </Text>
      );
    }
  };

  const handleOpenMigrate = (data) => {
    navigation.navigate(ROUTE_NAMES.PoolV2ProvideMigrateInput, {
      data,
      coins,
    });
  };

  const handleShowLockHistory = (coin) => {
    if (!coin.locked) {
      return null;
    }

    navigation.navigate(ROUTE_NAMES.PoolV2ProvideLockHistory, {
      coin,
      userData,
    });
  };

  const renderUserData = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => onLoad(account)}
          />
        }
        style={styles.scrollView}
      >
        {groupedUserData.map((item) => {
          const mapCoin = item.coin;
          return (
            <View key={`${item.id} ${item.locked}`} style={mainStyles.coin}>
              <TouchableOpacity onPress={() => handleShowLockHistory(mapCoin)} key={`${item.id} ${item.locked}`}>
                <View>
                  <Row>
                    <View>
                      <Text style={mainStyles.coinName}>{item.symbol}</Text>
                      <Text style={mainStyles.coinExtra}>
                        {mapCoin.displayInterest}
                      </Text>
                      {item.locked ? (
                        <Text style={mainStyles.coinExtra}>
                          {mapCoin.displayLockTime}
                        </Text>
                      ) : null}

                    </View>
                    <View style={[mainStyles.flex]}>
                      <Text style={[mainStyles.coinName, mainStyles.textRight]}>
                        {item.displayBalance}
                      </Text>
                      {!!item.displayPendingBalance && (
                        <Text style={[mainStyles.coinExtra, mainStyles.textRight]}>
                          + {item.displayPendingBalance}
                        </Text>
                      )}
                      {!!item.displayUnstakeBalance && (
                        <Text style={[mainStyles.coinExtra, mainStyles.textRight]}>
                          - {item.displayUnstakeBalance}
                        </Text>
                      )}
                      <Row
                        style={[mainStyles.textRight, mainStyles.justifyRight]}
                        center
                      >
                        <PRVSymbol style={mainStyles.coinInterest} />
                        <Text style={mainStyles.coinInterest}>
                          &nbsp;{item.displayReward}
                        </Text>
                      </Row>
                      {!!item.displayWithdrawReward && (
                        <Text style={[mainStyles.coinExtra, mainStyles.textRight]}>
                          - {item.displayWithdrawReward}
                        </Text>
                      )}
                    </View>
                  </Row>
                </View>
              </TouchableOpacity>
              {!item.locked && mapCoin.id === PRV_ID && (
                <View
                  style={styles.migrateRow}
                  center
                >
                  <RoundCornerButton
                    title="Migrate"
                    style={styles.migrateButton}
                    onPress={() => handleOpenMigrate(item)}
                  />
                </View>
              )}
            </View>
            
          );
        })}
        {renderRate()}
      </ScrollView>
    );
  };

  const renderBottom = () => {
    if (isLoadingHistories) {
      return (
        <View style={styles.rateChange}>
          <ActivityIndicator />
        </View>
      );
    }

    if (histories?.length > 0) {
      return (
        <View style={styles.rateChange}>
          <TouchableOpacity onPress={handleHistory}>
            <Row center spaceBetween style={mainStyles.flex}>
              <Text style={styles.rateStyle}>Provider history</Text>
              <ArrowRightGreyIcon style={[{ marginLeft: 10 }]} />
            </Row>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderContent = () => {
    if (withdrawable) {
      return renderUserData();
    }

    return renderEmpty();
  };

  return (
    <View style={mainStyles.coinContainer}>
      {renderContent()}
      {renderBottom()}
    </View>
  );
};

CoinList.propTypes = {
  coins: PropTypes.array,
  groupedUserData: PropTypes.array,
  userData: PropTypes.array,
  histories: PropTypes.array,
  withdrawable: PropTypes.bool,
  onLoad: PropTypes.func,
  loading: PropTypes.bool,
  account: PropTypes.object.isRequired,
  isLoadingHistories: PropTypes.bool,
};

CoinList.defaultProps = {
  coins: [],
  groupedUserData: [],
  userData: [],
  histories: [],
  withdrawable: false,
  onLoad: undefined,
  loading: false,
  isLoadingHistories: false,
};

export default React.memo(CoinList);

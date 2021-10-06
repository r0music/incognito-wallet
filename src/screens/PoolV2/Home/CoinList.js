import React from 'react';
import PropTypes from 'prop-types';
import upToIcon from '@src/assets/images/icons/upto_icon.png';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from '@components/core';
import mainStyles from '@screens/PoolV2/style';
import { Row, PRVSymbol } from '@src/components/';
import {ArrowRightGreyIcon, LockIcon} from '@components/Icons';
import { useNavigation } from 'react-navigation-hooks';
import ROUTE_NAMES from '@routers/routeNames';
import { RefreshControl } from 'react-native';
import { PRV_ID } from '@src/screens/DexV2/constants';
import styles from './style';

export const LockTimeComp = React.memo(({ time }) => {
  let timeText = time;
  if (time) {
    const arrTime = time.split(' ');
    if (arrTime && arrTime.length === 2) {
      timeText = `${arrTime[0]}${arrTime[1].charAt(0)}`;
    }
  }
  return (
    <Row style={mainStyles.wrapperLock}>
      <LockIcon />
      {time && <Text style={mainStyles.lockText}>{timeText}</Text>}
    </Row>
  );
});

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
          refreshControl={(
            <RefreshControl
              refreshing={loading}
              onRefresh={() => onLoad(account)}
            />
          )}
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

  const renderBtnMirage = (item) => {
    return (
      <TouchableOpacity style={mainStyles.btnMirage} onPress={() => handleOpenMigrate(item)}>
        <Text style={mainStyles.mirageText}>Migrate</Text>
      </TouchableOpacity>
    );
  };

  const renderMainCoin = (item) => {
    const mapCoin = item.coin;
    const provideBalance = item.balance;
    return (
      <View style={mainStyles.wrapTitle}>
        <Text style={[mainStyles.coinName, { marginBottom: 0 }]}>{item.symbol}</Text>
        {item.locked && <LockTimeComp />}
        {(!item.locked && mapCoin.id === PRV_ID && !!provideBalance) && renderBtnMirage(item)}
      </View>
    );
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
        <Text style={mainStyles.coinExtra}> {item.coin.displayInterest}</Text>
      </Row>
    );
  };

  const renderUserData = () => {
    return (
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={loading}
            onRefresh={() => onLoad(account)}
          />
        )}
        style={styles.scrollView}
      >
        {groupedUserData.map((item) => {
          const mapCoin = item.coin;
          if (!mapCoin) return null;
          const isLock = mapCoin.locked;
          const isPRV = mapCoin.id === PRV_ID;
          const provideBalance = item.balance;
          const COMP = isLock ? TouchableOpacity : View;
          return (
            <View key={`${item.id} ${item.locked}`} style={mainStyles.coin}>
              <COMP
                onPress={() => handleShowLockHistory(mapCoin)}
                key={`${item.id} ${item.locked}`}
                activeOpacity={isLock ? 0.7 : 1}
                style={[(!isLock && (!isPRV || !provideBalance)) && { opacity: 0.5 }]}
              >
                <View>
                  <Row>
                    <View>
                      {renderMainCoin(item)}
                      {renderUpToAPY(item)}
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
              </COMP>
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

LockTimeComp.propTypes = {
  time: PropTypes.string.isRequired
};

export default React.memo(CoinList);

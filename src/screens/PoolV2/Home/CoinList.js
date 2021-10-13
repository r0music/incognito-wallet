import React from 'react';
import PropTypes from 'prop-types';
import upToIcon from '@src/assets/images/icons/upto_icon.png';
import sumIcon from '@src/assets/images/icons/sum_icon.png';
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

export const LockTimeComp = React.memo(() => {
  return (
    <Row style={mainStyles.wrapperLock}>
      <LockIcon />
    </Row>
  );
});

export const SumIconComp = React.memo(() => {
  return (
    <Image
      source={sumIcon}
      style={{
        width: 16,
        height: 16,
        marginBottom: 8,
        marginRight: 8
      }}
    />
  );
});

const CoinList = ({
  coins,
  groupedCoins,
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

  const UpToIconComp = () => {
    return (
      <Image
        source={upToIcon}
        style={mainStyles.iconUp}
      />
    ); 
  };

  const renderEmpty = () => {
    return (
      <>
        <ScrollView
          refreshControl={(
            <RefreshControl
              refreshing={loading}
              onRefresh={() => onLoad(account)}
            />
          )}
          style={styles.scrollView}
        >
          {groupedCoins.map((item) => (
            <Row style={mainStyles.coin} key={`${item.id} ${item.locked}`}>
              <Text style={mainStyles.coinName}>{item.name}</Text>
              <Row style={[mainStyles.flex, mainStyles.emptyRight]}>
                {item.locked && <UpToIconComp />}
                <Text style={[mainStyles.coinExtra, mainStyles.textRight]}>{item.displayInterest}</Text>
              </Row>
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

  const renderBtnViewDetails = (item) => {
    return (
      <TouchableOpacity style={mainStyles.btnViewDetail} onPress={() => handleShowLockHistory(item)}>
        <Text style={mainStyles.viewDetailText}>View details</Text>
      </TouchableOpacity>
    );
  };

  const renderMainCoin = (item) => {
    const mapCoin = item.coin;
    const provideBalance = item.balance;
    return (
      <View style={mainStyles.wrapTitle}>
        <Text style={[mainStyles.coinName, { marginBottom: 0 }]}>{item.symbol}</Text>
        {item.locked && (
          <>
            <LockTimeComp />
            {renderBtnViewDetails(mapCoin)}
          </>
        )}
        {(!item.locked && mapCoin.id === PRV_ID && !!provideBalance) && renderBtnMirage(item)}
      </View>
    );
  };

  const renderUpToAPY = (item) => {
    return (
      <Row style={{alignItems: 'center'}}>
        {item.locked && <UpToIconComp />}
        <Text style={mainStyles.coinExtra}>{item.coin.displayInterest}</Text>
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
          return (
            <View key={`${item.id} ${item.locked}`} style={mainStyles.coin}>
              <View key={`${item.id} ${item.locked}`}>
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
                        {item.locked && <SumIconComp />}
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
              </View>
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
  groupedCoins: PropTypes.array,
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
  groupedCoins: [],
  groupedUserData: [],
  userData: [],
  histories: [],
  withdrawable: false,
  onLoad: undefined,
  loading: false,
  isLoadingHistories: false,
};

export default React.memo(CoinList);

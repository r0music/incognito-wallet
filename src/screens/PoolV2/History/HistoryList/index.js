/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { compose } from 'recompose';
import { View, Text, TouchableOpacity, ActivityIndicator, LoadingContainer, RefreshControl } from '@components/core';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import { VirtualizedList } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import ROUTE_NAMES from '@routers/routeNames';
import { ArrowRightGreyIcon } from '@components/Icons';
import withHistories from '@screens/PoolV2/histories.enhance';
import withDefaultAccount from '@components/Hoc/withDefaultAccount';
import { LIMIT } from '@screens/PoolV2/constants';
import globalStyled from '@src/theme/theme.styled';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme';
import { selectedPrivacySelector } from '@src/redux/selectors';
import styles from './style';

const History = ({
  histories,
  isLoadingHistories,
  onReloadHistories,
  onLoadMoreHistories,
  isLoadingMoreHistories,
}) => {
  const navigation = useNavigation();
  const colors = useSelector(colorsSelector);
  const getPrivacyDataByTokenID = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID);
  const viewDetail = (item) => {
    navigation.navigate(ROUTE_NAMES.PoolV2HistoryDetail, { history: item });
  };

  // eslint-disable-next-line react/prop-types
  const renderHistoryItem = ({ item, index }) => {
    const { network } = getPrivacyDataByTokenID(item.coinId);

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.historyItem,
          { borderBottomColor: colors.border4, borderBottomWidth: 1 },
          index === 0 && { paddingTop: 0 },
          globalStyled.defaultPaddingHorizontal,
        ]}
        onPress={() => viewDetail(item)}
      >
        <Text style={styles.buttonTitle}>{item.type}</Text>
        <View style={styles.row}>
          <View style={{flexDirection: 'row'}}>
            <Text numberOfLines={1}>
              {item.description}
            </Text>
            <View style={styles.networkBoxContainer}>
              <Text style={styles.networkName}>{network}</Text>
            </View>
          </View>
          <View style={[styles.row, styles.center]}>
            <Text
              style={[styles.content, { color: item.statusColor }]}
              numberOfLines={1}
            >
              {item.status}
            </Text>
            <ArrowRightGreyIcon style={{ marginLeft: 10 }} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => isLoadingMoreHistories ?
    <ActivityIndicator /> : null;

  return (
    <>
      <Header title="Provider history" onGoBack={() => navigation.navigate(ROUTE_NAMES.PoolV2)} />
      <View style={[styles.wrapper, styles.historyTitle, { paddingTop: 24 }]} borderTop>
        {histories.length ? (
          <VirtualizedList
            refreshControl={(
              <RefreshControl
                refreshing={isLoadingHistories}
                onRefresh={onReloadHistories}
              />
            )}
            data={histories}
            renderItem={renderHistoryItem}
            getItem={(data, index) => data[index]}
            getItemCount={data => data.length}
            keyExtractor={(item, index) => `list-item-${index}`}
            onEndReached={(histories || []).length >= LIMIT ? onLoadMoreHistories : _.noop}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={renderFooter}
          />
        ) : <LoadingContainer /> }
      </View>
    </>
  );
};

History.propTypes = {
  histories: PropTypes.array,
  isLoadingHistories: PropTypes.bool,
  isLoadingMoreHistories: PropTypes.bool,
};

History.defaultProps = {
  histories: null,
  isLoadingHistories: false,
  isLoadingMoreHistories: false,
};

export default compose(
  withLayout_2,
  withDefaultAccount,
  withHistories,
)(History);

import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Divider,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from '@src/components/core';
import { colorsSelector } from '@src/theme';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from '@src/components';
import { FONT } from '@src/styles';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { actionFetchedOrderDetail } from './Swap.actions';
import { swapHistorySelector } from './Swap.selector';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
  },
  flatlist: {
    flex: 1,
    paddingBottom: 24,
  },
  order: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  orderId: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    maxWidth: 200,
  },
  swap: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    marginRight: 15,
    flex: 1,
  },
  statusStr: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
  },
  wrapperOrder: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
  },
});

const Order = React.memo(({ data }) => {
  const navigation = useNavigation();
  const colors = useSelector(colorsSelector);
  const dispatch = useDispatch();
  if (!data?.requestTx) {
    return null;
  }
  const { statusStr, swapStr, requestTx, tradeID, exchange } = data;

  const handleNavOrderDetail = async () => {
    await dispatch(actionFetchedOrderDetail(data));
    navigation.navigate(routeNames.OrdeSwapDetail);
  };
  return (
    <>
      <TouchableOpacity style={styled.order} onPress={handleNavOrderDetail}>
        <View style={styled.wrapperOrder}>
          <Row style={{ ...styled.row, marginBottom: 4 }}>
            <Text style={[styled.swap]}>{swapStr}</Text>
            <Text style={[styled.statusStr]}>{statusStr}</Text>
          </Row>
          <Row style={styled.row}>
            <Text
              style={[styled.orderId, { color: colors.subText }]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {`#${tradeID || requestTx}`}
            </Text>
            <Text style={[styled.title, { color: colors.subText }]}>
              {exchange}
            </Text>
          </Row>
        </View>
      </TouchableOpacity>
    </>
  );
});

const OrderHistory = () => {
  const { isFetching, history = [] } = useSelector(swapHistorySelector);
  return (
    <View style={styled.container}>
      <FlatList
        refreshControl={<RefreshControl refreshing={isFetching} />}
        data={history}
        keyExtractor={(item) => item?.tradeID || item?.requestTx}
        renderItem={({ item, index, arr }) => (
          <>
            <Order data={item} visibleDivider={index !== history.length - 1} />
            {index !== history.length - 1 && <Divider />}
          </>
        )}
        contentContainerStyle={styled.flatlist}
      />
    </View>
  );
};

OrderHistory.propTypes = {};

export default React.memo(OrderHistory);

import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Divider,
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
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import PropTypes from 'prop-types';
import { actionFetchedOrderDetail } from './Swap.actions';
import { swapHistorySelector } from './Swap.selector';

const styled = StyleSheet.create({
  container: {
    flex: 1,
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
  if (!data?.requestBurnTxInc) {
    return null;
  }
  const { statusStr, swapStr, requestBurnTxInc, exchange, color: statusColor } = data;

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
            <Text style={[styled.statusStr, { color: statusColor }]}>{statusStr}</Text>
          </Row>
          <Row style={styled.row}>
            <Text
              style={[styled.orderId, { color: colors.subText }]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {`#${requestBurnTxInc}`}
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

const OrderHistory = ({ page }) => {
  const { history = [] } = useDebounceSelector(swapHistorySelector)();

  const historyDisplay = React.useMemo(() => {
    if (!page) return [];
    return history.slice(0, page);
  }, [page, history]);


  const renderItem = React.useCallback((item, index) => {
    return (
      <View key={item?.requestBurnTxInc}>
        <Order data={item} visibleDivider={index !== history.length - 1} />
        {index !== history.length - 1 && <Divider />}
      </View>
    );
  }, []);
  return (
    <View style={styled.container}>
      {historyDisplay.map(renderItem)}
    </View>
  );
};

Order.propTypes = {
  data: PropTypes.any.isRequired,
};

OrderHistory.propTypes = {
  page: PropTypes.number.isRequired,
};

export default React.memo(OrderHistory);

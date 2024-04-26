import { OrderBook } from '@screens/PDexV3/features/Chart/Chart.orderBook';
import { Tabs } from '@src/components/core';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ROOT_TAB_SUB_INFO,
  TAB_HISTORY_ID,
  TAB_OPEN_ORDER,
  TAB_ORDER_BOOK,
} from './OrderLimit.constant';
import History from './OrderLimit.orderHistory';
import {
  openOrdersSelector,
  orderHistorySelector,
} from './OrderLimit.selector';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
});

const GroupSubInfo = ({ styleContainer }) => {
  const orderHistory = useDebounceSelector(orderHistorySelector);
  const openOrders = useDebounceSelector(openOrdersSelector);
  return (
    <View style={[styled.container, styleContainer ?? {}]}>
      <Tabs rootTabID={ROOT_TAB_SUB_INFO}>
        <View
          tabID={TAB_ORDER_BOOK}
          label="Order book"
          upperCase={false}
          onChangeTab={() => null}
        >
          <OrderBook />
        </View>
        <View
          tabID={TAB_OPEN_ORDER}
          label="Open orders"
          onChangeTab={() => null}
          upperCase={false}
        >
          <History {...openOrders} />
        </View>
        <View
          tabID={TAB_HISTORY_ID}
          label="History"
          onChangeTab={() => null}
          upperCase={false}
        >
          <History {...orderHistory} />
        </View>
      </Tabs>
    </View>
  );
};

GroupSubInfo.propTypes = {
  styleContainer: PropTypes.object,
};

export default React.memo(GroupSubInfo);

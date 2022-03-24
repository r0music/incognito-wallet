import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from '@src/components/core';
import { OrderBook } from '@screens/PDexV3/features/Chart/Chart.orderBook';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import {
  openOrdersSelector,
  orderHistorySelector,
} from './OrderLimit.selector';
import History from './OrderLimit.orderHistory';
import {
  TAB_OPEN_ORDER,
  TAB_ORDER_BOOK,
  ROOT_TAB_SUB_INFO,
  TAB_HISTORY_ID,
} from './OrderLimit.constant';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
});

const GroupSubInfo = () => {
  const orderHistory = useDebounceSelector(orderHistorySelector);
  const openOrders = useDebounceSelector(openOrdersSelector);
  return (
    <View style={styled.container}>
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

GroupSubInfo.propTypes = {};

export default React.memo(GroupSubInfo);

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList, RefreshControl } from '@src/components/core';
import { useSelector } from 'react-redux';
import { orderHistorySelector } from './OrderLimit.selector';
import Order from './OrderLimit.order';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    paddingVertical: 24,
  },
});

const OrderHistory = () => {
  const { history = [], isFetching } = useSelector(orderHistorySelector);
  return (
    <View style={styled.container}>
      <FlatList
        refreshControl={<RefreshControl refreshing={isFetching} />}
        data={history}
        keyExtractor={(item) => item?.requestTx}
        renderItem={({ item, index }) => (
          <Order data={item} visibleDivider={index !== history.length - 1} />
        )}
        contentContainerStyle={styled.flatlist}
      />
    </View>
  );
};

OrderHistory.propTypes = {};

export default React.memo(OrderHistory);

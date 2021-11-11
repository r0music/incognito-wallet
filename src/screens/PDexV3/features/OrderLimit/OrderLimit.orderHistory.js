import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList } from '@src/components/core';
import { batch, useDispatch, useSelector } from 'react-redux';
import { actionSetNFTTokenData } from '@src/redux/actions/account';
import { ExHandler } from '@src/services/exception';
import { orderHistorySelector } from './OrderLimit.selector';
import Order from './OrderLimit.order';
import {
  actionFetchOrdersHistory,
  actionFetchWithdrawOrderTxs,
} from './OrderLimit.actions';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    paddingVertical: 24,
  },
});

const OrderHistory = () => {
  const dispatch = useDispatch();
  const onRefresh = async () => {
    try {
      batch(() => {
        dispatch(actionFetchOrdersHistory());
        dispatch(actionFetchWithdrawOrderTxs());
        dispatch(actionSetNFTTokenData());
      });
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const { history = [] } = useSelector(orderHistorySelector);
  React.useEffect(() => {
    onRefresh();
  }, []);
  return (
    <View style={styled.container}>
      <FlatList
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

import React from 'react';
import { StyleSheet } from 'react-native';
import { View, FlatList, RefreshControl, Divider } from '@src/components/core';
import { useDispatch } from 'react-redux';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { poolIdSelector } from './OrderLimit.selector';
import Order from './OrderLimit.order';
import { actionFetchOrdersHistory } from './OrderLimit.actions';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
  },
  flatlist: {
    paddingBottom: 24,
  },
});

export const useHistoryOrders = ({ field }) => {
  const poolId = useDebounceSelector(poolIdSelector);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(actionFetchOrdersHistory(field));
  }, [poolId]);
  return { poolId };
};

const OrderHistory = ({ history = [], isFetching, field }) => {
  useHistoryOrders({ field });
  return (
    <View style={styled.container}>
      <FlatList
        refreshControl={<RefreshControl refreshing={isFetching} />}
        data={history}
        keyExtractor={(item) => item?.requestTx}
        renderItem={({ item, index }) => (
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

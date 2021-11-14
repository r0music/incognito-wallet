import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Hook } from '@screens/PDexV3/features/Extra';
import {
  sellInputAmountSelector,
  buyInputAmountSelector,
  orderLimitDataSelector,
} from './OrderLimit.selector';

const styled = StyleSheet.create({
  container: {},
});

const OrderDetails = () => {
  const sellInputAmount = useSelector(sellInputAmountSelector);
  const buyInputAmount = useSelector(buyInputAmountSelector);
  const orderLimitData = useSelector(orderLimitDataSelector);
  const {
    networkfeeAmountStr,
    totalAmountData: { totalStr },
  } = orderLimitData;
  const factories = [
    {
      label: sellInputAmount?.balanceTitle,
      value: sellInputAmount?.balanceStr,
    },
    {
      label: buyInputAmount?.balanceTitle,
      value: buyInputAmount?.balanceStr,
    },
    {
      label: 'Network fee',
      value: networkfeeAmountStr,
    },
    {
      label: 'Total',
      value: totalStr,
    },
  ];
  return (
    <View style={styled.container}>
      {factories.map((item) => (
        <Hook {...item} />
      ))}
    </View>
  );
};

OrderDetails.propTypes = {};

export default React.memo(OrderDetails);

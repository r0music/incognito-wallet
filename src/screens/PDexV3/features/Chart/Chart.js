import React from 'react';
import { View } from 'react-native';
import Header from '@src/components/Header';
import { GroupActions } from '@screens/PDexV3/features/Share';
import { ScrollView } from '@src/components/core';
import withChart from './Chart.enhance';
import PriceHistory from './Chart.priceHistory';
import OrderBook from './Chart.orderBook';
import Details from './Chart.details';
import { styled } from './Chart.styled';

const Chart = ({ onRefresh, callback }) => {
  return (
    <View style={styled.container}>
      <Header title="Order Book" />
      <ScrollView style={styled.scrollview}>
        <GroupActions onPressRefresh={onRefresh} callback={callback} />
        <PriceHistory />
        <Details />
        <OrderBook />
      </ScrollView>
    </View>
  );
};

Chart.propTypes = {};

export default withChart(React.memo(Chart));

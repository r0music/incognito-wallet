import React from 'react';
import { View, StyleSheet } from 'react-native';
import isEmpty from 'lodash/isEmpty';
import Extra, { Hook } from '@screens/PDexV3/features/Extra';
import { useSelector } from 'react-redux';
import { orderLimitDataSelector } from './OrderLimit.selector';

const styled = StyleSheet.create({
  container: {},
});

export const useSubInfo = () => {
  const orderLimitData = useSelector(orderLimitDataSelector);
  const data = [
    {
      label: 'Balance',
      value: orderLimitData?.balanceStr ?? '',
    },
    orderLimitData?.showPRVBalance
      ? {
        label: 'PRV Balance',
        value: orderLimitData?.prvBalanceStr ?? '',
      }
      : {},
    {
      label: 'Network fee',
      value: orderLimitData?.networkfeeAmountStr ?? '',
    },
    {
      label: 'Incognito',
      value: orderLimitData?.poolSizeStr ?? '',
      boldLabel: true,
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
    },
  ].filter((hook) => !isEmpty(hook));
  return [data];
};

const SubInfo = () => {
  const [subInfoFactories] = useSubInfo();
  const extraFactories = [
    {
      title: 'Trade details',
      hooks: subInfoFactories.map((hook, index) => (
        <Hook {...hook} key={hook.label + index} />
      )),
    },
  ];
  return (
    <View style={styled.container}>
      {extraFactories.map((extra) => (
        <Extra {...extra} key={extra.label} />
      ))}
    </View>
  );
};

SubInfo.propTypes = {};

export default React.memo(SubInfo);

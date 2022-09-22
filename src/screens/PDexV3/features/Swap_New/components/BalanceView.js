import { View, Text } from '@src/components/core';
import React from 'react';
import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  labelText: {
    color: COLORS.lightGrey36,
    fontWeight: '400',
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 8,
  },
});

const BalanceView = (props) => {
  const { balance = '0.0 USDC' } = props;
  return (
    <View style={styled.container}>
      <Text style={styled.labelText}>Balance: </Text>
      <Text style={[styled.balanceValue, { color: COLORS.white }]}>
        {balance}
      </Text>
    </View>
  );
};

BalanceView.defaultProps = {};

BalanceView.propTypes = {};

export default BalanceView;

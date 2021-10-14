import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  hook: {
    marginBottom: 30,
  },
  label: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 5,
    marginBottom: 15,
    color: COLORS.black,
  },
  value: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
    color: COLORS.colorGreyBold,
  },
});

const Hook = (props) => {
  const { label, value } = props;
  return (
    <View style={styled.hook}>
      <Text style={styled.label}>{label}</Text>
      <Text style={styled.value}>{value}</Text>
    </View>
  );
};

Hook.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default React.memo(Hook);

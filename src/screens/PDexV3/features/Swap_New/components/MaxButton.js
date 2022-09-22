import { View, TouchableOpacity, Text } from '@src/components/core';
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { FONT, THEME, COLORS } from '@src/styles';
import throttle from 'lodash/throttle';

const styled = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 4,
    borderRadius: 4,
    backgroundColor: COLORS.lightGrey38,
  },
  text: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 8,
    textAlign: 'center',
  },
});

const MaxButton = (props) => {
  const { onPress = () => {} } = props;
  const maxOnPressed = throttle(() => {
    console.log('maxOnPressed! TO DO');
    onPress && onPress();
  }, 2000);

  return (
    <TouchableOpacity style={styled.container} onPress={maxOnPressed}>
      <Text style={styled.text}>MAX</Text>
    </TouchableOpacity>
  );
};

MaxButton.defaultProps = {};

MaxButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default MaxButton;

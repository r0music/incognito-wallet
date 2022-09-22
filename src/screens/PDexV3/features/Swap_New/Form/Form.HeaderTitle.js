import { Text } from '@src/components/core';
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

const styled = StyleSheet.create({
  labelText: {
    color: COLORS.lightGrey36,
    fontWeight: '400',
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 8,
  },
});

const FormHeaderTitle = (props) => {
  const { title = '' } = props;
  return <Text style={styled.labelText}>{title}</Text>;
};

FormHeaderTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

FormHeaderTitle.defaultProps = {};

export default FormHeaderTitle;

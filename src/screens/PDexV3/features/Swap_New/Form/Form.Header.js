import { View } from '@src/components/core';
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  leftViewContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  rightViewContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

const FormHeader = (props) => {
  const { rightView, leftView } = props;
  return (
    <View style={styled.container}>
      {leftView && <View style={styled.leftViewContainer}>{leftView}</View>}
      {rightView && <View style={styled.rightViewContainer}>{rightView}</View>}
    </View>
  );
};

FormHeader.propTypes = {
  leftView: PropTypes.element,
  rightView: PropTypes.element,
};
FormHeader.defaultProps = {
  leftView: null,
  rightView: null,
};

export default FormHeader;

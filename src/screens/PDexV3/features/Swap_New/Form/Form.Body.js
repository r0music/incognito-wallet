import { View } from '@src/components/core';
import { COLORS } from '@src/styles';
import React from 'react';
import { StyleSheet } from 'react-native';

import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    borderRadius: 16,
    height: 115,
    borderWidth: 1,
    borderColor: COLORS.lightGrey38,
    backgroundColor: COLORS.black3,
    overflow: 'hidden',
  },

  topViewContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.black3,
  },

  topLeftViewContainer: {
    flex: 1,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black3,
  },

  topRightViewContainer: {
    flex: 1,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black3,
  },

  breakLineColumn: {
    height: '100%',
    width: 1,
    borderColor: COLORS.lightGrey38,
  },

  breakLineRow: {
    width: '100%',
    height: 1,
    borderColor: COLORS.lightGrey38,
  },

  bottomViewContainer: {
    flex: 1,
    backgroundColor: COLORS.black3,
  },
});

const FormBody = (props) => {
  console.log('FormBody >>> props ', props);

  const { topLeftView, topRightView, bottomView } = props;

  return (
    <View style={styled.container}>
      <View style={styled.topViewContainer}>
        <View style={styled.topLeftViewContainer}>{topLeftView}</View>
        <View style={styled.breakLineColumn} />
        <View style={styled.topRightViewContainer}>{topRightView}</View>
      </View>
      <View style={styled.breakLineRow} />
      <View style={styled.bottomViewContainer}>{bottomView}</View>
    </View>
  );
};

FormBody.propTypes = {
  topLeftView: PropTypes.element.isRequired,
  topRightView: PropTypes.element.isRequired,
  bottomView: PropTypes.element.isRequired,
};
FormBody.defaultProps = {};

export default FormBody;

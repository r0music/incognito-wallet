import React from 'react';
import { Image, StyleSheet } from 'react-native';
import QrCodeSrc from '@src/assets/images/new-icons/history_order.png';
import { TouchableOpacity } from '@src/components/core';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 16.67,
    height: 20,
  },
});

const BtnOrderHistory = ({ source, style, ...rest }) => {
  return (
    <TouchableOpacity style={{ ...styled.container, ...style }} {...rest}>
      <Image style={styled.icon} source={source} />
    </TouchableOpacity>
  );
};

BtnOrderHistory.defaultProps = {
  source: QrCodeSrc,
};

BtnOrderHistory.propTypes = {
  source: PropTypes.any,
};

export default BtnOrderHistory;

import React from 'react';
import PropTypes from 'prop-types';
import { View } from '@components/core';
import styles from './style';

const Row = ({
  style,
  center,
  children,
  spaceBetween,
  centerVertical
}) => (
  <View style={[styles.row, center && styles.center, spaceBetween && styles.spaceBetween, centerVertical && styles.centerVertical, style]}>
    {children}
  </View>
);

Row.propTypes = {
  style: PropTypes.object,
  center: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  spaceBetween: PropTypes.bool,
  centerVertical: PropTypes.bool,
};

Row.defaultProps = {
  style: null,
  center: false,
  spaceBetween: false,
  centerVertical: false
};

export default Row;

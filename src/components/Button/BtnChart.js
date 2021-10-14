import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import srcChartIcon from '@src/assets/images/new-icons/candle.png';
import PropTypes from 'prop-types';
import { COLORS } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 17.36,
    height: 18,
  },
});

const BtnChart = (props) => {
  const { style, ...rest } = props;
  return (
    <TouchableOpacity style={[styled.container, style]} {...rest}>
      <Image source={srcChartIcon} style={styled.icon} />
    </TouchableOpacity>
  );
};

BtnChart.defaultProps = {};

BtnChart.propTypes = {};

export default BtnChart;

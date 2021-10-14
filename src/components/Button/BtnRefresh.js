import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import srcRefreshIcon from '@src/assets/images/new-icons/refresh.png';

const styled = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 15.3,
    height: 18,
  },
});

const BtnChart = (props) => {
  const { style, ...rest } = props;
  return (
    <TouchableOpacity style={[styled.container, style]} {...rest}>
      <Image source={srcRefreshIcon} style={styled.icon} />
    </TouchableOpacity>
  );
};

BtnChart.defaultProps = {};

BtnChart.propTypes = {};

export default BtnChart;

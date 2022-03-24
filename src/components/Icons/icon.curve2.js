import React from 'react';
import { StyleSheet, ImageProps } from 'react-native';
import { Image } from '@src/components/core';
import curveSrcIcon from '@src/assets/images/new-icons/curve2.png';

const styled = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
});

const CurveIcon2 = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={curveSrcIcon} style={[styled.icon, style]} {...rest} />;
};

CurveIcon2.propTypes = {};

export default CurveIcon2;

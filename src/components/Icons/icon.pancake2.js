import React from 'react';
import { StyleSheet, ImageProps } from 'react-native';
import { Image } from '@src/components/core';
import pancakeSrcIcon from '@src/assets/images/new-icons/pancake2.png';

const styled = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
});

const PancakeIcon2 = (props: ImageProps) => {
  const { style, ...rest } = props;
  return (
    <Image source={pancakeSrcIcon} style={[styled.icon, style]} {...rest} />
  );
};

PancakeIcon2.propTypes = {};

export default PancakeIcon2;

import React from 'react';
import { StyleSheet, ImageProps } from 'react-native';
import { Image } from '@src/components/core';
import raydiumSrcIcon from '@src/assets/images/new-icons/raydium.png';

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const RaydiumIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={raydiumSrcIcon} style={[styled.icon, style]} {...rest} />;
};

RaydiumIcon.propTypes = {};

export default RaydiumIcon;

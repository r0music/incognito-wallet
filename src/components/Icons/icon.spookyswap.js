import React from 'react';
import { StyleSheet, ImageProps } from 'react-native';
import { Image } from '@src/components/core';
import spookySwapSrcIcon from '@src/assets/images/new-icons/spookyswap.png';

const styled = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
});

const SpookySwapIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return (
    <Image source={spookySwapSrcIcon} style={[styled.icon, style]} {...rest} />
  );
};

SpookySwapIcon.propTypes = {};

export default SpookySwapIcon;

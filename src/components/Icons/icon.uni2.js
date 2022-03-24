import React from 'react';
import { StyleSheet, ImageProps } from 'react-native';
import { Image } from '@src/components/core';
import uniSrcIcon from '@src/assets/images/new-icons/uni2.png';

const styled = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
});

const UniIcon2 = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={uniSrcIcon} style={[styled.icon, style]} {...rest} />;
};

UniIcon2.propTypes = {};

export default UniIcon2;

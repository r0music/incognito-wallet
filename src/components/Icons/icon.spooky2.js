import React from 'react';
import { StyleSheet, ImageProps } from 'react-native';
import { Image } from '@src/components/core';
import { COLORS } from '@src/styles';
import spoonkyIcon2 from '@src/assets/images/new-icons/spooky2.png';

const styled = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
});

const SpoonkyIcon2 = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={spoonkyIcon2} style={[styled.icon, style]} {...rest} />;
};

SpoonkyIcon2.propTypes = {};

export default SpoonkyIcon2;

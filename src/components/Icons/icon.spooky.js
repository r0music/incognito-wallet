import React from 'react';
import { StyleSheet, ImageProps } from 'react-native';
import { Image } from '@src/components/core';
import { COLORS } from '@src/styles';
import spoonkyIcon from '@src/assets/images/new-icons/spooky_icon.png';

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const PancakeIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={spoonkyIcon} style={[styled.icon, style]} {...rest} />;
};

PancakeIcon.propTypes = {};

export default PancakeIcon;

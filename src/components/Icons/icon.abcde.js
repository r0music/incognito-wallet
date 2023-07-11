import React from 'react';
import { StyleSheet, ImageProps } from 'react-native';
import { Image } from '@src/components/core';
import trisolarisIcon from '@src/assets/images/new-icons/trisolaris_icon.png'; //TODO

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

//TODO
const TrisolarisIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return (
    <Image source={trisolarisIcon} style={[styled.icon, style]} {...rest} />
  );
};

TrisolarisIcon.propTypes = {};

export default TrisolarisIcon;

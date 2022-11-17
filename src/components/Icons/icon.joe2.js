import React from 'react';
import { StyleSheet, ImageProps } from 'react-native';
import { Image } from '@src/components/core';
import joeIcon from '@src/assets/images/new-icons/joe_icon2.png';

const styled = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
});

const JoeIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={joeIcon} style={[styled.icon, style]} {...rest} />;
};

JoeIcon.propTypes = {};

export default JoeIcon;

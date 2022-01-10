import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@src/components/core';
import { COLORS } from '@src/styles';

const styled = StyleSheet.create({
  icon: {
    width: 34,
    height: 34,
    backgroundColor: COLORS.black,
    borderRadius: 80,
  },
});

const AppIcon = (props) => {
  return <View style={{ ...styled.icon, ...props?.style }} />;
};

AppIcon.propTypes = {};

export default AppIcon;

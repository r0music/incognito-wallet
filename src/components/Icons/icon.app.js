import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@src/components/core';
import { COLORS } from '@src/styles';

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.black,
    borderRadius: 12,
  },
});

const AppIcon = (props) => {
  return <View style={{ ...styled.icon, ...props?.style }} />;
};

AppIcon.propTypes = {};

export default AppIcon;

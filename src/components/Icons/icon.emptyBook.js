import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { FONT } from '@src/styles';
import { Text3 } from '@components/core';
import EmptyIcon from '@src/assets/images/icons/empty.png';

export const styled = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  message: {
    ...FONT.STYLE.medium,
    fontWeight: '400',
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 9,
    textAlign: 'center',
    maxWidth: '80%',
    marginTop: 25
  },
  image: {
    width: 80,
    height: 80
  }
});

const EmptyBookIcon = ({ message }) => (
  <View style={styled.container}>
    <Image source={EmptyIcon} style={styled.image} />
    {!!message && (<Text3 style={styled.message}>{message}</Text3>)}
  </View>
);




EmptyBookIcon.propTypes = {
  message: PropTypes.string.isRequired
};

export default EmptyBookIcon;

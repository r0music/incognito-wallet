import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { View } from '@src/components/core';
import srcOpenUrl from '@src/assets/images/new-icons/open-link.png';

const styled = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 12,
    height: 12,
  },
});

const IconOpenUrl = (props) => {
  return (
    <View style={[styled.container, props?.containerStyle]}>
      <Image style={[styled.icon, props?.style]} source={srcOpenUrl} />
    </View>
  );
};

IconOpenUrl.propTypes = {};

export default IconOpenUrl;

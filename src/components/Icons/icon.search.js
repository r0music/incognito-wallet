import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { View } from '@src/components/core';
import srcCopy from '@src/assets/images/new-icons/search.png';

const styled = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 14,
    height: 13.97,
  },
});

const IconSearch = (props) => {
  return (
    <View style={styled.container}>
      <Image style={[styled.icon, props?.style]} source={srcCopy} />
    </View>
  );
};

IconSearch.propTypes = {};

export default IconSearch;

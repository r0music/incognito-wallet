import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import imgEmpty from '@src/assets/images/pdexv3/empty.png';

const styled = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  image: {
    width: 100,
    height: 85
  }
});

const Empty = () => {
  return (
    <View style={styled.main}>
      <Image style={styled.image} source={imgEmpty} />
    </View>
  );
};

export default memo(Empty);

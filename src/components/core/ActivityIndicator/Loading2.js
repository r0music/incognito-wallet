import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Loading2 = () => {
  return (
    <View animation="fadeIn" style={styles.container}>
      <LottieView
        autoPlay
        loop
        source={require('../../../assets/lottie/loading2.json')}
        resizeMode="contain"
      />
    </View>
  );
};

export default Loading2;

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

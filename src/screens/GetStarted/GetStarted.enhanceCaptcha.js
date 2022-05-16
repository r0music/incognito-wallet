import React, { useState } from 'react';
import WebView from 'react-native-webview';
import ErrorBoundary from '@components/ErrorBoundary';
import { View2 } from '@components/core/View';
import { ActivityIndicator, Text } from '@components/core';
import { StyleSheet } from 'react-native';
import style from '@screens/GetStarted/style';

const withHCaptcha = WrappedComp => props => {
  const [captcha, setCaptcha] = useState(null);
  const onReceiveMessage = (e) => {
    const payload = e.nativeEvent.data;
    if (payload) {
      setCaptcha(payload);
      global.hcaptcha = payload;
    }
  };

  if (!captcha) {
    return (
      <>
        <View2 style={styles.wrapper}>
          <View2 style={style.loadingContainer}>
            <ActivityIndicator size="large" />
          </View2>
          <View2 style={style.getStartedBlock}>
            <Text style={[style.title, style.centerText]}>
              Loading configs...
            </Text>
          </View2>
        </View2>
        <WebView
          source={{ uri: 'http://172.168.11.22:3000/' }}
          originWhitelist={['*']}
          mixedContentMode="always"
          onMessage={onReceiveMessage}
          javaScriptEnabled
          automaticallyAdjustContentInsets
          style={{ backgroundColor: 'transparent', position: 'absolute' }}
        />
      </>
    );
  }

  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props }} />
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
});


export default withHCaptcha;
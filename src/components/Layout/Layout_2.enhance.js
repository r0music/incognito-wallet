import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { COLORS } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  wrapper: {
    paddingHorizontal: 25,
    flex: 1,
  },
});

const enhance = (WrappedComp) => (props) => {
  return (
    <ErrorBoundary>
      <SafeAreaView style={[styled.container, props?.containerStyled]}>
        <View style={[styled.wrapper, props?.wrapperStyled]}>
          <WrappedComp {...props} />
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

export default enhance;

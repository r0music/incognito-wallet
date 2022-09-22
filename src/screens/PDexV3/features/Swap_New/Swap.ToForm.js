import { View } from '@src/components/core';
import React from 'react';
import { StyleSheet } from 'react-native';

import FormBody from './Form/Form.Body';
import FormHeader from './Form/Form.Header';
import FormHeaderTitle from './Form/Form.HeaderTitle';

import TokenView from './components/TokenView';
import NetworkView from './components/NetworkView';
import ToInputAmount from './components/ToInputAmount';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8,
  },
});

const FromForm = (props) => {
  const { ...rest } = props;
  return (
    <View style={styled.container}>
      <FormHeader leftView={<FormHeaderTitle title="To" />} />
      <FormBody
        topLeftView={<TokenView tokenName="ETH" />}
        topRightView={
          <NetworkView networtName="Polygon" isIncognitoNetwork={false} />
        }
        bottomView={<ToInputAmount hasMaxValue={false} />}
      />
    </View>
  );
};

FromForm.propTypes = {};
FromForm.defaultProps = {};

export default FromForm;

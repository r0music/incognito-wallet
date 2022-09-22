import { View } from '@src/components/core';
import React from 'react';
import { StyleSheet } from 'react-native';
import { change, Field } from 'redux-form';

import FormBody from './Form/Form.Body';
import FormHeader from './Form/Form.Header';
import FormHeaderTitle from './Form/Form.HeaderTitle';

import BalanceView from './components/BalanceView';
import TokenView from './components/TokenView';
import NetworkView from './components/NetworkView';
import FromInputAmount from './components/FromInputAmount';

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
      <FormHeader
        leftView={<FormHeaderTitle title="From" />}
        rightView={<BalanceView />}
      />
      <FormBody
        topLeftView={<TokenView tokenName="USDC" />}
        topRightView={<NetworkView networtName="Incognito" />}
        bottomView={<FromInputAmount />}
      />
    </View>
  );
};

FromForm.propTypes = {};
FromForm.defaultProps = {};

export default FromForm;

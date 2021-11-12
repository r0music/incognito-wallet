import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import withWallet from '@screens/Wallet/features/Home/Wallet.enhance';
import Header from '@screens/Wallet/features/Home/Wallet.header';
import { styled } from '@screens/Wallet/features/Home/Wallet.styled';
import Extra from '@screens/Wallet/features/Home/Wallet.extra';

const Wallet = React.memo(() => {
  return (
    <View style={styled.container}>
      <Header />
      <Extra />
    </View>
  );
});

Wallet.defaultProps = {
};

Wallet.propTypes = {
};

export default withWallet(Wallet);

import React from 'react';
import { StyleSheet } from 'react-native';
import { PureModalContent } from '@src/components/Modal/features/PureModal';
import { ActivityIndicator, Text } from '@src/components/core';
import { FONT } from '@src/styles';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme';

const styled = StyleSheet.create({
  desc: {
    ...FONT.TEXT.incognitoH5,
    textAlign: 'center',
    marginTop: 10,
  },
  sub: {
    ...FONT.TEXT.incognitoP1,
    textAlign: 'center',
    marginTop: 16,
  },
});

const ModalSwitchingAccount = (props) => {
  const colors = useSelector(colorsSelector);
  return (
    <PureModalContent>
      <ActivityIndicator size='large' />
      <Text style={[styled.desc]}>Switchinng account...</Text>
      <Text style={[styled.sub, { color: colors.subText }]}>Please wait a few minutes</Text>
    </PureModalContent>
  );
};

ModalSwitchingAccount.propTypes = {};

export default React.memo(ModalSwitchingAccount);

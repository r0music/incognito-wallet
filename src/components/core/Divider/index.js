import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import { COLORS } from '@src/styles';

const styled = StyleSheet.create({
  divider: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.colorGrey4,
  },
});

const DividerComponent = ({ dividerStyled = null }) => {
  return <Divider style={[styled.divider, dividerStyled]} />;
};

DividerComponent.propTypes = {};

export default React.memo(DividerComponent);

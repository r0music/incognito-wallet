import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme';

const styled = StyleSheet.create({
  divider: {
    flex: 1,
    height: 1,
  },
});

const DividerComponent = ({ dividerStyled = null }) => {
  const colors = useSelector(colorsSelector);
  return (
    <View
      style={[
        styled.divider,
        { backgroundColor: colors.grey8 },
        dividerStyled,
      ]}
    />
  );
};

DividerComponent.propTypes = {};

export default React.memo(DividerComponent);

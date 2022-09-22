import { Text, View, TouchableOpacity } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { IconArrowDown } from '@src/components/Icons';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },

  tokenViewArea: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },

  labelText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 8,
  },
});

const TokenView = (props) => {
  const { tokenName = 'Incognito' } = props;
  return (
    <TouchableOpacity
      style={styled.container}
      onPress={() => {
        console.log('TokenView CLICKED! TO DO');
      }}
    >
      <View style={styled.tokenViewArea}>
        <Text style={styled.labelText}> </Text>
        <Text style={styled.labelText}>{tokenName}</Text>
      </View>

      <IconArrowDown />
    </TouchableOpacity>
  );
};

TokenView.defaultProps = {
  tokenName: PropTypes.string.isRequired,
};

TokenView.propTypes = {};

export default TokenView;

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

  labelText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 8,
  },
});

const NetworkView = (props) => {
  const { networtName, isIncognitoNetwork } = props;
  return (
    <TouchableOpacity
      style={styled.container}
      onPress={() => {
        console.log('NetworkView CLICKED! TO DO');
      }}
    >
      <Text style={styled.labelText}>{networtName}</Text>
      {isIncognitoNetwork ? null : <IconArrowDown />}
    </TouchableOpacity>
  );
};

NetworkView.defaultProps = {
  networtName: PropTypes.string.isRequired,
  isIncognitoNetwork: PropTypes.bool,
};

NetworkView.propTypes = {
  networtName: 'Incognito',
  isIncognitoNetwork: true,
};

export default NetworkView;

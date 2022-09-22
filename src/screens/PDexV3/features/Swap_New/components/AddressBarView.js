import { Text, TouchableOpacity, View } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import React from 'react';
// import PropTypes from 'prop-types';
import { IconCloseSVG } from '@src/components/Icons';
import { StyleSheet, TextInput } from 'react-native';

const styled = StyleSheet.create({
  container: {
    marginTop: 24,
    flexDirection: 'column',
  },

  labelText: {
    color: COLORS.lightGrey36,
    fontWeight: '400',
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 8,
  },

  textInputContainer: {
    padding: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: COLORS.black3,
    borderWidth: 1,
    borderColor: COLORS.lightGrey38,
    height: 60,
  },
  textInput: {
    color: 'white',
  },

  clearBtnContainer: {
    padding: 5,
  },
});

const AddressBarView = (props) => {
  const { ...rest } = props;
  return (
    <View style={styled.container}>
      <Text style={styled.labelText}>Address: </Text>
      <View style={styled.textInputContainer}>
        <TextInput
          placeholder="Search for a privacy coin"
          placeholderTextColor={COLORS.white}
          style={styled.textInput}
          selectionColor={COLORS.white}
          value="0xea674fd34s7...cid837998malsd"
          onChangeText={() => {}}
        />
        <TouchableOpacity
          style={styled.clearBtnContainer}
          onPress={() => {
            console.log('Clear Address, TO DO ');
          }}
        >
          <IconCloseSVG />
        </TouchableOpacity>
      </View>
    </View>
  );
};

AddressBarView.defaultProps = {};

AddressBarView.propTypes = {};

export default AddressBarView;

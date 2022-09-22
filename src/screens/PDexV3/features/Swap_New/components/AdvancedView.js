import { Text, TouchableOpacity, View } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { ChevronIcon } from '@src/components/Icons';
import { StyleSheet } from 'react-native';

const styled = StyleSheet.create({
  container: {
    marginTop: 24,
    flexDirection: 'column',
  },

  advancedText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 8,
  },

  labelText: {
    color: COLORS.lightGrey36,
    fontWeight: '400',
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 8,
  },

  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },

  contentView: {
    marginVertical: 12,
    flex: 1,
  },

  feeView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  balanceView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  valueText: {
    color: COLORS.white,
    fontWeight: '400',
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 8,
  },
});

const AdvancedView = (props) => {
  const { ...rest } = props;

  const [toggle, setToggle] = useState(false);

  return (
    <View style={styled.container}>
      <TouchableOpacity
        style={styled.headerView}
        onPress={() => {
          console.log('TO DO 1');
          setToggle(!toggle);
        }}
      >
        <Text style={styled.advancedText}>Advanced: </Text>
        <ChevronIcon toggle={toggle} />
      </TouchableOpacity>
      {toggle && (
        <View style={styled.contentView}>
          <View style={styled.feeView}>
            <Text style={styled.labelText}>Fee: </Text>
            <Text style={styled.valueText}>0,0000001 PRV</Text>
          </View>
          <View style={styled.balanceView}>
            <Text style={styled.labelText}>Balance: </Text>
            <Text style={styled.valueText}>1 BTC</Text>
          </View>
        </View>
      )}
    </View>
  );
};

AdvancedView.defaultProps = {};

AdvancedView.propTypes = {};

export default AdvancedView;

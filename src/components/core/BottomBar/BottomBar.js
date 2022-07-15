import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from '@src/components/core';
import { Icon } from 'react-native-elements';
import { COLORS, FONT } from '@src/styles';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'relative',
  },
  text: {
    color: COLORS.white,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 3,
    fontFamily: FONT.NAME.medium,
    marginRight: 8,
  },
});

const BottomBar = (props) => {
  const { onPress, text } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styled.container}>
        <Text style={styled.text}>{text}</Text>
        <Icon name="chevron-right" color={COLORS.white} />
      </View>
    </TouchableOpacity>
  );
};

BottomBar.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default React.memo(BottomBar);

import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { View, Text } from '@src/components/core';
import PropTypes from 'prop-types';
import { useNavigation } from 'react-navigation-hooks';
import { FONT, COLORS } from '@src/styles';
import { IconSearchNew } from '@src/components/Icons';

const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 55,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGrey38,
    backgroundColor: COLORS.black3,
  },

  textInputContainer: {
    flex: 1,
    marginRight: 8,
    color: COLORS.white,
  },
});

const SelectATokenSearchBar = (props) => {
  const navigation = useNavigation();
  const { keySearchChange = () => {} } = props;
  const [keySearch, setKeySearch] = useState('');
  const onChange = (e) => {
    setKeySearch(e.target.value);
    keySearchChange && keySearchChange(e.target.value);
  };
  return (
    <View style={styled.container}>
      <TextInput
        placeholder="Search token"
        placeholderTextColor={COLORS.gray2}
        style={styled.textInputContainer}
        selectionColor={COLORS.white}
        onChangeText={onChange}
      />
      <IconSearchNew />
    </View>
  );
};

SelectATokenSearchBar.propTypes = {
  keySearchChange: PropTypes.element,
};
SelectATokenSearchBar.defaultProps = {};

export default SelectATokenSearchBar;

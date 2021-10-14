import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CheckedIcon } from '@src/components/Icons';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  btnStyle: {},
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

const BtnBack = (props) => {
  const { btnStyle, checked, hook, ...rest } = props;
  return (
    <TouchableOpacity style={[styled.btnStyle, btnStyle]} {...rest}>
      <View style={styled.row}>
        <CheckedIcon checked={checked} />
        {hook}
      </View>
    </TouchableOpacity>
  );
};

BtnBack.defaultProps = {
  btnStyle: null,
  hook: null,
};

BtnBack.propTypes = {
  btnStyle: PropTypes.any,
  checked: PropTypes.bool.isRequired,
  hook: PropTypes.element,
};

export default BtnBack;

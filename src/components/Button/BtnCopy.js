import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { CopyIcon } from '@src/components/Icons';

const BtnCopy = (props: TouchableOpacityProps) => {
  const { containerStyle, iconStyle, ...rest } = props;
  return (
    <TouchableOpacity {...rest}>
      <CopyIcon containerStyle={containerStyle} style={iconStyle} />
    </TouchableOpacity>
  );
};

export default BtnCopy;

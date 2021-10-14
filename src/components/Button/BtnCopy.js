import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { CopyIcon } from '@src/components/Icons';

const BtnCopy = (props: TouchableOpacityProps) => {
  const { ...rest } = props;
  return (
    <TouchableOpacity {...rest}>
      <CopyIcon />
    </TouchableOpacity>
  );
};

export default BtnCopy;

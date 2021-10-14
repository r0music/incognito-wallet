import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { StarIcon } from '@src/components/Icons';

const BtnStar = (props: TouchableOpacityProps) => {
  const { isBlue, ...rest } = props;
  return (
    <TouchableOpacity {...rest}>
      <StarIcon isBlue={isBlue} />
    </TouchableOpacity>
  );
};

export default BtnStar;

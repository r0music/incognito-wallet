import React from 'react';
import { Text as RNComponent, TextProps } from 'react-native';
import styleSheet from './style';

const Text = ({ style, ...props }: TextProps) => (
  <RNComponent
    allowFontScaling={false}
    {...props}
    style={[styleSheet.root, style]}
  />
);

export default Text;

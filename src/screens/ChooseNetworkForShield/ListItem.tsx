import { Text, TouchableOpacity } from '@src/components/core';
import { CheckIcon, SquareIcon } from '@src/components/Icons';
import { COLORS } from '@src/styles';
import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';

export type ListItemProps = {
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  content?: string;
  disabled?: boolean;
};

export const ListItem: React.FC<ListItemProps> = ({
  selected,
  content,
  onPress,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[containerStyle, style]}
    >
      {selected ? <CheckIcon /> : <SquareIcon />}
      <Text style={networkNameStyle}>{content}</Text>
    </TouchableOpacity>
  );
};

const containerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.gray1,
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingVertical: 13,
  marginTop: 8,
};

const networkNameStyle: TextStyle = {
  fontSize: 16,
  fontWeight: '500',
  marginLeft: 12,
};

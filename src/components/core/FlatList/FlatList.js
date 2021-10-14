import React from 'react';
import { FlatList, FlatListProps } from 'react-native';

export default (props: FlatListProps) => (
  <FlatList
    {...props}
    showsVerticalScrollIndicator={props?.showsVerticalScrollIndicator || false}
  />
);

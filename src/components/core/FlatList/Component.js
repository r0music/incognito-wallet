import React from 'react';
import { FlatList, FlatListProps } from 'react-native';

const FlatListComponent = (props: FlatListProps) => {
  return <FlatList showsVerticalScrollIndicator={false} {...props} />;
};

export default FlatListComponent;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withLayout_2 } from '@src/components/Layout';

const styled = StyleSheet.create({
  container: {},
});

const Template = (props) => {
  return <View style={styled.container} />;
};

Template.propTypes = {};

export default withLayout_2(React.memo(Template));

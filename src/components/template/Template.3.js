import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {},
});

const Template = (props) => {
  return <View style={styled.container} />;
};

Template.propTypes = {};

export default React.memo(Template);

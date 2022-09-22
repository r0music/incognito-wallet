import { View } from '@src/components/core';
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    // height: 200,
    backgroundColor: 'yellow',
  },
  headerContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: 'blue',
  },
});

const FormContainer = (props) => {
  const { headerForm, bodyForm } = props;
  return (
    <View style={styled.container}>
      {headerForm && <View style={styled.headerContainer}>{headerForm}</View>}
      {bodyForm && <View style={styled.bodyContainer}>{bodyForm}</View>}
    </View>
  );
};

FormContainer.propTypes = {
  headerForm: PropTypes.element,
  bodyForm: PropTypes.element,
};
FormContainer.defaultProps = {
  headerForm: null,
  bodyForm: null,
};

export default FormContainer;

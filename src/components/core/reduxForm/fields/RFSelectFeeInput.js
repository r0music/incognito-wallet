import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { SelectFeeInput } from '@src/components/core/SelectFee';
import createField from './createField';

const styled = StyleSheet.create({});

const renderCustomField = (props) => {
  const { input, ...rest } = props;
  const { onChange, ...restInput } = input;
  return (
    <SelectFeeInput
      {...{ ...rest, ...restInput, onChangeText: (text) => onChange(text) }}
    />
  );
};

const RFSelectFeeInput = createField({
  fieldName: 'RFSelectFeeInput',
  render: renderCustomField,
});

renderCustomField.defaultProps = {};

renderCustomField.propTypes = {};

export default React.memo(RFSelectFeeInput);

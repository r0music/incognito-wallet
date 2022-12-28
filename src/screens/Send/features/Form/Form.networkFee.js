import { Text } from '@components/core';
import { InputField } from '@components/core/reduxForm';
import React, { useEffect } from 'react';
import { Field } from 'redux-form';

import { FONT, COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {
  feeDataSelector,
  validatePRVNetworkFee,
} from '@src/components/EstimateFee/EstimateFee.selector';
// import { getPrivacyPRVInfo } from '@src/redux/selectors/selectedPrivacy';
import { MESSAGES } from '@src/constants';

export const styled = StyleSheet.create({
  symbol: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
  },

  errorText: {
    color: COLORS.red,
    fontSize: 14,
    marginTop: 15,
  },
});

const NetworkFee = ({ onChangeField }) => {
  const feeData = useSelector(feeDataSelector);
  const valid = useSelector(validatePRVNetworkFee);

  const { isUsedPRVFee, feePrvText } = feeData;

  useEffect(() => {
    onChangeField && onChangeField(feePrvText, 'networkFee');
  }, [onChangeField, isUsedPRVFee, feePrvText]);

  if (isUsedPRVFee || valid) return null;

  return (
    <>
      <Field
        component={InputField}
        name="networkFee"
        label="Network Fee"
        prependView={<Text style={styled.symbol}>PRV</Text>}
        componentProps={{
          editable: false,
        }}
      />
      <Text style={styled.errorText}>{MESSAGES.PRV_NOT_ENOUGHT}</Text>
    </>
  );
};
export default NetworkFee;

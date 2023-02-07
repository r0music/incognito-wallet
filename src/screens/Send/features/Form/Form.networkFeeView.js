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
import {
  selectedPrivacySelector,
} from '@src/redux/selectors';
import { getPrivacyPRVInfo } from '@src/redux/selectors/selectedPrivacy';
import { MESSAGES } from '@src/constants';
import { useFaucet } from '@src/components/Modal/features/FaucetPRVModal';

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

const NetworkFeeView = ({ onChangeField }) => {
  const feeData = useSelector(feeDataSelector);
  const { feePerTxToHumanStr } = useSelector(getPrivacyPRVInfo);
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const [navigateFaucet] = useFaucet();
  const { isMainCrypto, isCentralized } = selectedPrivacy;
  const valid = useSelector(validatePRVNetworkFee);
  const { isUsedPRVFee, feePrvText, screen } = feeData;

  useEffect(() => {
    onChangeField && onChangeField(feePrvText || feePerTxToHumanStr, 'networkFee');
  }, [onChangeField, isUsedPRVFee, feePrvText, feePerTxToHumanStr]);

  // Token = PRV
  if (isMainCrypto) {
    return null;
  }
  
  // if (valid && !isCentralized) return null;
  if (screen === 'Send') return null;

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
      {!valid && (
      <Text style={styled.errorText}>
        {MESSAGES.PRV_NOT_ENOUGHT}
        <Text
          style={[styled.errorText, {textDecorationLine: 'underline'} ]}
          onPress={() => {
            navigateFaucet();
          }}
        >
        Faucet.
        </Text>
      </Text>
) }
    </>
  );
};
export default NetworkFeeView;

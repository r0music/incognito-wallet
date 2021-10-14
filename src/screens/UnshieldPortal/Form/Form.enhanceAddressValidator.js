/* eslint-disable import/no-cycle */
import React from 'react';
import { useSelector } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { validator } from '@src/components/core/reduxForm';
import { CONSTANT_COMMONS } from '@src/constants';
import accountService from '@src/services/wallet/accountService';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { formName } from './Form.enhanceInit';

export const enhanceAddressValidation = (WrappedComp) => (props) => {
  const selector = formValueSelector(formName);
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const {
    externalSymbol,
    isMainCrypto,
  } = selectedPrivacy;
  const toAddress = useSelector((state) => selector(state, 'toAddress'));
  const isIncognitoAddress =
    accountService.checkPaymentAddress(toAddress) || isMainCrypto;
  const isExternalAddress =
    !isIncognitoAddress && selectedPrivacy?.isWithdrawable;
  const getExternalAddressValidator = () => {
    if (externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.BTC) {
      return validator.combinedBTCAddress;
    }
    return validator.combinedUnknownAddress;
  };

  const getAddressValidator = () => {
    if (isExternalAddress) {
      return getExternalAddressValidator();
    }
    return validator.combinedIncognitoAddress;
  };

  const getWarningAddress = () => {
    if (isExternalAddress) {
      return 'You are exiting Incognito and going public.';
    }
  };

  const validateAddress = getAddressValidator();

  const warningAddress = getWarningAddress();

  return (
    <WrappedComp
      {...{
        ...props,
        validateAddress,
        warningAddress,
        isIncognitoAddress,
        isExternalAddress,
      }}
    />
  );
};

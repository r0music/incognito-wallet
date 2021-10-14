/* eslint-disable import/no-cycle */
import React from 'react';
import { View, Text, Clipboard } from 'react-native';
import { ClockWiseIcon } from '@src/components/Icons';
import { ButtonBasic } from '@src/components/Button';
import {
  selectedPrivacySelector,
  sharedSelector,
} from '@src/redux/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { change, focus, formValueSelector } from 'redux-form';
import { LoadingContainer } from '@src/components/core';
import convert from '@src/utils/convert';
import { actionLogEvent } from '@screens/Performance';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { MAX_FEE_PER_TX } from '@src/components/EstimateFee/EstimateFee.utils';
import { defaultAccountSelector } from '@src/redux/selectors/account';
import { getDefaultAccountWalletSelector } from '@src/redux/selectors/shared';
import { removeAllSpace, standardizedAddress } from './Form.utils';
import { styledForm as styled } from './Form.styled';

export const formName = 'formUnshieldPortal';

const INIT_STATUS = {
  INITIALIZING: 0,
  SUCCESS: 1,
  FAILED: 2,
};

export const enhanceInit = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const { navigation } = props;
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const gettingBalance = useSelector(sharedSelector.isGettingBalance);
  const isGettingBalance = gettingBalance.includes(selectedPrivacy?.tokenId);
  const account = useSelector(defaultAccountSelector);
  const selector = formValueSelector(formName);
  const amount = useSelector((state) => selector(state, 'amount'));
  const toAddress = useSelector((state) => selector(state, 'toAddress'));

  const accountWallet = useSelector(getDefaultAccountWalletSelector);
  const { pDecimals } = selectedPrivacy;
  // const { amount } = props;

  const handleStandardizedAddress = React.useCallback(async (value) => {
    let _value = value;
    try {
      const copiedValue = await Clipboard.getString();
      if (copiedValue !== '') {
        const isPasted = value.includes(copiedValue);
        if (isPasted) {
          _value = standardizedAddress(value);
        }
      }
    } catch (e) {
      console.debug('error', e);
    }
    return removeAllSpace(_value);
  }, [standardizedAddress]);

  const onChangeField = React.useCallback(async (value, field) => {
    let _value = value;
    if (field === 'toAddress') {
      _value = await handleStandardizedAddress(value);
    }

    dispatch(change(formName, field, String(_value)));
    dispatch(focus(formName, field));
  }, [formName, handleStandardizedAddress]);

  const [state, setState] = React.useState({
    isPortalToken: true,
    minUnshieldOriginalAmount: 0,     // nano
    maxUnshieldOriginalAmount: 0,     // nano
    minUnshieldAmount: 0, 
    maxUnshieldAmount: 0, 
    avgUnshieldFee: 0,                // nano
    incNetworkFee: MAX_FEE_PER_TX,    // nano
    receivedAmount: 0,
  });
  
  const [initStatus, setInitStatus] = React.useState(INIT_STATUS.INITIALIZING);

  const getPortalData = async () => {
    // get average unshield fee
    let [avgUnshieldFee, minUnshieldOriginalAmount] = await Promise.all([
      accountWallet.handleGetAverageUnshieldFee(),
      accountWallet.handleGetPortalMinUnShieldAmount({ tokenID: selectedPrivacy.tokenId })
    ]);

    avgUnshieldFee = Number.parseInt(avgUnshieldFee);
    minUnshieldOriginalAmount = minUnshieldOriginalAmount < avgUnshieldFee ? avgUnshieldFee : minUnshieldOriginalAmount;
    const maxUnshieldOriginalAmount = selectedPrivacy?.amount;

    const minUnshieldAmount = convert.toHumanAmount(minUnshieldOriginalAmount, selectedPrivacy?.pDecimals);
    const maxUnshieldAmount = convert.toHumanAmount(maxUnshieldOriginalAmount, selectedPrivacy?.pDecimals);

    const newState = {
      ...state,
      minUnshieldOriginalAmount,
      maxUnshieldOriginalAmount,
      minUnshieldAmount,
      maxUnshieldAmount,
      avgUnshieldFee,
    };
    setState(newState);
  };

  const getReceivedAmount = () => {
    const { avgUnshieldFee } = state;
    const amountToNumber = Math.max(convert.toNumber(amount, true), 0);
    const originalAmount = convert.toOriginalAmount(
      amountToNumber,
      pDecimals,
      false,
    );
    const receivedAmount = Math.max(originalAmount - avgUnshieldFee, 0);
    const newState = {
      ...state,
      avgUnshieldFee,
      receivedAmount,
    };

    dispatch(actionLogEvent({ desc: { avgUnshieldFee, amount, amountToNumber, originalAmount, receivedAmount, newState }}));
    setState(newState);
  };

  const restoreDataFromSendForm = () => {
    const { toAddress: fromAddress, amount: fromAmount } = navigation.state?.params || {};
    if (fromAddress) {
      onChangeField(fromAddress, 'toAddress');
    }
    if (fromAmount) {
      setTimeout(() => {
        onChangeField(fromAmount, 'amount');
      }, 50);
    }
  };

  const loadData = React.useCallback(async () => {
    try {
      setInitStatus(INIT_STATUS.INITIALIZING);
      await getPortalData();
      restoreDataFromSendForm();
      setInitStatus(INIT_STATUS.SUCCESS);
    } catch (e) {
      console.log(e);
      setInitStatus(INIT_STATUS.FAILED);
    }
  }, [getPortalData, restoreDataFromSendForm]);

  const DetectUnshieldPortalError = React.memo(({ onRetry }) => {
    return (
      <View style={styled.errorContainer}>
        <ClockWiseIcon />
        <Text style={[styled.errorText, { marginTop: 30 }]}>
          {'We seem to have hit a snag. Simply\ntap to try again.'}
        </Text>
        <ButtonBasic
          btnStyle={styled.btnRetry}
          titleStyle={styled.titleBtnRetry}
          onPress={onRetry}
          title="Try again"
        />
        <Text style={styled.errorText}>
          {'If that doesn’t work,\n please come back in 60 minutes.'}
        </Text>
      </View>
    );
  });

  React.useEffect(() => {
    loadData();
  }, []);

  React.useEffect(() => {
    if (initStatus === INIT_STATUS.SUCCESS && amount) {
      dispatch(actionLogEvent({ desc: { msg: 'Calling getReceivedAmount', initStatus, amount }}));
      getReceivedAmount();
    } else {
      dispatch(actionLogEvent({ desc: { msg: 'Not Calling getReceivedAmount', initStatus, amount }}));
    }
  }, [amount, initStatus]);

  if (!selectedPrivacy || isGettingBalance || initStatus == INIT_STATUS.INITIALIZING) {
    return <LoadingContainer />;
  }

  if (initStatus == INIT_STATUS.FAILED) {
    return <DetectUnshieldPortalError onRetry={getPortalData} />;
  }

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          balancePRV: account?.value,
          onChangeField,
          handleStandardizedAddress,
          amount,
          toAddress,
          portalData: state,
        }}
      />
    </ErrorBoundary>
  );
};

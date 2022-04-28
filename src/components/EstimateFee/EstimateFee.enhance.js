/* eslint-disable import/no-cycle */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from 'redux-form';
import debounce from 'lodash/debounce';
import { useFocusEffect } from 'react-navigation-hooks';
import PropTypes from 'prop-types';
import { ExHandler } from '@src/services/exception';
import {
  isFetchingNetworksSelector,
} from '@src/components/EstimateFee/EstimateFee.selector';
import {
  selectedPrivacySelector,
  childSelectedPrivacySelector,
} from '@src/redux/selectors';
import {
  actionFetchFee,
  actionGetNetworkSupports,
} from './EstimateFee.actions';
import { useKeyboard } from '../UseEffect/useKeyboard';

const enhance = (WrappedComp) => (props) => {
  const {
    amount,
    address,
    memo,
    isExternalAddress,
    isIncognitoAddress,
    isPortalToken,
  } = props;
  const dispatch = useDispatch();
  const [isKeyboardVisible] = useKeyboard();
  const isFetchingNetworks = useSelector(isFetchingNetworksSelector);

  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const childSelectedPrivacy = useSelector(
    childSelectedPrivacySelector.childSelectedPrivacy,
  );

  const handleChangeForm = async (
    address,
    amount,
    memo,
    childSelectedPrivacy,
  ) => {
    try {
      if(selectedPrivacy?.isPUnifiedToken && amount) {
        await dispatch(
          actionGetNetworkSupports({
            amount,
            childSelectedPrivacy,
          }),
        );
      }
        
      if (!amount || !address || !childSelectedPrivacy || isFetchingNetworks) {
        return;
      }
      let screen = 'Send';
      if (childSelectedPrivacy?.networkId !== 'INCOGNITO') {
        screen = 'UnShield';
      } else {
        screen = 'Send';
      }
      if (isPortalToken && screen === 'UnShield') {
        return;
      }

      await dispatch(
        actionFetchFee({
          amount,
          address,
          screen,
          memo,
          childSelectedPrivacy,
        }),
      );
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const _handleChangeForm = React.useRef(debounce(handleChangeForm, 1500));
  React.useEffect(() => {
    _handleChangeForm.current(
      address,
      amount,
      memo,
      isExternalAddress,
      isIncognitoAddress,
      childSelectedPrivacy,
    );
  }, [
    address,
    amount,
    memo,
    isExternalAddress,
    isIncognitoAddress,
    childSelectedPrivacy,
  ]);
  React.useEffect(() => {
    if (!isKeyboardVisible && _handleChangeForm && _handleChangeForm.current) {
      _handleChangeForm.current(
        address,
        amount,
        memo,
        isExternalAddress,
        isIncognitoAddress,
        childSelectedPrivacy,
      );
    }
  }, [isKeyboardVisible]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(reset('changeFee'));
    }, []),
  );

  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props }} />
    </ErrorBoundary>
  );
};

enhance.defaultProps = {
  memo: '',
};

enhance.propTypes = {
  amount: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  memo: PropTypes.string,
  isExternalAddress: PropTypes.bool.isRequired,
  isIncognitoAddress: PropTypes.bool.isRequired,
};

export default enhance;

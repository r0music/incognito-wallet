import { currentScreenSelector } from '@screens/Navigation';
import ErrorBoundary from '@src/components/ErrorBoundary';
import React, { useEffect } from 'react';
import { useIsFocused } from 'react-navigation-hooks';
import { batch, useDispatch, useSelector } from 'react-redux';

import { reset } from 'redux-form';
import { actionInitSwapForm, actionReset } from './Swap.actions';

import { formConfigs, SWAP_DEFAULT_FAIR } from './Swap.constant';

const SCREENS_RESET = ['Market', 'HomeLP', 'Assets', 'PrivacyApps', 'More'];

const enhanceNavigation = (WrappedComp) => (props) => {
  const dispatch = useDispatch();

  const isFocused = useIsFocused();
  const currentScreen = useSelector(currentScreenSelector);

  useEffect(() => {
    // console.log('1 isFocused ', isFocused);
    // console.log('2 currentScreen ', currentScreen);
    if (!isFocused && SCREENS_RESET.includes(currentScreen)) {
      console.log('RESET ====>>> ');
      setTimeout(() => {
        batch(() => {
          dispatch(actionReset());
          dispatch(
            actionInitSwapForm({
              refresh: false,
              defaultPair: SWAP_DEFAULT_FAIR.INCOGNITO,
              shouldFetchHistory: false,
            }),
          );
          dispatch(reset(formConfigs.formName));
        });
      }, 100);
    }
  }, [isFocused, currentScreen]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceNavigation;

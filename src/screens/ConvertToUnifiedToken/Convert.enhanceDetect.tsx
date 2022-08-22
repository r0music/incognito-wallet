import { BottomBar } from '@components/core';
import routeNames from '@routers/routeNames';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { switchAccountSelector } from '@src/redux/selectors/account';
import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { useSelector } from 'react-redux';
import { checkConvertSelector } from './state/selectors';

const enhance = (WrappedComp) => (props) => {
  const navigation = useNavigation();

  const isConvert = useSelector(checkConvertSelector);
  const switchingAccount = useSelector(switchAccountSelector);

  const navigateConvert = () => {
    navigation.navigate(routeNames.ConvertToUnifiedToken);
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
      {isConvert && !switchingAccount && (
        <BottomBar
          onPress={navigateConvert}
          text="Unify your coins to enhance your cross-chain trading experience"
          autoscroll
        />
      )}
    </ErrorBoundary>
  );
};

export default enhance;

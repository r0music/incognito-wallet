import React from 'react';
import routeNames from '@src/router/routeNames';
import walletValidator from 'wallet-address-validator';

export const enhanceSwitchPortal = (WrappedComp) => (props) => {
  const { isExternalAddress, navigation, toAddress, amount, isPortalToken } = props;

  const switchToPortal = () => {
    navigation.replace(routeNames.UnshieldPortal, {
      toAddress, amount
    });
  };

  React.useEffect(() => {
    const isValidAddress = toAddress && walletValidator.validate(toAddress, 'BTC', 'both');
    if (isExternalAddress && isPortalToken && isValidAddress) {
      switchToPortal();
    }
  }, [isExternalAddress, isPortalToken, toAddress, amount]);

  return <WrappedComp {...props} />;
};

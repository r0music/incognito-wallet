import React from 'react';
import routeNames from '@src/router/routeNames';

export const enhanceSwitchSend = (WrappedComp) => (props) => {
  const { isIncognitoAddress, navigation, toAddress, amount } = props;

  const switchToSend = () => {
    navigation.replace(routeNames.Send, {
      toAddress, amount
    });
  };

  React.useEffect(() => {
    if (isIncognitoAddress) {
      switchToSend();
    }
  }, [isIncognitoAddress]);

  return <WrappedComp {...props} />;
};

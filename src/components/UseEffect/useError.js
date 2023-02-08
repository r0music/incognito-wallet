import React from 'react';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import {CONSTANT_CONFIGS, MESSAGES as MESSAGES_GLOBAL} from '@src/constants';
import {useSelector} from 'react-redux';
import {accountSelector} from '@src/redux/selectors';
import {Text} from '@components/core';
import styles from '@screens/DexV2/components/TradeConfirm/style';
import {MESSAGES} from '@screens/Dex/constants';

export const useError = (errorMessage) => {
  const navigation = useNavigation();
  const account = useSelector(accountSelector.defaultAccount);
  const navigateFaucet = () => navigation.navigate(routeNames.WebView, {
    url: CONSTANT_CONFIGS.FAUCET_URL + `address=${account.paymentAddress}`
  });

  return React.useMemo(() => {
    errorMessage = errorMessage || '';
    if (typeof errorMessage === 'string' && (errorMessage.includes('Faucet') && errorMessage.includes(MESSAGES_GLOBAL.PRV_NOT_ENOUGHT))) {
      return (
        <Text style={styles.error1}>
          {MESSAGES_GLOBAL.PRV_NOT_ENOUGHT} <Text style={[styles.error1, {textDecorationLine: 'underline' }]} onPress={navigateFaucet}>Faucet</Text>
        </Text>
      );
    }
    
    if (typeof errorMessage === 'string' && (errorMessage.includes('Faucet') || errorMessage.includes(MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE))) {
      return (
        <Text style={styles.error}>
          Not enough coin to spend, please get some PRV at <Text style={[styles.error, {textDecorationLine: 'underline' }]} onPress={navigateFaucet}>Faucet</Text> tab in home screen.
        </Text>
      );
    }
    return errorMessage;
  }, [errorMessage]);
};

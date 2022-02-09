import React from 'react';
import { compose } from 'recompose';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { batch, useDispatch } from 'react-redux';
import { login } from '@src/services/auth';
import routeNames from '@src/router/routeNames';
import { ExHandler } from '@src/services/exception';
import serverService from '@src/services/wallet/Server';
import { useFocusEffect, useNavigation } from 'react-navigation-hooks';
import { actionFetch as actionFetchProfile } from '@screens/Profile';
import withPin from '@components/pin.enhance';
import KeepAwake from 'react-native-keep-awake';
import { getInternalTokenList, getPTokenList } from '@src/redux/actions/token';
import {
  actionLoadDefaultWallet,
  loadAllMasterKeyAccounts,
} from '@src/redux/actions/masterKey';
import { getBanners } from '@src/redux/actions/settings';
import { actionFetchPairs } from '@screens/PDexV3/features/Swap';
import { actionFetchListPools } from '@screens/PDexV3/features/Pools';
import { requestUpdateMetrics } from '@src/redux/actions/app';
import { ANALYTICS } from '@src/constants';
import { actionFetch as actionFetchHomeConfigs } from '@screens/Home/Home.actions';
import { actionCheckUnreadNews } from '@screens/News';
import withDetectStatusNetwork from './GetStarted.enhanceNetwork';
import withWizard from './GetStarted.enhanceWizard';
import withWelcome from './GetStarted.enhanceWelcome';

const enhance = (WrappedComp) => (props) => {
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setError] = React.useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const getErrorMsg = (error) => {
    const errorMessage = new ExHandler(
      error,
      'Something\'s not quite right. Please make sure you\'re connected to the internet.\n' +
        '\n' +
        'If your connection is strong but the app still won\'t load, please contact us at go@incognito.org.\n',
    )?.writeLog()?.message;
    return errorMessage;
  };

  const getHomeConfiguration = async () => {
    try {
      await new Promise.all([
        dispatch(actionFetchHomeConfigs()),
        dispatch(actionCheckUnreadNews()),
      ]);
    } catch (error) {
      console.log('Fetching configuration for home failed.', error);
    }
  };

  const configsApp = async () => {
    console.time('CONFIGS_APP');
    let hasError;
    await setLoading(true);
    try {
      login();
      batch(() => {
        dispatch(actionFetchProfile());
        dispatch(getBanners());
        dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.OPEN_APP));
      });
      await Promise.all([
        dispatch(getPTokenList()),
        dispatch(getInternalTokenList()),
        dispatch(actionFetchListPools()),
        dispatch(actionFetchPairs(true)),
      ]);
      const servers = await serverService.get();
      if (!servers || servers?.length === 0) {
        await serverService.setDefaultList();
      }
      await dispatch(actionLoadDefaultWallet());
      dispatch(loadAllMasterKeyAccounts());
    } catch (error) {
      hasError = !!error;
      await setError(getErrorMsg(error));
      throw error;
    }
    await setLoading(false);
    console.timeEnd('CONFIGS_APP');
    if (!hasError) {
      navigation.navigate(routeNames.MainTabBar);
    }
  };

  const onRetry = async () => {
    try {
      await configsApp();
    } catch {
      //
    }
  };

  React.useEffect(() => {
    onRetry();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getHomeConfiguration();
    }, []),
  );

  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, errorMsg, loading, onRetry }} />
      <KeepAwake />
    </ErrorBoundary>
  );
};

export default compose(
  withDetectStatusNetwork,
  withWizard,
  withPin,
  withWelcome,
  enhance,
);

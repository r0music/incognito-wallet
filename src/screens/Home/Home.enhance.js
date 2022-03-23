import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { withNavigation } from 'react-navigation';
import { ExHandler } from '@src/services/exception';
// import withFCM from '@src/screens/Notification/Notification.withFCM';
import { useSelector, useDispatch } from 'react-redux';
import { BackHandler } from 'react-native';
import AppUpdater from '@components/AppUpdater';
import { useBackHandler } from '@src/components/UseEffect';
import { withNews, actionCheckUnreadNews } from '@screens/News';
import { homeSelector } from './Home.selector';
import { actionFetch as actionFetchHomeConfigs } from './Home.actions';

const enhance = (WrappedComp) => (props) => {
  const { categories, headerTitle, isFetching } = useSelector(homeSelector);
  const dispatch = useDispatch();
  const getHomeConfiguration = async () => {
    try {
      dispatch(actionFetchHomeConfigs());
      dispatch(actionCheckUnreadNews());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const handleGoBack = () => BackHandler.exitApp();
  useBackHandler({ handleGoBack });
  React.useEffect(() => {
    getHomeConfiguration();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          homeProps: {
            headerTitle,
            getHomeConfiguration,
            isFetching,
            categories,
          },
        }}
      />
      <AppUpdater />
    </ErrorBoundary>
  );
};

export default compose(
  withNavigation,
  withNews,
  enhance,
);

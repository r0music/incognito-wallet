import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { ExHandler } from '@src/services/exception';
import { compose } from 'recompose';
import { useDispatch, useSelector } from 'react-redux';
import { getPTokenList } from '@src/redux/actions/token';
import withFCM from '@screens/Notification/Notification.withFCM';
import Modal from '@src/components/Modal';
import AppUpdater from '@src/components/AppUpdater';
import { homeSelector } from '@screens/Home/Home.selector';
import { isIOS } from '@utils/platform';
import { Linking } from 'react-native';
import DialogUpdateApp from '@screens/Home/features/DialogUpdateApp';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const { outdatedVersion, Link: link } = useSelector(homeSelector)?.appVersion;
  const refFirstTime = React.useRef(true);
  console.log('outdatedVersion::: ', outdatedVersion);
  const onUpdateApp = async () => {
    try {
      const APP_STORE_LINK =
        'itms-apps://apps.apple.com/us/app/apple-store/id1475631606?mt=8';
      const PLAY_STORE_LINK = 'market://details?id=com.incognito.wallet';
      const url = isIOS() ? APP_STORE_LINK : PLAY_STORE_LINK;

      const canOpenURL = await Linking.canOpenURL(url);
      if (canOpenURL) {
        Linking.openURL(url);
      } else {
        throw new Error();
      }
    } catch (error) {
      Linking.openURL(link);
    }
  };
  const fetchData = async () => {
    try {
      if (refFirstTime && refFirstTime.current) {
        refFirstTime.current = false;
        return;
      }
      dispatch(getPTokenList());
      // dispatch(getInternalTokenList());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
      <Modal />
      <AppUpdater />
      <DialogUpdateApp visible={outdatedVersion} onPress={onUpdateApp} />
    </ErrorBoundary>
  );
};

export default compose(withFCM, enhance);

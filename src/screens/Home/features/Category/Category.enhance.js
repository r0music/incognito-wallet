import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { BIG_COINS } from '@screens/Dex/constants';
import { CONSTANT_CONFIGS, CONSTANT_EVENTS } from '@src/constants';
import { logEvent } from '@services/firebase';
import { useNavigation } from 'react-navigation-hooks';
import LinkingService from '@src/services/linking';
import AppUpdater from '@components/AppUpdater/index';
import { isIOS } from '@utils/platform';
import deviceInfo from 'react-native-device-info';
import { Dimensions, PixelRatio, Platform } from 'react-native';
import { handleCameraPermission } from '@src/utils/PermissionUtil';
import { ExHandler } from '@services/exception';
import routeNames from '@routers/routeNames';
import {useSelector} from 'react-redux';
import {accountSelector} from '@src/redux/selectors';

const sendFeedback = async () => {
  const buildVersion = AppUpdater.appVersion;
  const { width, height } = Dimensions.get('window');
  const deviceInfomation = `${await deviceInfo.getModel()}, OS version ${
    Platform.Version
  }, screen size: ${PixelRatio.getPixelSizeForLayoutSize(
    height,
  )}x${PixelRatio.getPixelSizeForLayoutSize(width)}`;
  const title = `Incognito wallet ${buildVersion} ${
    isIOS() ? 'iOS' : 'Android'
  } ${deviceInfomation} feedback`;
  const email = 'go@incognito.org';
  let content =
    'Please include as much detail as possible. Thanks for your time!';

  LinkingService.openUrl(`mailto:${email}?subject=${title}&body=${content}`);
};

const enhance = (WrappedComp) => (props) => {
  const navigation = useNavigation();
  const account = useSelector(accountSelector.defaultAccount);
  const goToScreen = (route, params, event) => {
    navigation.navigate(route, params);
    if (event) {
      logEvent(event);
    }
  };
  const interactionById = (item) => {
    console.log('item?.route', item.route);
    console.log('item?.key', item?.key);
    switch (item.key) {
    case 'buy_prv':
      goToScreen(
          item?.route || '',
          {
            inputTokenId: BIG_COINS.USDT,
            outputTokenId: BIG_COINS.PRV,
            outputValue: 1750e9,
          },
          CONSTANT_EVENTS.CLICK_HOME_BUY,
      );
      break;
    case 'trade': {
      goToScreen(
        routeNames.Trade,
        { fromTrade: true },
        CONSTANT_EVENTS.CLICK_HOME_TRADE,
      );
      break;
    }
    case 'feedback':
      sendFeedback();
      break;
    case 'explorer':
      goToScreen('pApp', { url: item?.route });
      break;
    case 'hunt':
      /*
         * @hunt can be changed according to the event
         * response API
         * */
      handleCameraPermission()
        .then((granted) => {
          if (granted) {
            goToScreen('Event', {
              data: CONSTANT_CONFIGS.HOME_CONFIG_EVENT(),
            });
          }
        })
        .catch((error) => {
          new ExHandler(error).showErrorToast();
        });
      break;
    case 'convert_coins_ver1':
      goToScreen(routeNames.ConvertTokenList);
      break;
    case 'faucet_prv':
      goToScreen(routeNames.WebView, {
        url: CONSTANT_CONFIGS.FAUCET_URL + `address=${account.paymentAddress}`
      });
      break;
    case 'invest': {
      goToScreen(routeNames.HomePDexV3);
      break;
    }
    default:
      goToScreen(item?.route || '');
      break;
    }
  };

  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, interactionById }} />
    </ErrorBoundary>
  );
};

export default enhance;

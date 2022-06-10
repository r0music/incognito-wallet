import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import MainNavigator from './AppNavigator';
import ROUTE_NAMES from './routeNames';
import SplashNavigator from './SplashNavigator';

export default createAppContainer(
  createSwitchNavigator(
    {
      [ROUTE_NAMES.RootApp]: MainNavigator,
      [ROUTE_NAMES.RootSplash]: SplashNavigator,
    },
    {
      initialRouteName: ROUTE_NAMES.RootSplash,
    },
  ),
);

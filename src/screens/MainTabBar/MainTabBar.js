import React from 'react';
import More from '@screens/MainTabBar/features/More';
import TabAssets from '@screens/MainTabBar/features/Assets';
import TabTrade from '@screens/MainTabBar/features/Trade';
import TabPrivacyApps from '@screens/MainTabBar/features/PrivacyApps';
import {
  MoreIcon,
  TradeIcon,
  AssetsIcon,
  PrivacyAppsIcon,
  MarketIcon,
  LiquidityIcon,
} from '@components/Icons';
import { Text } from 'react-native';
import Market from '@screens/MainTabBar/features/Market';
import HomeLP from '@screens/MainTabBar/features/HomeLP';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import colors from '@src/styles/colors';
import { styled } from './MainTabBar.styled';

const TabNavigator = createMaterialBottomTabNavigator(
  {
    HomeLP: {
      screen: HomeLP,
      navigationOptions: {
        tabBarIcon: ({ focused }) => <LiquidityIcon active={focused} />,
        tabBarLabel: <Text style={styled.label}>Earn</Text>,
      },
    },
    Market: {
      screen: Market,
      navigationOptions: {
        tabBarIcon: ({ focused }) => <MarketIcon active={focused} />,
        tabBarLabel: <Text style={styled.label}>Markets</Text>,
      },
    },
    Trade: {
      screen: TabTrade,
      navigationOptions: {
        tabBarIcon: ({ focused }) => <TradeIcon active={focused} />,
        tabBarLabel: <Text style={styled.label}>Trade</Text>,
      },
    },
    Assets: {
      screen: TabAssets,
      navigationOptions: {
        tabBarIcon: ({ focused }) => <AssetsIcon active={focused} />,
        tabBarLabel: <Text style={styled.label}>Wallet</Text>,
      },
    },
    PrivacyApps: {
      screen: TabPrivacyApps,
      navigationOptions: {
        tabBarIcon: ({ focused }) => <PrivacyAppsIcon active={focused} />,
        tabBarLabel: <Text style={styled.label}>Apps</Text>,
      },
    },
    More: {
      screen: More,
      navigationOptions: {
        tabBarIcon: ({ focused }) => <MoreIcon active={focused} />,
        tabBarLabel: <Text style={styled.label}>More</Text>,
      },
    },
  },
  {
    shifting: false,
    labeled: true,
    sceneAnimationEnabled: true,
    keyboardHidesNavigationBar: true,
    activeColor: colors.blue5,
    inactiveColor: colors.lightGrey36,
    barStyle: {
      borderTopWidth: 0,
      backgroundColor: '#1A1A1A',
      justifyContent: 'center',
    },
  },
);

export default TabNavigator;

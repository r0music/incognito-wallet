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
  MarketIcon, LiquidityIcon
} from '@components/Icons';
import { View, Text } from 'react-native';
import Market from '@screens/MainTabBar/features/Market';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import styledComp from 'styled-components/native';
import { SafeAreaView } from '@components/core';
import HomeLP from '@screens/MainTabBar/features/HomeLP';
import { styled } from './MainTabBar.styled';

const CustomBottomTabBar = styledComp(BottomTabBar)`
  background-color: ${({ theme }) => theme.background2};
  display: flex;
  align-items: center;
  height: 60px;
`;

const CustomSafeAreaView = styledComp(SafeAreaView)`
  background-color: ${({ theme }) => theme.background2};
`;

const TabBarComponent = (props) => (
  <CustomSafeAreaView>
    <CustomBottomTabBar {...props} />
  </CustomSafeAreaView>
);

const TabNavigator = createBottomTabNavigator(
  {
    Market: {
      screen: Market,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <View style={{ height: 26 }}>
              <MarketIcon active={focused} />
            </View>
            <Text style={[styled.label, { color: tintColor }]}>Markets</Text>
          </View>
        ),
      },
    },
    HomeLP: {
      screen: HomeLP,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <View style={{ height: 26 }}>
              <LiquidityIcon active={focused} />
            </View>
            <Text style={[styled.label, { color: tintColor }]}>Earn</Text>
          </View>
        ),
      },
    },
    Trade: {
      screen: TabTrade,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <View style={{ height: 26 }}>
              <TradeIcon active={focused} />
            </View>
            <Text style={[styled.label, { color: tintColor }]}>Trade</Text>
          </View>
        ),
      },
    },
    Assets: {
      screen: TabAssets,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <View style={{ height: 26 }}>
              <AssetsIcon active={focused} />
            </View>
            <Text style={[styled.label, { color: tintColor }]}>Wallet</Text>
          </View>
        ),
      },
    },
    PrivacyApps: {
      screen: TabPrivacyApps,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <View style={{ height: 26 }}>
              <PrivacyAppsIcon active={focused} />
            </View>
            <Text style={[styled.label, { color: tintColor }]}>Apps</Text>
          </View>
        ),
      },
    },
    More: {
      screen: More,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <View style={{ height: 26 }}>
              <MoreIcon active={focused} />
            </View>
            <Text style={[styled.label, { color: tintColor }]}>More</Text>
          </View>
        ),
      },
    }
  },
  {
    tabBarComponent: (props) => (
      <TabBarComponent {...props} />
    ),
    tabBarOptions: {
      showLabel: false,
      style: {
        borderTopWidth: 0,
      },
      shifting: false,
      labeled: false,
      keyboardHidesTabBar: true,
      safeAreaInset: { bottom: 'never', top: 'never' },
      borderWidth: 0
    }
  },
);

export default TabNavigator;

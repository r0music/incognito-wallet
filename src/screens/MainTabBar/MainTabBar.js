import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { COLORS } from '@src/styles';
import TabHome from '@screens/MainTabBar/features/Home';
import More from '@screens/MainTabBar/features/More';
import TabAssets from '@screens/MainTabBar/features/Assets';
import TabTrade from '@screens/MainTabBar/features/Trade';
import TabHomeLP from '@screens/MainTabBar/features/HomeLP';
import {
  MarketIcon,
  MoreIcon,
  TradeIcon,
  LiquidityIcon,
  AssetsIcon,
} from '@components/Icons';
import { View, Text } from 'react-native';
import { styled } from './MainTabBar.styled';

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Market: {
      screen: TabHome,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <MarketIcon active={focused} />
            <Text style={[styled.label, { color: tintColor }]}>Market</Text>
          </View>
        ),
      },
    },
    Trade: {
      screen: TabTrade,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <View style={{ height: 24 }}>
              <TradeIcon active={focused} />
            </View>
            <Text style={[styled.label, { color: tintColor }]}>Trade</Text>
          </View>
        ),
      },
    },
    Liquidity: {
      screen: TabHomeLP,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <LiquidityIcon active={focused} />
            <Text style={[styled.label, { color: tintColor }]}>Liquidity</Text>
          </View>
        ),
      },
    },
    Assets: {
      screen: TabAssets,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <AssetsIcon active={focused} />
            <Text style={[styled.label, { color: tintColor }]}>Assets</Text>
          </View>
        ),
        activeColor: COLORS.colorBlue,
        inactiveColor: COLORS.lightGrey34,
      },
    },
    More: {
      screen: More,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <MoreIcon active={focused} />
            <Text style={[styled.label, { color: tintColor }]}>More</Text>
          </View>
        ),
      },
    }
  },
  {
    initialRouteName: 'Liquidity',
    activeColor: COLORS.colorBlue,
    inactiveColor: COLORS.lightGrey34,
    barStyle: {
      backgroundColor: COLORS.white,
    },
    shifting: false,
    labeled: false,
  },
);

export default TabNavigator;

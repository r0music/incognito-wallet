import React, { memo } from 'react';
import {RefreshControl, SafeAreaView, ScrollView, View} from 'react-native';
import { homeStyled } from '@screens/MainTabBar/MainTabBar.styled';
import { COLORS } from '@src/styles';
import MainTab from '@screens/MainTabBar/features/Home/Home.tabs';
import NotificationBar from '@screens/MainTabBar/features/Home/Home.notificationBar';
import BigVolume from '@screens/MainTabBar/features/Home/Home.volume';
import withTab from '@screens/MainTabBar/MainTabBar.enhanceTab';
import {compose} from 'recompose';
import {useDispatch, useSelector} from 'react-redux';
import {actionFetchPools, isFetchingSelector} from '@screens/PDexV3/features/Pools';
import AppMaintain from '@components/AppMaintain';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import appConstant from '@src/constants/app';
import Header from './Home.header';
import Banner from './Home.banner';
import Category from './Home.category';
import withHome from './Home.enhance';

const TabHome = () => {
  const isFetching = useSelector(isFetchingSelector);
  const dispatch = useDispatch();
  const [_, isDisabled] = useFeatureConfig(appConstant.DISABLED.HOME);
  if (isDisabled) {
    return  <AppMaintain />;
  }
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <View style={homeStyled.wrapHeader}>
        <Header />
      </View>
      <ScrollView
        style={homeStyled.wrapHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={(
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              dispatch(actionFetchPools());
            }}
          />
        )}
      >
        <Banner />
        <NotificationBar />
        <BigVolume />
        <Category />
        <MainTab />
      </ScrollView>
    </SafeAreaView>
  );
};

export default compose(
  withHome,
  withTab
)(memo(TabHome));

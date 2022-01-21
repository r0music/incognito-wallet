import React, {memo} from 'react';
import Wallet from '@screens/Wallet/features/Home/Wallet';
import withTab from '@screens/MainTabBar/MainTabBar.enhanceTab';
import {compose} from 'recompose';
import { Tabs, View } from '@components/core';
import { ROOT_TAB_ASSETS, TAB_COINS_ID, TAB_LIQUIDITY_ID, TAB_REWARD_ID } from '@screens/MainTabBar/features/Assets/Assets.constants';
import Portfolio from '@screens/PDexV3/features/Portfolio/Portfolio';
import { withLayout_2 } from '@components/Layout';
import { Header, Row } from '@src/components';
import { styled } from '@screens/PDexV3/features/Home/Home.styled';
import ReturnLP from '@screens/PDexV3/features/Share/Share.returnLP';
import { BtnPrimary } from '@components/core/Button';
import globalStyled from '@src/theme/theme.styled';
import withHome from '@screens/PDexV3/features/Home/Home.enhance';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { PoolReward } from '@screens/PDexV3/features/Share';
import PortfolioReward from '@screens/PDexV3/features/Portfolio/Portfolio.reward';
import SelectAccountButton from '@components/SelectAccountButton';

const HeaderPortfolioView = React.memo(() => {
  const navigation = useNavigation();
  const renderContent = () => (
    <View style={globalStyled.defaultPaddingHorizontal}>
      <Row spaceBetween style={styled.headerRow}>
        <ReturnLP />
      </Row>
      <BtnPrimary onPress={() => navigation.navigate(routeNames.PoolsTab)} title="Join a Pool" wrapperStyle={{ marginTop: 24 }} />
    </View>
  );
  return renderContent();
});


const HeaderRewardView = React.memo(() => {
  const renderContent = () => (
    <View style={globalStyled.defaultPaddingHorizontal}>
      <Row spaceBetween style={styled.headerRow}>
        <PoolReward />
      </Row>
    </View>
  );
  return renderContent();
});

const TabAssets = () => {
  return (
    <>
      <Header hideBackButton title="Privacy Coins" accountSelectable />
      <Wallet hideBackButton />
    </>
  );
};

export default compose(
  withLayout_2,
  withTab
)(memo(TabAssets));

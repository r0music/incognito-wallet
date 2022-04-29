import React, { memo } from 'react';
import withTab from '@screens/MainTabBar/MainTabBar.enhanceTab';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';
import { Header } from '@src/components';
import withLazy from '@components/LazyHoc/LazyHoc';
import FollowList from '@screens/Wallet/features/FollowList/FollowList';
import withWallet from '@screens/Wallet/features/Home/Wallet.enhance';

const TabAssets = () => {
  return (
    <>
      <Header hideBackButton title="Privacy Coins" accountSelectable />
      <FollowList />
    </>
  );
};

export default compose(
  withLazy,
  withLayout_2,
  withTab,
  withWallet,
)(memo(TabAssets));

import React, {memo} from 'react';
import Home from '@screens/PDexV3/features/Home';
import withTab from '@screens/MainTabBar/MainTabBar.enhanceTab';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import appConstant from '@src/constants/app';
import AppMaintain from '@components/AppMaintain';
import { compose } from 'redux';
import withLazy from '@components/LazyHoc/LazyHoc';

const TabHomeLP = () => {
  const [_, isDisabled] = useFeatureConfig(appConstant.DISABLED.LIQUIDITY);
  if (isDisabled) {
    return <AppMaintain />;
  }
  return (
    <Home hideBackButton />
  );
};

export default compose(
  withTab,
  withLazy,
)(memo(TabHomeLP));

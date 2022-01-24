import React, { memo } from 'react';
import Wallet from '@screens/Wallet/features/Home/Wallet';
import withTab from '@screens/MainTabBar/MainTabBar.enhanceTab';
import { compose } from 'recompose';
import { useDispatch } from 'react-redux';
import { withLayout_2 } from '@components/Layout';
import { Header } from '@src/components';
import { actionReloadFollowingToken } from '@src/redux/actions/account';

const TabAssets = () => {
  const dispatch = useDispatch();
  const onRefresh = () => {
    dispatch(actionReloadFollowingToken(true));
  };
  React.useEffect(() => {
    onRefresh();
  }, []);
  return (
    <>
      <Header hideBackButton title="Privacy Coins" accountSelectable />
      <Wallet hideBackButton />
    </>
  );
};

export default compose(withLayout_2, withTab)(memo(TabAssets));

import React, { memo } from 'react';
import Wallet from '@screens/Wallet/features/Home/Wallet';
import withTab from '@screens/MainTabBar/MainTabBar.enhanceTab';
import { compose } from 'recompose';
import { useDispatch } from 'react-redux';
import { withLayout_2 } from '@components/Layout';
import { Header } from '@src/components';
import { LoadingContainer } from '@components/core';
import { actionReloadFollowingToken } from '@src/redux/actions/account';

const TabAssets = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const onRefresh = async () => {
    try {
      await dispatch(actionReloadFollowingToken(true));
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    onRefresh();
  }, []);
  return (
    <>
      <Header
        hideBackButton
        title="Privacy Coins"
        accountSelectable
        handleSelectedAccount={onRefresh}
      />
      {loading ? <LoadingContainer /> : <Wallet hideBackButton />}
    </>
  );
};

export default compose(withLayout_2, withTab)(memo(TabAssets));

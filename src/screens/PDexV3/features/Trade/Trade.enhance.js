import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { withLayout_2 } from '@src/components/Layout';
import { compose } from 'recompose';
import { useDispatch, useSelector } from 'react-redux';
import { ExHandler } from '@src/services/exception';
import { activedTabSelector } from '@src/components/core/Tabs';
import { actionInitSwapForm } from '@screens/PDexV3/features/Swap';
import { actionFetchPools } from '@screens/PDexV3/features/Pools';
import {
  actionInit,
  actionSetPoolSelected,
} from '@screens/PDexV3/features/OrderLimit';
import { actionChangeTab } from '@src/components/core/Tabs/Tabs.actions';
import { actionFetch } from './Trade.actions';
import {
  ROOT_TAB_TRADE,
  TAB_SWAP_ID,
  TAB_LIMIT_ID,
  TAB_MARKET_ID,
} from './Trade.constant';

const enhance = (WrappedComp) => (props) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const activedTab = useSelector(activedTabSelector)(ROOT_TAB_TRADE);
  const dispatch = useDispatch();
  const onRefresh = async () => {
    try {
      await setRefreshing(true);
      await dispatch(actionFetch());
      switch (activedTab) {
      case TAB_SWAP_ID: {
        await dispatch(actionInitSwapForm());
        break;
      }
      case TAB_LIMIT_ID: {
        await dispatch(actionInit());
        break;
      }
      case TAB_MARKET_ID: {
        await dispatch(actionFetchPools());
        break;
      }
      default:
        break;
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      await setRefreshing(false);
    }
  };
  const handlePressPool = (poolId) => {
    dispatch(actionSetPoolSelected(poolId));
    dispatch(
      actionChangeTab({
        rootTabID: ROOT_TAB_TRADE,
        tabID: TAB_LIMIT_ID,
      }),
    );
  };
  React.useEffect(() => {
    dispatch(actionFetch());
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, refreshing, onRefresh, handlePressPool }} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
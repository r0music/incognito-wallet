import { batch, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs } from '@src/components/core';
import React from 'react';
import { View } from 'react-native';
import TabSwap from '@screens/PDexV3/features/Swap';
import OrderLimit, {
  actionInit,
  actionSetPoolSelected,
} from '@screens/PDexV3/features/OrderLimit';
import { useNavigationParam } from 'react-navigation-hooks';
import MarketList from '@screens/PDexV3/features/MarketList';
import SelectAccountButton from '@src/components/SelectAccountButton';
import { actionChangeTab } from '@src/components/core/Tabs/Tabs.actions';
import {
  ROOT_TAB_TRADE,
  TAB_SWAP_ID,
  TAB_BUY_LIMIT_ID,
  TAB_SELL_LIMIT_ID,
  TAB_MARKET_ID,
} from './Trade.constant';
import { styled } from './Trade.styled';
import withTrade from './Trade.enhance';

const Trade = () => {
  const tabIndex = useNavigationParam('tabIndex');
  const dispatch = useDispatch();
  const onPressPool = (poolId) => {
    batch(() => {
      dispatch(actionSetPoolSelected(poolId));
      dispatch(
        actionChangeTab({
          rootTabID: ROOT_TAB_TRADE,
          tabID: TAB_BUY_LIMIT_ID,
        }),
      );
    });
  };
  return (
    <View style={styled.container}>
      <Tabs
        rootTabID={ROOT_TAB_TRADE}
        styledTabs={styled.styledTabs}
        useTab1
        defaultTabIndex={tabIndex}
        styledTabList={styled.styledTabList}
        rightCustom={<SelectAccountButton />}
      >
        <View
          tabID={TAB_BUY_LIMIT_ID}
          label="Buy"
          onChangeTab={() => dispatch(actionInit(false))}
        >
          <OrderLimit />
        </View>
        <View
          tabID={TAB_SELL_LIMIT_ID}
          label="Sell"
          onChangeTab={() => dispatch(actionInit(false))}
        >
          <OrderLimit />
        </View>
        <View tabID={TAB_SWAP_ID} label="Swap" onChangeTab={() => null}>
          <TabSwap />
        </View>
        <View tabID={TAB_MARKET_ID} label="Market" onChangeTab={() => null}>
          <MarketList onPressPool={onPressPool} />
        </View>
      </Tabs>
    </View>
  );
};

Trade.defaultProps = {
  hideBackButton: false,
};

Trade.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  handlePressPool: PropTypes.func.isRequired,
  hideBackButton: PropTypes.bool,
};

export default withTrade(React.memo(Trade));

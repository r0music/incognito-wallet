import { Header } from '@src/components';
import PropTypes from 'prop-types';
import { Tabs } from '@src/components/core';
import React from 'react';
import { View } from 'react-native';
import TabSwap from '@screens/PDexV3/features/Swap';
import OrderLimit from '@screens/PDexV3/features/OrderLimit';
import { useNavigationParam } from 'react-navigation-hooks';
import SelectAccountButton from '@src/components/SelectAccountButton';
import { ROOT_TAB_TRADE, TAB_LIMIT_ID, TAB_SWAP_ID } from './Trade.constant';
import { styled } from './Trade.styled';
import withTrade from './Trade.enhance';

const Trade = () => {
  const tabIndex = useNavigationParam('tabIndex');
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
        <View tabID={TAB_SWAP_ID} label="Swap" onChangeTab={() => null}>
          <TabSwap />
        </View>
        <View tabID={TAB_LIMIT_ID} label="Limit" onChangeTab={() => null}>
          <OrderLimit />
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

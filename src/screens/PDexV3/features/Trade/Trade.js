import { Header, Row } from '@src/components';
import PropTypes from 'prop-types';
import { Tabs } from '@src/components/core';
import React from 'react';
import { View } from 'react-native';
import TabSwap from '@screens/PDexV3/features/Swap';
import OrderLimit from '@screens/PDexV3/features/OrderLimit';
import { BtnOrderHistory } from '@src/components/Button';
import SelectAccountButton from '@src/components/SelectAccountButton';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import TabMarket from '@screens/PDexV3/features/MarketList';
import {
  ROOT_TAB_TRADE,
  TAB_LIMIT_ID,
  TAB_MARKET_ID,
  TAB_SWAP_ID,
} from './Trade.constant';
import { styled } from './Trade.styled';
import withTrade from './Trade.enhance';

export const RightHeader = React.memo(
  ({ callback, visibleBtnHistory, selectAccountable = true } = {}) => {
    const navigation = useNavigation();
    const handleNavOrderHistory = () =>
      navigation.navigate(routeNames.TradeOrderHistory);
    return (
      <Row style={styled.rightHeader}>
        {visibleBtnHistory && (
          <BtnOrderHistory
            style={styled.btnOrderHistory}
            onPress={handleNavOrderHistory}
          />
        )}
        {selectAccountable && <SelectAccountButton callback={callback} />}
      </Row>
    );
  },
);

const Trade = (props) => {
  const { onRefresh, handlePressPool } = props;
  return (
    <View style={styled.container}>
      <Header
        title="pDex"
        accountSelectable
        handleSelectedAccount={onRefresh}
      />
      <Tabs rootTabID={ROOT_TAB_TRADE} styledTabs={styled.styledTabs} useTab1>
        <View tabID={TAB_MARKET_ID} label="Market" onChangeTab={() => null}>
          <TabMarket onPressPool={handlePressPool} />
        </View>
        <View tabID={TAB_LIMIT_ID} label="Limit" onChangeTab={() => null}>
          <OrderLimit />
        </View>
        <View tabID={TAB_SWAP_ID} label="Swap" onChangeTab={() => null}>
          <TabSwap />
        </View>
      </Tabs>
    </View>
  );
};

Trade.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  handlePressPool: PropTypes.func.isRequired,
};

export default withTrade(React.memo(Trade));

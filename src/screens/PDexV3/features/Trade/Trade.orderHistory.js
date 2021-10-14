import React from 'react';
import { useSelector } from 'react-redux';
import { activedTabSelector } from '@src/components/core/Tabs';
import { SwapOrderHistory } from '@screens/PDexV3/features/Swap';
import { OrderLimitHistory } from '@screens/PDexV3/features/OrderLimit';
import { withLayout_2 } from '@src/components/Layout';
import { ROOT_TAB_TRADE, TAB_SWAP_ID, TAB_LIMIT_ID } from './Trade.constant';

const OrderHistory = () => {
  const activedTab = useSelector(activedTabSelector)(ROOT_TAB_TRADE);
  switch (activedTab) {
  case TAB_SWAP_ID: {
    return <SwapOrderHistory />;
  }
  case TAB_LIMIT_ID: {
    return <OrderLimitHistory />;
  }
  default:
    break;
  }
  return null;
};

OrderHistory.propTypes = {};

export default withLayout_2(React.memo(OrderHistory));

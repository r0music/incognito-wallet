import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs } from '@src/components/core';
import Row from '@src/components/Row';
import React from 'react';
import { View } from 'react-native';
import TabSwap from '@screens/PDexV3/features/Swap';
import OrderLimit, {
  actionInit,
  visibleBtnChartSelector,
} from '@screens/PDexV3/features/OrderLimit';
import { ButtonChart } from '@src/components/Button';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';
import SelectAccountButton from '@src/components/SelectAccountButton';
import routeNames from '@src/router/routeNames';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import {
  ROOT_TAB_TRADE,
  TAB_SWAP_ID,
  TAB_BUY_LIMIT_ID,
  TAB_SELL_LIMIT_ID,
} from './Trade.constant';
import { styled } from './Trade.styled';
import withTrade from './Trade.enhance';

const Trade = (props) => {
  const tabIndex = useNavigationParam('tabIndex');
  const { onRefresh } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const visibleBtnChart = useDebounceSelector(visibleBtnChartSelector);
  return (
    <View style={styled.container}>
      <Tabs
        rootTabID={ROOT_TAB_TRADE}
        defaultTabHeader
        styledTabs={styled.styledTabs}
        useTab1
        defaultTabIndex={0}
        styledTabList={styled.styledTabList}
        rightCustom={(
          <Row style={styled.rightHeader}>
            {visibleBtnChart && (
              <ButtonChart
                onPress={() => navigation.navigate(routeNames.Chart)}
                style={{ marginRight: 15 }}
              />
            )}
            <View>
              <SelectAccountButton handleSelectedAccount={onRefresh} />
            </View>
          </Row>
        )}
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
        <View tabID={TAB_SWAP_ID} label="Swap">
          <TabSwap />
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

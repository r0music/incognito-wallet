import React, {memo} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {Tabs} from '@components/core';
import {TABS} from '@screens/PDexV3/features/LiquidityHistories';
import withHistories from '@screens/PDexV3/features/LiquidityHistories/LiquidityHistories.enhance';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {compose} from 'recompose';
import {withLayout_2} from '@components/Layout';
import withLazy from '@components/LazyHoc/LazyHoc';
import WithdrawRewardHistories from './LiquidityHistories.reward';
import RemovePoolHistories from './LiquidityHistories.removePool';
import ContributeHistories from './LiquidityHistories.contribute';

const Home = ({ onRefresh }) => {
  React.useEffect(() => {
    onRefresh();
  }, []);
  return (
    <>
      <Tabs
        rootTabID={TABS.ROOT_TAB_HOME_LIQUIDITY_HISTORIES}
        useTab1
        hideBackButton={false}
        styledTabs={mainStyle.tab1}
        styledTabList={mainStyle.styledTabList1}
      >
        <View tabID={TABS.TAB_CONTRIBUTE_HISTORIES_ID} label="Contribute">
          <ContributeHistories />
        </View>
        <View tabID={TABS.TAB_REMOVE_POOL_HISTORIES_ID} label="Remove">
          <RemovePoolHistories />
        </View>
        <View tabID={TABS.TAB_WITHDRAW_REWARD_HISTORIES_ID} label="Rewards">
          <WithdrawRewardHistories />
        </View>
      </Tabs>
    </>
  );
};

Home.propTypes = {
  onRefresh: PropTypes.func.isRequired
};

export default compose(
  withLazy,
  withHistories,
  withLayout_2,
)(memo(Home));

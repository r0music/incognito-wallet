import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Tabs, Text } from '@src/components/core';
import { TABS } from '@screens/MainTabBar/features/Home/Home.constant';
import { batch, useDispatch, useSelector } from 'react-redux';
import {
  actionFetchPools,
  listPoolsVerifySelector,
} from '@screens/PDexV3/features/Pools';
import { Row } from '@src/components';
import { homeStyled } from '@screens/MainTabBar/MainTabBar.styled';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import { actionSetDefaultPair } from '@screens/PDexV3/features/Swap';
import { actionChangeTab } from '@components/core/Tabs/Tabs.actions';
import {
  ROOT_TAB_TRADE,
  TAB_SWAP_ID,
} from '@screens/PDexV3/features/Trade/Trade.constant';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';

const Item = React.memo(({ pool, onItemPress, popular }) => {
  const {
    priceStr,
    perChange24hToStr,
    perChange24hColor,
    perChange24hBGColor,
    poolId,
    poolTitle,
    volumeSuffix,
  } = pool;
  return (
    <TouchableOpacity onPress={() => onItemPress(pool)}>
      <Row centerVertical style={homeStyled.wrapPoolBox}>
        <Text style={[homeStyled.mediumBlack, homeStyled.itemBox]}>
          {poolTitle}
        </Text>
        <Text
          style={[
            homeStyled.mediumBlack,
            homeStyled.itemBox,
            { color: perChange24hColor, textAlign: 'right', marginRight: 15 },
          ]}
        >
          {priceStr}
        </Text>
        <View
          style={[
            !popular && homeStyled.percentBox,
            homeStyled.percentBoxWidth,
            { backgroundColor: perChange24hBGColor },
            popular && {
              paddingHorizontal: 0,
              backgroundColor: 'transparent',
            },
          ]}
        >
          <Text
            style={[
              homeStyled.mediumBlack,
              { color: COLORS.white, fontSize: 11 },
              popular && homeStyled.volText,
            ]}
            numberOfLines={0}
          >
            {popular ? volumeSuffix : perChange24hToStr}
          </Text>
        </View>
      </Row>
    </TouchableOpacity>
  );
});

const Header = React.memo(({ popular }) => (
  <Row>
    <Text style={[homeStyled.itemBox, homeStyled.tabHeaderText]}>Name</Text>
    <Text
      style={[
        homeStyled.itemBox,
        homeStyled.tabHeaderText,
        { textAlign: 'right', marginRight: 15 },
      ]}
    >
      Price
    </Text>
    <Text
      style={[
        homeStyled.percentBoxWidth,
        homeStyled.tabHeaderText,
        { textAlign: 'right' },
      ]}
    >
      {popular ? 'Vol(USD)' : 'Change'}
    </Text>
  </Row>
));

const tabStyle = {
  titleStyled: homeStyled.mediumBlack,
  titleDisabledStyled: homeStyled.tabDisable,
};

const MainTab = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const pools = useSelector(listPoolsVerifySelector);
  const onItemPress = (pool) => {
    navigation.navigate(routeNames.Trade, { tabIndex: 0 });
    batch(() => {
      dispatch(
        actionChangeTab({
          rootTabID: ROOT_TAB_TRADE,
          tabID: TAB_SWAP_ID,
        }),
      );
      dispatch(
        actionSetDefaultPair({
          selltoken: pool?.token1?.tokenId,
          buytoken: pool?.token2?.tokenId,
        }),
      );
    });
  };
  const renderItem = (pool, popular) => (
    <Item
      pool={pool}
      key={pool.poolId}
      onItemPress={onItemPress}
      popular={popular}
    />
  );
  React.useEffect(() => {
    dispatch(actionFetchPools());
  }, []);
  if (!pools || pools.length === 0) return null;
  return (
    <Tabs rootTabID={TABS.TAB_HOME_ID} useTab1 styledTabList={homeStyled.tab}>
      <View tabID={TABS.TAB_HOME_INCREASE_ID} label="Gainers" {...tabStyle}>
        <Header />
        {orderBy(pools, 'priceChange24H', 'desc').map((item) =>
          renderItem(item, false),
        )}
      </View>
      <View tabID={TABS.TAB_HOME_REDUCE_ID} label="Losers" {...tabStyle}>
        <Header />
        {orderBy(pools, 'priceChange24H', 'asc').map((item) =>
          renderItem(item, false),
        )}
      </View>
      <View tabID={TABS.TAB_HOME_POPULAR_ID} label="24h Vol" {...tabStyle}>
        <Header popular />
        {orderBy(pools, 'volume', 'desc').map((item) => renderItem(item, true))}
      </View>
    </Tabs>
  );
};

Item.propTypes = {
  pool: PropTypes.object.isRequired,
  onItemPress: PropTypes.func.isRequired,
};

Header.propTypes = {
  popular: PropTypes.bool.isRequired,
};

export default memo(MainTab);

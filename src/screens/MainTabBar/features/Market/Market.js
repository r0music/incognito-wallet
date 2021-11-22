import React from 'react';
import PropTypes from 'prop-types';
import Header from '@screens/MainTabBar/features/Market/Market.header';
import {TokenFollow} from '@components/Token';
import MarketList from '@components/Token/Token.marketList';
import withMarket from '@screens/MainTabBar/features/Market/Market.enhance';
import {batch, useDispatch} from 'react-redux';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import {actionChangeTab} from '@components/core/Tabs/Tabs.actions';
import {ROOT_TAB_TRADE, TAB_BUY_LIMIT_ID} from '@screens/PDexV3/features/Trade/Trade.constant';
import {actionInit, actionSetPoolSelected} from '@screens/PDexV3/features/OrderLimit';

const Market = React.memo((props) => {
  const { handleToggleFollowToken, keySearch, onFilter, ...rest } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const onOrderPress = (item) => {
    const poolId = item.defaultPoolPair;
    if (poolId) {
      batch(() => {
        dispatch(actionSetPoolSelected(poolId));
        dispatch(actionInit());
        dispatch(actionChangeTab({ rootTabID: ROOT_TAB_TRADE, tabID: TAB_BUY_LIMIT_ID }));
      });
    }
    navigation.navigate(routeNames.Trade, { tabIndex: 0 });
  };
  return (
    <>
      <Header onFilter={onFilter} />
      <MarketList
        keySearch={keySearch}
        {...rest}
        renderItem={(item) => (
          <TokenFollow
            item={item}
            key={item.tokenId}
            hideStar={!keySearch}
            handleToggleFollowToken={handleToggleFollowToken}
            onPress={() => onOrderPress(item)}
          />
        )}
      />
    </>
  );
});

Market.propTypes = {
  handleToggleFollowToken: PropTypes.func.isRequired,
  keySearch: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired
};

export default withMarket(Market);
import React from 'react';
import { StyleSheet } from 'react-native';
import { withLayout_2 } from '@src/components/Layout';
import { ScrollViewBorder } from '@components/core';
import { PancakeIcon2 } from '@src/components/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { FONT } from '@src/styles';
import { KEYS_PLATFORMS_SUPPORTED } from '@screens/PDexV3/features/Swap';
import {
  ROOT_TAB_TRADE,
  TAB_SWAP_ID,
  TAB_BUY_LIMIT_ID,
} from '@screens/PDexV3/features/Trade';
import { useFocusEffect, useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import Header from '@src/components/Header';
import { activedTabSelector, actionChangeTab } from '@src/components/core/Tabs';
import PrivacyAppsItem from './PrivacyApps.item';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
  },
});

const PrivacyApps = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const getActivedTab = useSelector(activedTabSelector);
  const onPressItem = (id) => {
    switch (id) {
    case KEYS_PLATFORMS_SUPPORTED.pancake:
      navigation.navigate(routeNames.PrivacyAppsPancake);
      break;
    default:
      break;
    }
  };
  const factories = React.useMemo(() => {
    return [
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.pancake,
        icon: <PancakeIcon2 />,
        headerTitle: 'pPancake',
        headerSub: 'Private PancakeSwap',
        groupActions: [
          {
            id: 'BSC',
            title: 'Binance Smart Chain',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Trade anonymously on Binance Smart Chain’s leading DEX. Deep liquidity and super low fees – now with privacy.',
        onPressItem,
      },
    ];
  }, []);
  useFocusEffect(() => {
    const activeTabTrade = getActivedTab(ROOT_TAB_TRADE);
    if (activeTabTrade === TAB_SWAP_ID) {
      dispatch(
        actionChangeTab({ rootTabID: ROOT_TAB_TRADE, tabID: TAB_BUY_LIMIT_ID }),
      );
    }
  });
  return (
    <>
      <Header
        title="Privacy apps"
        titleStyled={[{ ...FONT.TEXT.incognitoH4 }]}
        hideBackButton
      />
      <ScrollViewBorder style={styled.scrollview}>
        {factories.map((item) => (
          <PrivacyAppsItem key={item.id} {...item} />
        ))}
      </ScrollViewBorder>
    </>
  );
};

PrivacyApps.propTypes = {};

export default withLayout_2(React.memo(PrivacyApps));

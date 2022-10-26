import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { withLayout_2 } from '@src/components/Layout';
import { View } from '@src/components/core';
import {
  PancakeIcon2,
  UniIcon2,
  CurveIcon2,
  SpoonkyIcon2,
} from '@src/components/Icons';
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
import { FlatList } from '@src/components/core/FlatList';
import PrivacyAppsItem from './PrivacyApps.item';

const styled = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
    padding: 20,
  },
  itemSpace: {
    height: 20,
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
      case KEYS_PLATFORMS_SUPPORTED.uni:
      case KEYS_PLATFORMS_SUPPORTED.uniEther:
        navigation.navigate(routeNames.PrivacyAppsUni);
        break;
      case KEYS_PLATFORMS_SUPPORTED.curve:
        navigation.navigate(routeNames.PrivacyAppsCurve);
        break;
      // case KEYS_PLATFORMS_SUPPORTED.uniEther:
      //   navigation.navigate(routeNames.PrivacyAppsUniEther);
      // break;
      case KEYS_PLATFORMS_SUPPORTED.spooky:
        navigation.navigate(routeNames.PrivacyAppsSpooky);
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
        defaultPair: {
          selltoken:
            '545ef6e26d4d428b16117523935b6be85ec0a63e8c2afeb0162315eb0ce3d151', //USDC (UT)
          buytoken:
            'e5032c083f0da67ca141331b6005e4a3740c50218f151a5e829e9d03227e33e2', //BNB (BSC)
        },
        onPressItem,
      },
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.uni,
        icon: <UniIcon2 />,
        headerTitle: 'pUniswap',
        headerSub: 'Private Uniswap',
        groupActions: [
          {
            id: 'POLYGON',
            title: 'Polygon',
          },
          {
            id: 'ETHEREUM',
            title: 'Ethereum',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Trade confidentially on everyone’s favorite DEX. Faster and cheaper thanks to Polygon, Ethereum, and private like all Incognito apps.',
        defaultPair: {
          selltoken:
            '545ef6e26d4d428b16117523935b6be85ec0a63e8c2afeb0162315eb0ce3d151', //USDC (UT)
          buytoken:
            '3ee31eba6376fc16cadb52c8765f20b6ebff92c0b1c5ab5fc78c8c25703bb19e', //ETH (UT)
        },
        onPressItem,
      },
      // {
      //   privacyAppId: KEYS_PLATFORMS_SUPPORTED.uniEther,
      //   icon: <UniIcon2 />,
      //   headerTitle: 'pUniswap',
      //   headerSub: 'Private Uniswap',
      //   groupActions: [
      //     {
      //       id: 'ETHEREUM',
      //       title: 'Etherum',
      //     },
      //     {
      //       id: 'DEX',
      //       title: 'DEX',
      //     },
      //   ],
      //   desc: 'Trade confidentially on everyone’s favorite DEX. Faster and cheaper thanks to Polygon, and private like all Incognito apps.',
      //   onPressItem,
      // },
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.curve,
        icon: <CurveIcon2 />,
        headerTitle: 'pCurve',
        headerSub: 'Private Curve',
        groupActions: [
          {
            id: 'POLYGON',
            title: 'Polygon',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Swap stablecoins with complete confidentiality using Privacy Curve. Low fees on Polygon meets full privacy on Incognito.',
        defaultPair: {
          selltoken:
            '545ef6e26d4d428b16117523935b6be85ec0a63e8c2afeb0162315eb0ce3d151', //USDC (UT)
          buytoken:
            '076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229', //USDT (UT)
        },
        onPressItem,
      },
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.spooky,
        icon: <SpoonkyIcon2 />,
        headerTitle: 'pSpooky',
        headerSub: 'Private SpookySwap',
        groupActions: [
          {
            id: 'FANTOM',
            title: 'Fantom',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Explore DeFi on Fantom with full privacy for your activity and assets. Swap Fantom coins anonymously with Private SpookySwap.',
        defaultPair: {
          selltoken:
            '545ef6e26d4d428b16117523935b6be85ec0a63e8c2afeb0162315eb0ce3d151', //USDC (UT)
          buytoken:
            '6eed691cb14d11066f939630ff647f5f1c843a8f964d9a4d295fa9cd1111c474', //FTM
        },
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

  const keyExtractor = useCallback((item) => item?.id?.toString(), []);

  const renderItem = useCallback(
    ({ item }) => <PrivacyAppsItem {...item} />,
    [],
  );

  const renderItemSeparatorComponent = useCallback(
    () => <View style={styled.itemSpace} />,
    [],
  );

  return (
    <>
      <Header
        title="Privacy apps"
        titleStyled={[{ ...FONT.TEXT.incognitoH4 }]}
        hideBackButton
      />
      <View borderTop fullFlex>
        <FlatList
          data={factories}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparatorComponent}
          contentContainerStyle={styled.flatListContainer}
          initialNumToRender={5}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          windowSize={10}
        />
      </View>
    </>
  );
};

PrivacyApps.propTypes = {};

export default withLayout_2(React.memo(PrivacyApps));

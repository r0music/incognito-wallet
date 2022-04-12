import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  accessOTAShareFormatedSelector,
  nftShareFormatedSelector
} from '@screens/PDexV3/features/Portfolio/Portfolio.selector';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import PortfolioItem from '@screens/PDexV3/features/Portfolio/Portfolio.item';
import { compose } from 'recompose';
import withLPTransaction from '@screens/PDexV3/features/Share/Share.transactorLP';
import { useSelector } from 'react-redux';
import { compressParamsWithdrawFee } from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import { ScrollView, Tabs } from '@components/core';
import { FONT } from '@src/styles';

export const styles = StyleSheet.create({
  title: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 10,
    marginRight: 4,
  },
  group: {
    marginTop: 8
  },
  wrapArrow: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  child: {
    marginTop: 16
  },
  wrapTap: {
    marginTop: 12,
    backgroundColor: 'transparent',
    paddingHorizontal: 24
  },
  tabStyled: {
    borderRadius: 100,
    padding: 0,
    marginRight: 0,
    overflow: 'hidden',
    backgroundColor: '#404040',
    height: 32
  },
  btnStyleDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  titleStyled: {
    padding: 0,
    margin: 0,
    fontSize: FONT.SIZE.small,
    fontFamily: FONT.NAME.medium,
    lineHeight: FONT.SIZE.regular + 5,
    paddingHorizontal: 14,
    paddingVertical: 0,
  },
  titleDisabledStyle: {
    color: '#9C9C9C',
  },
});

const PortfolioVer2 = React.memo(({ createAndSendWithdrawLPFee }) => {
  const nftShare = useDebounceSelector(nftShareFormatedSelector);
  const accessOTAShare = useDebounceSelector(accessOTAShareFormatedSelector);
  const onCompressParamsWithdrawFee = useSelector(compressParamsWithdrawFee);

  const nftShareIDs = React.useMemo(() =>
    nftShare.map(({ shareId }) => shareId) || []
    , [nftShare.length]);
  const accessOTAShareIDs = React.useMemo(() =>
    accessOTAShare.map(({ shareId }) => shareId)
    , [accessOTAShare.length]);

  const handleWithdrawFee = ({ poolId, shareId }) => {
    const { params, versionTx } = onCompressParamsWithdrawFee({ poolId, shareId });
    if (typeof createAndSendWithdrawLPFee !== 'function' || !params) return;
    createAndSendWithdrawLPFee(params, versionTx);
  };

  const renderItem = React.useCallback(({ item: shareId }) => {
    return (
      <PortfolioItem
        shareId={shareId}
        key={shareId}
        onWithdrawFeeLP={handleWithdrawFee}
      />
    );
  }, []);

  const NFTShareSection = React.useMemo(() => {
    return (
      <FlatList
        data={nftShareIDs}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      />
    );
  }, [nftShareIDs.length]);

  const AccessOTAShareSection = React.useMemo(() => {
    return (
      <FlatList
        data={accessOTAShareIDs}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      />
    );
  }, [accessOTAShareIDs.length]);

  return (
    <Tabs
      rootTabID="TAB-PORTFOLIO-DETAIL"
      useTab1
      defaultTabHeader={false}
      styledTabs={styles.wrapTap}
    >
      <View
        tabID="TAB-PORTFOLIO-DETAIL-ACCESS-OTA"
        label="Version 2"
        tabStyled={styles.tabStyled}
        tabStyledDisabled={styles.btnStyleDisabled}
        titleStyled={styles.titleStyled}
        titleDisabledStyle={styles.titleDisabledStyle}
      >
        {AccessOTAShareSection}
      </View>
      <View
        tabID="TAB-PORTFOLIO-DETAIL-ACCESS-NFT"
        label="Version 1"
        tabStyled={styles.tabStyled}
        tabStyledDisabled={styles.btnStyleDisabled}
        titleStyled={styles.titleStyled}
        titleDisabledStyle={styles.titleDisabledStyle}
      >
        {NFTShareSection}
      </View>
    </Tabs>
  );
});

export default compose(withLPTransaction)(PortfolioVer2);
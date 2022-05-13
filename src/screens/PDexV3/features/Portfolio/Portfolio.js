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
import { useDispatch, useSelector } from 'react-redux';
import { compressParamsWithdrawFee } from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import { RefreshControl, Tabs } from '@components/core';
import { FONT } from '@src/styles';
import { actionFetch } from '@screens/PDexV3/features/Portfolio/Portfolio.actions';
import { EmptyBookIcon } from '@components/Icons';

export const styles = StyleSheet.create({
  wrapTap: {
    marginTop: 12,
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
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
  contentContainerStyle: {
    paddingHorizontal: 24,
    flex: 1
  },
});

const Portfolio = React.memo(({ createAndSendWithdrawLPFee }) => {
  const nftShare = useDebounceSelector(nftShareFormatedSelector);
  const dispatch = useDispatch();
  const accessOTAShare = useDebounceSelector(accessOTAShareFormatedSelector);
  const onCompressParamsWithdrawFee = useSelector(compressParamsWithdrawFee);

  const nftShareIDs = React.useMemo(() =>
      nftShare.filter(({ hasContributedAmount }) => !!hasContributedAmount).map(({ shareId }) => shareId) || []
    , [nftShare.length]);
  const accessOTAShareIDs = React.useMemo(() =>
      accessOTAShare.filter(({ hasContributedAmount }) => !!hasContributedAmount).map(({ shareId }) => shareId)
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
  }, [handleWithdrawFee, onCompressParamsWithdrawFee]);

  const renderNFTShare = () => {
    return (
      <FlatList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => dispatch(actionFetch())} />
        }
        data={nftShareIDs}
        renderItem={renderItem}
        keyExtractor={item => item}
        style={styles.contentContainerStyle}
        contentContainerStyle={[nftShareIDs.length === 0 && { flex: 1 }]}
        ListEmptyComponent={
          <EmptyBookIcon message="Join a pool to contribute liquidity and earn rewards." />
        }
      />
    );
  };

  const renderAccessOTAShare = () => {
    return (
      <FlatList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => dispatch(actionFetch())} />
        }
        data={accessOTAShareIDs}
        renderItem={renderItem}
        keyExtractor={item => item}
        style={styles.contentContainerStyle}
        contentContainerStyle={[accessOTAShareIDs.length === 0 && { flex: 1 }]}
        ListEmptyComponent={
          <EmptyBookIcon message="Join a pool to contribute liquidity and earn rewards." />
        }
      />
    );
  };

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
        {renderAccessOTAShare()}
      </View>
      <View
        tabID="TAB-PORTFOLIO-DETAIL-ACCESS-NFT"
        label="Version 1"
        tabStyled={styles.tabStyled}
        tabStyledDisabled={styles.btnStyleDisabled}
        titleStyled={styles.titleStyled}
        titleDisabledStyle={styles.titleDisabledStyle}
      >
        {renderNFTShare()}
      </View>
    </Tabs>
  );
});

export default compose(withLPTransaction)(Portfolio);
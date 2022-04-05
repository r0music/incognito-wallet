import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  accessOTAShareFormatedSelector,
  nftShareFormatedSelector
} from '@screens/PDexV3/features/Portfolio/Portfolio.selector';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import PortfolioItem from '@screens/PDexV3/features/Portfolio/Portfolio.item';
import withLazy from '@components/LazyHoc/LazyHoc';
import { compose } from 'recompose';
import withLPTransaction from '@screens/PDexV3/features/Share/Share.transactorLP';
import { useSelector } from 'react-redux';
import { compressParamsWithdrawFee } from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import { ScrollView, Text } from '@components/core';
import { ArrowFillIcon } from '@components/Icons';
import { FONT } from '@src/styles';
import styled from 'styled-components/native';
import { Row } from '@src/components';

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
  }
});

export const CustomRow = styled(Row)`
  background-color: ${({ theme }) => theme.btnBG3};
  height: 50px;
  border-radius: 8px;
  padding-left: 16px;
  padding-right: 16px;
`;

const GroupButton = React.memo((props) => {
  const { ExpandView, title } = props;
  const [isExpand, setIsExpand] = React.useState(true);

  const onPress = React.useCallback(() => {
    setIsExpand(value => !value);
  }, [isExpand]);

  return (
    <>
      <TouchableOpacity style={styles.group} onPress={onPress}>
        <TouchableOpacity style={styles.group} onPress={onPress}>
          <CustomRow centerVertical spaceBetween>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.wrapArrow}>
              <ArrowFillIcon position={isExpand ? 'DOWN' : 'UP'} />
            </View>
          </CustomRow>
        </TouchableOpacity>
      </TouchableOpacity>
      {isExpand && ExpandView}
    </>
  );
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
      />
    );
  }, [nftShareIDs.length]);

  const AccessOTAShareSection = React.useMemo(() => {
    return (
      <FlatList
        data={accessOTAShareIDs}
        renderItem={renderItem}
        keyExtractor={item => item}
      />
    );
  }, [accessOTAShareIDs.length]);

  return (
    <ScrollView>
      <GroupButton ExpandView={AccessOTAShareSection} title="Liquidity version 2" />
      <GroupButton ExpandView={NFTShareSection} title="Liquidity version 1" />
    </ScrollView>
  );
});

export default compose(withLazy, withLPTransaction)(PortfolioVer2);
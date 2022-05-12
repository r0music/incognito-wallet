import React from 'react';
import {
  listShareSelector,
} from '@screens/PDexV3/features/Portfolio/Portfolio.selector';
import { useDispatch, useSelector } from 'react-redux';
import { compressParamsWithdrawFee } from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import PortfolioItem from '@screens/PDexV3/features/Portfolio/Portfolio.item';
import { FlatList } from 'react-native';
import { compose } from 'recompose';
import withLPTransaction from '@screens/PDexV3/features/Share/Share.transactorLP';
import orderBy from 'lodash/orderBy';
import { RefreshControl, View } from '@components/core';
import { actionFetch } from '@screens/PDexV3/features/Portfolio/Portfolio.actions';
import { EmptyBookIcon } from '@components/Icons';
import { styles } from '@screens/PDexV3/features/Portfolio/PortfolioVer2';

const PortfolioReward = React.memo(({ createAndSendWithdrawLPFee }) => {
  const onCompressParamsWithdrawFee = useSelector(compressParamsWithdrawFee);
  const dispatch = useDispatch();

  const data = useSelector(listShareSelector);

  const listShareRewardID = React.useMemo(() => {
    if (!data) return [];
    return orderBy(data, 'totalRewardAmount', 'desc').filter(item => item.withdrawable).map(({ shareId }) => shareId);
  }, [data]);

  const handleWithdrawFee = ({ poolId, shareId }) => {
    const { params, versionTx } = onCompressParamsWithdrawFee({ poolId, shareId }) || {};
    if (typeof createAndSendWithdrawLPFee !== 'function' || !params) return;
    createAndSendWithdrawLPFee(params, versionTx);
  };

  const renderItem = React.useCallback(({ item }) => {
    return (
      <PortfolioItem
        shareId={item}
        key={item}
        showRemove={false}
        onWithdrawFeeLP={handleWithdrawFee}
      />
    );
  }, [createAndSendWithdrawLPFee]);

  const keyExtractor = React.useCallback((item) => item?.id, []);

  return (
    <View fullFlex>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => dispatch(actionFetch())} />
        }
        style={styles.contentContainerStyle}
        contentContainerStyle={[listShareRewardID.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        data={listShareRewardID}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<EmptyBookIcon message="Join a pool to contribute liquidity and earn rewards." />}
      />
    </View>
  );
});

export default compose(withLPTransaction)(PortfolioReward);
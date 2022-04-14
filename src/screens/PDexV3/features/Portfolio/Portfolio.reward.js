import React from 'react';
import {
  listShareSelector,
} from '@screens/PDexV3/features/Portfolio/Portfolio.selector';
import { useDispatch, useSelector } from 'react-redux';
import { compressParamsWithdrawFee } from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import PortfolioItem from '@screens/PDexV3/features/Portfolio/Portfolio.item';
import { ScrollView } from 'react-native';
import { compose } from 'recompose';
import withLPTransaction from '@screens/PDexV3/features/Share/Share.transactorLP';
import orderBy from 'lodash/orderBy';
import { RefreshControl } from '@components/core';
import { actionFetch } from '@screens/PDexV3/features/Portfolio/Portfolio.actions';
import { EmptyBookIcon } from '@components/Icons';

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

  const renderItem = React.useCallback((shareId) => {
    return (
      <PortfolioItem
        shareId={shareId}
        key={shareId}
        showRemove={false}
        onWithdrawFeeLP={handleWithdrawFee}
      />
    );
  }, [createAndSendWithdrawLPFee]);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={() => dispatch(actionFetch())} />
      }
      contentContainerStyle={{ paddingHorizontal: 24, flex: 1 }}
    >
      {listShareRewardID.length > 0 ? listShareRewardID.map(renderItem) : <EmptyBookIcon message="Join a pool to contribute liquidity and earn rewards." />}
      {listShareRewardID.map(renderItem)}
    </ScrollView>
  );
});

export default compose(withLPTransaction)(PortfolioReward);
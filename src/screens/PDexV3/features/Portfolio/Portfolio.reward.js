import React from 'react';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import {
  accessOTAShareFormatedSelector,
  nftShareFormatedSelector
} from '@screens/PDexV3/features/Portfolio/Portfolio.selector';
import { useSelector } from 'react-redux';
import { compressParamsWithdrawFee } from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import PortfolioItem from '@screens/PDexV3/features/Portfolio/Portfolio.item';
import { ScrollView } from 'react-native';
import { compose } from 'recompose';
import withLPTransaction from '@screens/PDexV3/features/Share/Share.transactorLP';

const PortfolioReward = React.memo(({ createAndSendWithdrawLPFee }) => {
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
    <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
      {accessOTAShareIDs.map(renderItem)}
      {nftShareIDs.map(renderItem)}
    </ScrollView>
  );
});

export default compose(withLPTransaction)(PortfolioReward);
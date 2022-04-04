import React from 'react';
import { ScrollView } from 'react-native';
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

  const renderItem = React.useCallback((shareId) => {
    return (
      <PortfolioItem
        shareId={shareId}
        key={shareId}
        onWithdrawFeeLP={handleWithdrawFee}
      />
    );
  }, []);

  const NFTShareSection = React.useMemo(() => {
    return nftShareIDs.map(renderItem);
  }, [nftShareIDs.length]);

  const AccessOTAShareSection = React.useMemo(() => {
    return accessOTAShareIDs.map(renderItem);
  }, [accessOTAShareIDs.length]);

  return (
    <ScrollView>
      {AccessOTAShareSection}
      {/*{NFTShareSection}*/}
    </ScrollView>
  );
});

export default compose(withLazy, withLPTransaction)(PortfolioVer2);
import React from 'react';
import { ScrollView } from 'react-native';
import {
  accessOTAShareFormatedSelector,
  nftShareFormatedSelector
} from '@screens/PDexV3/features/Portfolio/Portfolio.selector';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import PortfolioItem from '@screens/PDexV3/features/Portfolio/Portfolio.item';
import withLazy from '@components/LazyHoc/LazyHoc';

const PortfolioVer2 = React.memo(() => {
  const nftShare = useDebounceSelector(nftShareFormatedSelector);
  const accessOTAShare = useDebounceSelector(accessOTAShareFormatedSelector);

  const nftShareIDs = React.useMemo(() =>
    nftShare.map(({ shareId }) => shareId) || []
    , [nftShare.length]);
  const accessOTAShareIDs = React.useMemo(() =>
    accessOTAShare.map(({ shareId }) => shareId)
    , [accessOTAShare.length]);

  const renderItem = React.useCallback((shareId) => {
    return (
      <PortfolioItem
        shareId={shareId}
        key={shareId}
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
      {NFTShareSection}
    </ScrollView>
  );
});

export default withLazy(PortfolioVer2);
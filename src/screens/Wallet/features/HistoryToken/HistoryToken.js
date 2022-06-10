import React from 'react';
import HistoryList from '@src/screens/Wallet/features/HistoryList';
import { historyTxsSelector } from '@src/redux/selectors/history';
import { useHistoryEffect } from '@src/screens/Wallet/features/History/History.useEffect';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import EmptyHistory from './HistoryToken.empty';

const HistoryToken = (props) => {
  const { histories, isEmpty, loading, refreshing, oversize } = useDebounceSelector(
    historyTxsSelector,
  );
  const { handleRefresh, handleCancelEtaHistory } = useHistoryEffect();
  return (
    <HistoryList
      {...props}
      histories={histories}
      onCancelEtaHistory={handleCancelEtaHistory}
      onRefreshHistoryList={handleRefresh}
      refreshing={refreshing}
      loading={loading}
      renderEmpty={() => <EmptyHistory />}
      showEmpty={isEmpty}
      oversize={oversize}
    />
  );
};

HistoryToken.propTypes = {};

export default React.memo(HistoryToken);

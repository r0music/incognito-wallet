import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import formatUtil from '@utils/format';
import {useNavigationParam} from 'react-navigation-hooks';
import {useSelector} from 'react-redux';
import {getHistoryByPairID} from '@screens/PDexV3/features/WithdrawRewardHistories/WithdrawRewardHistories.selector';
import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';

const enhance = WrappedComp => props => {
  const pairID = useNavigationParam('pairID');
  const history = useSelector(getHistoryByPairID)(pairID);
  const handleOpenLink = (txID) => {
    if (!txID) return;
    linkingService.openUrl(`${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txID}`,);
  };
  const hookFactories = React.useMemo(() => {
    const { requestTx, amount, token1, token2, respondTx, statusText } = history;
    return [
      {
        label: 'TxID',
        valueText: requestTx,
        copyable: true,
        openUrl: true,
        handleOpenLink: () => {
          handleOpenLink(requestTx);
        }
      },
      {
        label: 'RespondTx',
        valueText: respondTx,
        copyable: true,
        openUrl: true,
        disabled: !respondTx,
        handleOpenLink: () => {
          handleOpenLink(respondTx);
        }
      },
      {
        label: 'Amount',
        valueText: `${formatUtil.amountFull(amount, token1.pDecimals)} ${token1.symbol}`,
        disabled: !amount
      },
      {
        label: 'Status',
        valueText: statusText,
      },
      {
        label: 'Pair',
        valueText: `${token1.symbol}-${token2.symbol}`,
        disabled: !token1 || !token2
      },
    ];
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          hookFactories,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;

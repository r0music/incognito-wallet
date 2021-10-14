import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useNavigationParam} from 'react-navigation-hooks';
import {useSelector} from 'react-redux';
import {getHistoryByPairID} from '@screens/PDexV3/features/RemovePoolHistories/RemovePoolHistories.selector';
import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';
import formatUtil from '@utils/format';

const enhance = WrappedComp => props => {
  const pairID = useNavigationParam('pairID');
  const history = useSelector(getHistoryByPairID)(pairID);
  const handleOpenLink = (txID) => {
    if (!txID) return;
    linkingService.openUrl(`${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txID}`,);
  };

  const hookFactories = React.useMemo(() => {
    const { token1, token2, amount1, amount2, responseTx1, responseTx2, statusText, requestTx } = history;
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
        label: 'ResponseTx1',
        valueText: responseTx1,
        copyable: true,
        openUrl: true,
        disabled: !responseTx1,
        handleOpenLink: () => {
          handleOpenLink(responseTx1);
        }
      },
      {
        label: 'Amount1',
        valueText: `${formatUtil.amountFull(amount1, token1.pDecimals)} ${token1.symbol}`,
        disabled: !amount1
      },
      {
        label: 'Status',
        valueText: statusText,
      },
      {
        label: 'ResponseTx2',
        valueText: responseTx2,
        copyable: true,
        openUrl: true,
        disabled: !responseTx2,
        handleOpenLink: () => {
          handleOpenLink(responseTx2);
        }
      },
      {
        label: 'Amount2',
        valueText: `${formatUtil.amountFull(amount2, token2.pDecimals)} ${token2.symbol}`,
        disabled: !amount2
      }
    ];
  }, [history]);

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

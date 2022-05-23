import React from 'react';
import PropTypes from 'prop-types';
import withHistory from '@screens/Dex/features/HistoryContributeDetail/enhance';
import {Header} from '@src/components';
import { Hook } from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import { HEADER_TABS } from '@screens/Dex/Liquidity.constants';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';
import formatUtil from '@utils/format';
import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';
import { withLayout_2 } from '@components/Layout';
import { compose } from 'recompose';
import { ScrollView, View } from '@components/core';

const HistoryWithdrawDetail = React.memo(({ history, historyTab }) => {
  const getPrivacyDataByTokenID = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID);
  const handleOpenLink = (txID) => {
    if (!txID) return;
    linkingService.openUrlInSide(`${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txID}`,);
  };
  const renderWithdrawHistories = () => {
    const { tokenId1, tokenId2, amount1, amount2, responseTx1, responseTx2, statusText, requestTx } = history;
    const token1 = getPrivacyDataByTokenID(tokenId1);
    const token2 = getPrivacyDataByTokenID(tokenId2);
    const historyFactories = [
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
    return historyFactories.map(data => <Hook key={data?.label} {...data} />);
  };

  const renderWithdrawFeeHistories = () => {
    const { requestTx, amount, tokenId1, tokenId2, respondTx, statusText } = history;
    const token1 = getPrivacyDataByTokenID(tokenId1);
    const token2 = getPrivacyDataByTokenID(tokenId2);
    const historyFactories = [
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
    return historyFactories.map(data => <Hook key={data?.label} {...data} />);
  };
  return (
    <>
      <Header title="Liquidity" />
      <View fullFlex borderTop paddingHorizontal>
        {historyTab === HEADER_TABS.Remove ? renderWithdrawHistories() : renderWithdrawFeeHistories()}
      </View>
    </>
  );
});

HistoryWithdrawDetail.propTypes = {
  history: PropTypes.object.isRequired,
  historyTab: PropTypes.string.isRequired
};


export default compose(
  withHistory,
  withLayout_2,
)(HistoryWithdrawDetail);

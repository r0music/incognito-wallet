import React, {memo} from 'react';
import {ScrollView} from 'react-native';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, Row} from '@src/components';
import {useNavigationParam} from 'react-navigation-hooks';
import flatten from 'lodash/flatten';
import {Hook} from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';
import {ButtonBasic} from '@components/Button';
import withContributeDetail
  from '@screens/PDexV3/features/LiquidityHistories/LiquidityHistories.enhanceContributeDetail';
import {ACCOUNT_CONSTANT} from 'incognito-chain-web-js/build/wallet';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';
import { View } from '@components/core';
import { BtnSecondary } from '@components/core/Button';
import styled from './LiquidityHistories.styled';

const ContributeDetail = ({ handleRefund, handleRetry }) => {
  const history = useNavigationParam('history');
  const { refundData, retryData } = history;
  const handleOpenLink = (txID) => {
    if (!txID) return;
    linkingService.openUrl(`${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txID}`,);
  };
  const onRefundTx = () => {
    const { tokenId, poolId, pairHash, nftId, amp } = refundData;
    const params = {
      fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
      tokenID: tokenId,
      poolPairID: poolId || '',
      pairHash,
      nftID: nftId,
      amplifier: amp || 0,
    };
    handleRefund(params);
  };

  const onRetryTx = () => {
    const { tokenId, poolId, pairHash, nftId, amp, amount } = refundData;
    const params = {
      fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
      tokenID: tokenId,
      poolPairID: poolId || '',
      pairHash,
      nftID: nftId,
      amplifier: amp || 0,
      amount,
    };
    handleRetry(params);
  };
  const hookFactories = React.useMemo(() => {
    const { pairId, poolId, statusStr, contributes, storageValue, timeStr, returnValue, statusColor } = history;
    const headHook = [
      {
        label: 'PoolId',
        valueText: poolId,
        copyable: true,
        disabled: !poolId,
      },
      {
        label: 'PairId',
        valueText: pairId,
        disabled: !pairId,
        copyable: true,
      },
      {
        label: 'Status',
        valueText: statusStr,
        rightColor: statusColor,
      },
      {
        label: 'Time',
        valueText: timeStr,
      },
    ];
    const contributeHook = [...contributes, ...storageValue].map((item, index) => {
      index += 1;
      return [
        {
          label: `TxID${index}`,
          valueText: item.requestTx,
          copyable: true,
          openUrl: true,
          handleOpenLink: () => {
            handleOpenLink(item.requestTx);
          }
        },
        {
          label: `Amount ${index}`,
          valueText: item.contributeAmountSymbolStr,
        },
      ];
    });
    const refunds = (returnValue || []).map((item, index) => ([
      {
        label: `RefundTxID${index + 1}`,
        valueText: item.respondTx,
        disabled: !item.respondTx,
        copyable: true,
        openUrl: true,
        handleOpenLink: () => {
          handleOpenLink(item.respondTx);
        }
      },
      {
        label: `Refund ${index + 1}`,
        valueText: item.returnAmountSymbolStr,
        disabled: !item.returnAmount,
      },
    ]));
    return [...headHook, ...flatten(contributeHook), ...flatten(refunds)];
  }, [history]);
  return (
    <>
      <Header title="Detail" />
      <View borderTop style={mainStyle.container}>
        <ScrollView contentContainerStyle={{ paddingTop: 12 }}>
          {hookFactories.map(data => (
            <Hook
              key={data?.label}
              {...data}
              labelStyle={styled.leftText}
              valueTextStyle={[styled.rightText, !!data.rightColor && { color: data?.rightColor }]}
              style={{ marginTop: 8 }}
            />
          ))}
          {!!refundData && (
            <Row spaceBetween style={{ marginTop: 15 }}>
              {!!retryData && (
                <BtnSecondary
                  title={retryData.title}
                  wrapperStyle={{ flex: 1, marginRight: 20 }}
                  onPress={onRetryTx}
                />
              )}
              <ButtonBasic
                title={refundData.title}
                btnStyle={{ flex: 1 }}
                onPress={onRefundTx}
              />
            </Row>
          )}
        </ScrollView>
      </View>
    </>
  );
};

ContributeDetail.propTypes = {
  handleRefund: PropTypes.func.isRequired,
  handleRetry: PropTypes.func.isRequired,
};

export default compose(
  withContributeDetail,
  withLayout_2,
)(memo(ContributeDetail));

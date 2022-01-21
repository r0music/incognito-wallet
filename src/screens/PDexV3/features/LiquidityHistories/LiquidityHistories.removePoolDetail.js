import React, {memo} from 'react';
import { ScrollView } from 'react-native';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import {Hook} from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import {useNavigationParam} from 'react-navigation-hooks';
import {openLink} from '@components/UseEffect/useLink';
import styled from '@screens/PDexV3/features/LiquidityHistories/LiquidityHistories.styled';
import { withLayout_2 } from '@components/Layout';
import { View } from '@components/core';

const RemoveLPDetail = () => {
  const history = useNavigationParam('history');
  const hookFactories = React.useMemo(() => {
    const { requestTx, poolId, nftId, statusStr, timeStr, removeData, respondTxs, statusColor } = history;
    const headHook = [
      {
        label: 'PoolID',
        valueText: poolId,
        copyable: true,
      },
      {
        label: 'TicketID',
        valueText: nftId,
        copyable: true,
      },
      {
        label: 'TxID',
        valueText: requestTx,
        copyable: true,
        openUrl: true,
        handleOpenLink: () => {
          openLink({ txID: requestTx });
        }
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
    const responseHook = (respondTxs || []).map((txID) => ({
      label: 'Response',
      valueText: txID,
      copyable: true,
      openUrl: true,
      handleOpenLink: () => {
        openLink({ txID: txID });
      }
    }));
    const amountHook = removeData.map(({ removeAmountSymbolStr: amount, removeAmount }, index) => ({
      label: `Amount ${index + 1}`,
      valueText: amount,
      disabled: !removeAmount
    }));
    return [...headHook, ...responseHook, ...amountHook];
  }, [history]);
  return (
    <>
      <Header title="Detail" />
      <View borderTop style={mainStyle.container}>
        <ScrollView>
          {hookFactories.map(data => (
            <Hook
              key={data?.label}
              {...data}
              labelStyle={styled.leftText}
              valueTextStyle={[styled.rightText, !!data.rightColor && { color: data?.rightColor }]}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default withLayout_2(memo(RemoveLPDetail));

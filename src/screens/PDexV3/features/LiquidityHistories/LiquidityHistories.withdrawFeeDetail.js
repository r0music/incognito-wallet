import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import {useNavigationParam} from 'react-navigation-hooks';
import {openLink} from '@components/UseEffect/useLink';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import {Hook} from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import styled from '@screens/PDexV3/features/LiquidityHistories/LiquidityHistories.styled';

const WithdrawFeeLPDetail = () => {
  const history = useNavigationParam('history');
  const hookFactories = React.useMemo(() => {
    const { requestTx, poolId, nftId, statusStr, timeStr, withdrawData, respondTxs } = history;
    const headHook = [
      {
        label: 'PoolID',
        valueText: poolId,
        copyable: true,
      },
      {
        label: 'NFTID',
        valueText: nftId,
        copyable: true,
      },
      {
        label: 'TxID',
        valueText: requestTx,
        copyable: true,
        openUrl: true,
        handleOpenLink: () => {
          openLink(requestTx);
        }
      },
      {
        label: 'Status',
        valueText: statusStr,
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
        openLink(txID);
      }
    }));
    const amountHook = (withdrawData || []).map(({ withdrawAmountSymbolStr: amount, withdrawAmount }, index) => ({
      label: `Amount${index + 1}`,
      valueText: amount,
      disabled: !withdrawAmount
    }));
    return [...headHook, ...responseHook, ...amountHook];
  }, [history]);
  return (
    <View style={mainStyle.container}>
      <Header title="Detail" />
      <ScrollView>
        {hookFactories.map(data => (
          <Hook
            key={data?.label}
            {...data}
            labelStyle={styled.leftText}
            valueTextStyle={styled.rightText}
          />
        ))}
      </ScrollView>
    </View>
  );
};

WithdrawFeeLPDetail.propTypes = {};

export default memo(WithdrawFeeLPDetail);

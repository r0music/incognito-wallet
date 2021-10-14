import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import {useNavigationParam} from 'react-navigation-hooks';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, Row} from '@src/components';
import {STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';
import {Hook} from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import {Text} from '@components/core';
import {itemStyle as itemStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {Icon} from '@components/Token/Token.shared';

const HistoryDetail = () => {
  const { requestTx, respondTx, typeStr, amountStr, statusStr, nftid: nftId, timeStr, token, statusColor } = useNavigationParam('data');
  const handleOpenLink = (txID) => {
    if (!txID) return;
    linkingService.openUrl(`${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txID}`,);
  };
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
      label: 'Type',
      valueText: typeStr,
    },
    {
      label: 'Status',
      valueText: statusStr,
      valueTextStyle: [itemStyled.mediumTitle, { color: statusColor }]
    },
    {
      label: 'NFTID',
      valueText: nftId,
      copyable: true,
      disabled: !nftId
    },
    {
      label: 'Time',
      valueText: timeStr,
    },
  ];
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.history} />
      <Row spaceBetween centerVertical style={{ marginTop: 16, marginBottom: 24 }}>
        <Row centerVertical>
          <Icon iconUrl={token.iconUrl} style={itemStyled.image} />
          <Text style={[itemStyled.title, { marginLeft: 12 }]}>{token.symbol}</Text>
        </Row>
        <Text style={itemStyled.title}>{amountStr}</Text>
      </Row>
      <ScrollView>
        {historyFactories.map(data => (
          <Hook
            key={data?.label}
            labelStyle={itemStyled.mediumTitle}
            valueTextStyle={itemStyled.mediumTitle}
            {...data}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default memo(HistoryDetail);

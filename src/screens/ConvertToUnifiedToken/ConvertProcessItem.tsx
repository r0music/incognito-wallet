import { ActivityIndicator, Text } from '@src/components/core';
import { COLORS } from '@src/styles';
import format from '@utils/format';
import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { PTokenConvert } from './state/models';

export type ConvertProcessItemProps = {
  style?: ViewStyle;
  pTokenData: PTokenConvert;
};

export const ConvertProcessItem: React.FC<ConvertProcessItemProps> = ({
  pTokenData,
  style,
}) => {
  const getConvertStatusTextAndColor = () => {
    if (pTokenData?.convertStatus === 'SUCCESSFULLY') {
      return {
        statusText: 'Success',
        color: COLORS.green1,
      };
    }
    if (pTokenData?.convertStatus === 'FAILED') {
      return {
        statusText: 'Failed',
        color: COLORS.red,
      };
    }
    if (pTokenData?.convertStatus === 'PROCESSING') {
      return {
        statusText: 'Converting...',
        color: COLORS.white,
      };
    }
    if (pTokenData?.convertStatus === 'PENDING') {
      return {
        statusText: 'Pending',
        color: COLORS.white,
      };
    }
    return {
      statusText: 'Pending',
      color: COLORS.white,
    };
  };

  const statusText = getConvertStatusTextAndColor().statusText;
  const statusColor = getConvertStatusTextAndColor().color;

  return (
    <View style={[tokenConvertContainerStyle, style]}>
      <View>
        <Text style={labelStyle}>From</Text>
        <View style={rowStyle}>
          <Text style={amountStyle}>
            {format.amountVer2(pTokenData?.balance, pTokenData?.pDecimals)}{' '}
            {pTokenData?.symbol}
          </Text>
          <View style={networkBoxContainer}>
            <Text>{pTokenData?.network}</Text>
          </View>
        </View>
      </View>
      <View style={lineStyle} />
      <View>
        <Text style={labelStyle}>To</Text>
        <View style={rowStyle}>
          <Text style={amountStyle}>
            {format.amountVer2(pTokenData?.balance, pTokenData?.pDecimals)}{' '}
            {pTokenData?.parentUnifiedTokenSymbol}
          </Text>
          <View style={networkBoxContainer}>
            <Text>Unified</Text>
          </View>
        </View>
      </View>

      <View style={lineStyle} />
      <View style={statusBoxContainer}>
        <Text style={statusLabel}>Status</Text>
        <View style={rowStyle}>
          {pTokenData?.convertStatus === 'PROCESSING' && (
            <ActivityIndicator style={indicatorStyle} />
          )}
          <Text style={{ color: statusColor }}>{statusText}</Text>
        </View>
      </View>
    </View>
  );
};

const tokenConvertContainerStyle: ViewStyle = {
  padding: 16,
  backgroundColor: COLORS.gray1,
  borderRadius: 8,
};

const rowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const networkBoxContainer: ViewStyle = {
  backgroundColor: COLORS.gray2,
  borderRadius: 4,
  paddingHorizontal: 8,
  paddingVertical: 4,
};

const lineStyle: ViewStyle = {
  width: '100%',
  height: 1,
  backgroundColor: '#484848',
  marginVertical: 12,
};

const labelStyle: TextStyle = {
  color: COLORS.lightGrey36,
  fontSize: 12,
  lineHeight: 18,
  fontWeight: '400',
};

const amountStyle: TextStyle = {
  fontSize: 18,
  lineHeight: 27,
  fontWeight: '500',
};

const statusLabel: TextStyle = {
  color: COLORS.lightGrey36,
  fontSize: 14,
  fontWeight: '400',
  lineHeight: 21,
};

const statusBoxContainer: ViewStyle = {
  ...rowStyle,
  justifyContent: 'space-between',
};

const indicatorStyle: ViewStyle = {
  marginRight: 8,
};

import { ImageCached } from '@src/components';
import { Text, TouchableOpacity } from '@src/components/core';
import { CheckIcon, SquareIcon } from '@src/components/Icons';
import { CONSTANT_CONFIGS } from '@src/constants';
import { COLORS } from '@src/styles';
import format from '@utils/format';
import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { ImageStyle } from 'react-native-fast-image';
import convert from '@src/utils/convert';
import { PTokenConvert, TokenConvert } from './state/models';

export type ConvertItemProps = {
  selected: boolean;
  onSelect: () => void;
  unifiedTokenData: TokenConvert;
  style?: ViewStyle;
};

export const ConvertItem: React.FC<ConvertItemProps> = ({
  selected = false,
  onSelect,
  unifiedTokenData,
  style,
}: ConvertItemProps) => {
  const uri = `${CONSTANT_CONFIGS.CRYPTO_ICON_URL}/${unifiedTokenData.symbol}.png`;

  let unifiedTokenAmount = unifiedTokenData?.listUnifiedToken
    .map((item) => parseFloat(format.amountVer2(item?.balance, item?.pDecimals)))
    .reduce((prevValue, nextValue) => prevValue + nextValue);


  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onSelect}
      style={[
        selected
          ? tokenConvertSelectedContainerStyle
          : tokenConvertContainerStyle,
        style,
      ]}
    >
      {/* Render Unified Token Icon */}
      <View style={rowStyle}>
        <ImageCached uri={uri} style={tokenLogoStyle} />
        <View>{selected ? <CheckIcon /> : <SquareIcon />}</View>
      </View>

      {/* Render Unified Token Info */}
      <View style={pUnifiedTokenInfoContainerStyle}>
        <Text style={pUnifiedTokenTextStyle}>{unifiedTokenData?.symbol}</Text>
        <Text style={pUnifiedTokenTextStyle}>
          {convert.toPlainString(unifiedTokenAmount)} {unifiedTokenData?.symbol}
        </Text>
      </View>

      {/* Render list pToken of unified token */}
      {unifiedTokenData?.listUnifiedToken?.map(
        (item: PTokenConvert, i: number) => {
          return (
            <View key={i} style={pTokenContainerStyle}>
              <View style={rowStyle}>
                <Text style={pTokenTextStyle}>{item?.symbol}</Text>
                <View style={networkContainerStyle}>
                  <Text style={networkTextStyle}>{item?.network}</Text>
                </View>
              </View>
              <Text style={pTokenTextStyle}>
                {format.amountVer2(item?.balance, item?.pDecimals)}{' '}
                {item?.symbol}
              </Text>
            </View>
          );
        },
      )}
    </TouchableOpacity>
  );
};

const tokenConvertContainerStyle: ViewStyle = {
  padding: 16,
  backgroundColor: COLORS.gray1,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: COLORS.gray1,
};

const tokenConvertSelectedContainerStyle: ViewStyle = {
  ...tokenConvertContainerStyle,
  borderColor: COLORS.white,
};

const rowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const tokenLogoStyle: ImageStyle = {
  width: 32,
  height: 32,
  borderRadius: 16,
};

const pUnifiedTokenInfoContainerStyle: ViewStyle = {
  ...rowStyle,
  marginVertical: 8,
};

const pUnifiedTokenTextStyle: TextStyle = {
  fontSize: 18,
  fontWeight: '500',
};

const pTokenContainerStyle: ViewStyle = {
  ...rowStyle,
  marginTop: 6,
};

const pTokenTextStyle: TextStyle = {
  color: COLORS.lightGrey35,
  fontSize: 14,
  fontWeight: '400',
  lineHeight: 21,
};

const networkContainerStyle: ViewStyle = {
  backgroundColor: COLORS.gray2,
  borderRadius: 4,
  marginLeft: 8,
  paddingHorizontal: 4,
  paddingVertical: 3,
};

const networkTextStyle: TextStyle = {
  fontSize: 12,
  fontWeight: '500',
};

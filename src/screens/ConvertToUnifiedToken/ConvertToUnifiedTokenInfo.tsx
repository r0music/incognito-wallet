import { ScrollViewBorder, Text3 } from '@components/core';
import Header from '@src/components/Header';
import { withLayout_2 } from '@src/components/Layout';
import { FONT } from '@src/styles';
import React from 'react';
import { TextStyle } from 'react-native';

const ConvertToUnifiedTokenInfo: React.FC = () => {
  return (
    <>
      <Header title="Convert coins info" />
      <ScrollViewBorder showsVerticalScrollIndicator={false}>
        <Text3 style={contentTextStyle}>
          A unified pToken is a pToken which can be used regardless of its
          network. It enhances the cross-chain trading experience thanks to
          flexibility, convenience, and higher liquidity.{'\n\n'}For example,
          pETH on Ethereum and pETH on Binance Smart Chain can be unified into
          Unified pETH. Consequently, the Unified pETH can be swapped in all
          available pApps or be unshielded to supported blockchains.
        </Text3>
      </ScrollViewBorder>
    </>
  );
};

export default withLayout_2(ConvertToUnifiedTokenInfo);

const contentTextStyle: TextStyle = {
  ...FONT.STYLE.medium,
  lineHeight: 25,
  fontSize: FONT.SIZE.regular,
  marginBottom: 16,
};

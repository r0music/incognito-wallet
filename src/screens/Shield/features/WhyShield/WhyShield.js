import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { withLayout_2 } from '@src/components/Layout';
import Header from '@src/components/Header';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    marginTop: 22,
  },
  text: {
    color: COLORS.colorGreyBold,
    fontFamily: FONT.NAME.specialMedium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 4,
    marginBottom: 22,
  },
  title: {
    fontFamily: FONT.NAME.specialBold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    color: COLORS.black,
    marginBottom: 5,
  },
});

const WhyShield = () => {
  return (
    <View style={styled.container}>
      <Header title="What happens to your deposit" />
      <ScrollView style={styled.scrollview}>
        <Text style={styled.text}>
          To transact anonymously, first you have to deposit your crypto. When
          you send coins to be deposited, an identical – but 100% private –
          version is generated. If you withdraw your coins from the Incognito
          network, this privacy version will be burned, and the original will be
          returned. All original coins are stored safely using the methods
          below:
        </Text>
        <Text style={styled.title}>Trustless bridge for Ethereum</Text>
        <Text style={styled.text}>
          For ETH and all ERC20 tokens, your crypto is safely secured in a
          trustless smart contract.
        </Text>
        <Text style={styled.title}>Portal for Bitcoin and Binance Smart Chain</Text>
        <Text style={styled.text}>
          Decentralized custodians hold deposited tokens, supplying collateral as a bond. Portal is designed as a general bridge, and will continue to branch out to any blockchains that need privacy.
        </Text>
      </ScrollView>
    </View>
  );
};

WhyShield.propTypes = {};

export default withLayout_2(WhyShield);

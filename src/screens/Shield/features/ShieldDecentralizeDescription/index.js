import React, { memo } from 'react';
import { ScrollViewBorder, Text, View } from '@components/core';
import { View2 } from '@components/core/View';
import { styled } from '@screens/Shield/features/ShieldDecentralizeDescription/styled';
import Header from '@components/Header/Header';
import { withLayout_2 } from '@components/Layout';
import { useSelector } from 'react-redux';
import { childSelectedPrivacySelector } from '@src/redux/selectors';

const CONTENTS = (network) => {
  return [
    {
      content: `The shielding process is a cross-chain action, and requires an ${network} smart contract interaction.\n`,
    },
    {
      content: `The fee is the cost of this interaction. Paid to the ${network} miners, it is based on current gas prices on the ${network} network\n`,
    },
    {
      content:
        'The shielding process will complete when the amount shielded is sufficient to cover the required gas fees.\n',
    },
  ];
};

const ShieldDecentralizeDescription = () => {
  const selectedPrivacy = useSelector(
    childSelectedPrivacySelector.childSelectedPrivacy,
  );
  return (
    <View2 style={styled.container}>
      <Header
        title={`Shield ${
          selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol
        }`}
      />
      <ScrollViewBorder>
        <View style={styled.wrapper}>
          {CONTENTS(selectedPrivacy?.rootNetworkName).map((item, index) => (
            <Text style={styled.content} key={`content-${index}`}>
              {item.content}
            </Text>
          ))}
        </View>
      </ScrollViewBorder>
    </View2>
  );
};

export default withLayout_2(memo(ShieldDecentralizeDescription));

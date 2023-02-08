import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@src/components/core';
import { useSelector } from 'react-redux';
// import { colorsSelector } from '@src/theme';
import { FONT, COLORS } from '@src/styles';
import { useFaucet } from '@src/components/Modal/features/FaucetPRVModal';
import { getEsimateTradeError, validatePRVNetworkFee, inputAmountSelector } from './Swap.selector';
import { formConfigs } from './Swap.constant';

const styled = StyleSheet.create({
  container: {
    marginTop: 6,
    marginBottom: 0,
  },
  text: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 7,
    color: COLORS.red,
    marginRight: 5,
  },
});

const EstimateTradeError = () => {
  // const colors = useSelector(colorsSelector);
  const error = useSelector(getEsimateTradeError);
  const [navigateFaucet] = useFaucet();
  const errorNetworkFeeMessage = useSelector(validatePRVNetworkFee);
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const { amountText } = sellInputAmount;
  if (!error && !errorNetworkFeeMessage ) return null;

  // if (!error) return null;
  if (error) {
    return (
      <View style={styled.container}>
        <Text style={styled.text}>{error}</Text>
      </View>
    );
  }

  // estimate done = amountText have a value!
  if (errorNetworkFeeMessage && amountText.length > 0) {
    return (
      <View style={styled.container}>
        <Text style={styled.text}>{errorNetworkFeeMessage}
          <Text
            style={[styled.text, {textDecorationLine: 'underline'} ]}
            onPress={() => {
              navigateFaucet();
            }}
          >
          Faucet.
          </Text>
        </Text>
      </View>
    );
  }
  return null;
};

EstimateTradeError.propTypes = {};

export default React.memo(EstimateTradeError);

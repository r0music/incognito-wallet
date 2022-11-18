import { Text } from '@src/components/core';
import { PRV } from '@src/constants/common';
import { getPrivacyDataByTokenID } from '@src/redux/selectors/selectedPrivacy';
import routeNames from '@src/router/routeNames';
import { COLORS, FONT } from '@src/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { useSelector } from 'react-redux';
import { feeErorSelector, swapInfoSelector } from './Swap.selector';

const styled = StyleSheet.create({
  container: {
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

const FeeError = () => {
  const swapInfo = useSelector(swapInfoSelector);
  const error = useSelector(feeErorSelector);
  const privacyPRVData = useSelector(getPrivacyDataByTokenID)(PRV.id);
  const navigation = useNavigation();
  const { isFetching } = swapInfo;
  if (!error || isFetching) return null;

  const onMessagePress = () => {
    navigation.navigate(routeNames.ChooseNetworkForShield, {
      tokenSelected: privacyPRVData,
    });
  };

  return (
    <View style={styled.container}>
      <Text style={styled.text} onPress={onMessagePress}>
        {`Your ${PRV.symbol} balance is insufficient.`}&nbsp;
        <Text style={[styled.text, { textDecorationLine: 'underline' }]}>
          Add funds
        </Text>
      </Text>
    </View>
  );
};

FeeError.propTypes = {};

export default React.memo(FeeError);

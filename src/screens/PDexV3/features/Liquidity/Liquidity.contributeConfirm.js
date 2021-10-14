import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import {formConfigsContribute, LIQUIDITY_MESSAGES} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import {Extra} from '@screens/PDexV3/features/Liquidity/Liquidity.contribute';
import {useSelector} from 'react-redux';
import {contributeSelector} from '@screens/PDexV3/features/Liquidity/index';
import {ButtonTrade} from '@components/Button';
import withTransaction from '@screens/PDexV3/features/Liquidity/Liquidity.enhanceTransaction';
import PropTypes from 'prop-types';

const Confirm = React.memo(({ onCreateContributes, error }) => {
  const amountSelector = useSelector(contributeSelector.inputAmountSelector);
  const inputAmount = amountSelector(formConfigsContribute.formName, formConfigsContribute.inputToken);
  const outputAmount = amountSelector(formConfigsContribute.formName, formConfigsContribute.outputToken);
  const { feeAmount } = useSelector(contributeSelector.feeAmountSelector);
  const poolId = useSelector(contributeSelector.poolIDSelector);
  const { amp, nftId } = useSelector(contributeSelector.mappingDataSelector);
  const createContributes = async () => {
    if (typeof onCreateContributes !== 'function') return;
    onCreateContributes({
      fee: feeAmount / 2,
      tokenId1: inputAmount.tokenId,
      tokenId2: outputAmount.tokenId,
      amount1: inputAmount.originalInputAmount,
      amount2: outputAmount.originalInputAmount,
      poolPairID: poolId,
      amp,
      nftId,
    });
  };

  return (
    <View style={mainStyle.container}>
      <Header title={LIQUIDITY_MESSAGES.addLiquidity} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={mainStyle.mainInfo}>
          <Text style={mainStyle.bigText}>Add</Text>
          <Text style={mainStyle.bigText}>{`${inputAmount.inputAmountSymbolStr} + ${outputAmount.inputAmountSymbolStr}`}</Text>
        </View>
        <Extra />
        {!!error && <Text style={mainStyle.error}>{error}</Text>}
        <ButtonTrade
          btnStyle={mainStyle.button}
          title={LIQUIDITY_MESSAGES.addLiquidity}
          onPress={createContributes}
        />
      </ScrollView>
    </View>
  );
});

Confirm.propTypes = {
  onCreateContributes: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired
};

export default withTransaction(Confirm);

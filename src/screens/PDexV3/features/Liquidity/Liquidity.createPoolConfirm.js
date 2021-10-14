import React, {memo} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import {formConfigsCreatePool, LIQUIDITY_MESSAGES} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import {ButtonTrade} from '@components/Button';
import {Extra} from '@screens/PDexV3/features/Liquidity/Liquidity.createPool';
import {useSelector} from 'react-redux';
import {createPoolSelector} from '@screens/PDexV3/features/Liquidity/index';
import withTransaction from '@screens/PDexV3/features/Liquidity/Liquidity.enhanceTransaction';
import PropTypes from 'prop-types';

const Confirm = ({ onCreateNewPool , error}) => {
  const amountSelector = useSelector(createPoolSelector.inputAmountSelector);
  const inputAmount = amountSelector(formConfigsCreatePool.formName, formConfigsCreatePool.inputToken);
  const outputAmount = amountSelector(formConfigsCreatePool.formName, formConfigsCreatePool.outputToken);
  const { feeAmount } = useSelector(createPoolSelector.feeAmountSelector);
  const { amp } = useSelector(createPoolSelector.ampValueSelector);
  const createNewPool = async () => {
    if (typeof onCreateNewPool !== 'function') return;
    onCreateNewPool({
      fee: feeAmount / 2,
      tokenId1: inputAmount.tokenId,
      tokenId2: outputAmount.tokenId,
      amount1: inputAmount.originalInputAmount,
      amount2: outputAmount.originalInputAmount,
      amp,
    });
  };

  return (
    <View style={mainStyle.container}>
      <Header title={LIQUIDITY_MESSAGES.createPool} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={mainStyle.mainInfo}>
          <Text style={mainStyle.bigText}>Add</Text>
          <Text style={mainStyle.bigText}>{`${inputAmount.inputAmountSymbolStr} + ${outputAmount.inputAmountSymbolStr}`}</Text>
        </View>
        <Extra />
        {!!error && <Text style={mainStyle.error}>{error}</Text>}
        <ButtonTrade
          btnStyle={mainStyle.button}
          title={LIQUIDITY_MESSAGES.createPool}
          onPress={createNewPool}
        />
      </ScrollView>
    </View>
  );
};

Confirm.propTypes = {
  onCreateNewPool: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired
};

export default withTransaction(memo(Confirm));

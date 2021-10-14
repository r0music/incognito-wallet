import React, {memo} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import {
  formConfigsRemovePool,
  LIQUIDITY_MESSAGES
} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import {Extra} from '@screens/PDexV3/features/Liquidity/Liquidity.removePool';
import {ButtonTrade} from '@components/Button';
import PropTypes from 'prop-types';
import withTransaction from '@screens/PDexV3/features/Liquidity/Liquidity.enhanceTransaction';
import {useSelector} from 'react-redux';
import {removePoolSelector} from '@screens/PDexV3/features/Liquidity/index';

const Confirm = ({ onRemoveContribute, error }) => {
  const amountSelector = useSelector(removePoolSelector.inputAmountSelector);
  const { feeAmount } = useSelector(removePoolSelector.feeAmountSelector);
  const poolId = useSelector(removePoolSelector.poolIDSelector);
  const { nftId } = useSelector(removePoolSelector.shareDataSelector);
  const inputAmount = amountSelector(formConfigsRemovePool.formName, formConfigsRemovePool.inputToken);
  const outputAmount = amountSelector(formConfigsRemovePool.formName, formConfigsRemovePool.outputToken);
  const removeContributes = async () => {
    if (typeof onRemoveContribute !== 'function') return;
    onRemoveContribute({
      fee: feeAmount,
      poolTokenIDs: [inputAmount.tokenId, outputAmount.tokenId],
      poolPairID: poolId,
      shareAmount: inputAmount.withdraw,
      nftID: nftId,
    });
  };
  return (
    <View style={mainStyle.container}>
      <Header title={LIQUIDITY_MESSAGES.removePool} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={mainStyle.mainInfo}>
          <Text style={mainStyle.bigText}>Remove</Text>
          <Text style={mainStyle.bigText}>{`${inputAmount.inputAmountSymbolStr} + ${outputAmount.inputAmountSymbolStr}`}</Text>
        </View>
        <Extra />
        {!!error && <Text style={mainStyle.error}>{error}</Text>}
        <ButtonTrade
          btnStyle={mainStyle.button}
          title={LIQUIDITY_MESSAGES.removePool}
          onPress={removeContributes}
        />
      </ScrollView>
    </View>
  );
};

Confirm.propTypes = {
  onRemoveContribute: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired
};

export default withTransaction(memo(Confirm));

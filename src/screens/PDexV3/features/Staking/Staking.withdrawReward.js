import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, LoadingContainer, RowSpaceText} from '@src/components';
import {
  formConfigsWithdrawReward,
  STAKING_MESSAGES
} from '@screens/PDexV3/features/Staking/Staking.constant';
import {createForm, RFTradeInputAmount as TradeInputAmount} from '@components/core/reduxForm';
import {RoundCornerButton, Text} from '@components/core';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {useDispatch, useSelector} from 'react-redux';
import {change, Field} from 'redux-form';
import {
  stakingFeeSelector,
  withdrawRewardDisable,
  withdrawRewardInputAmount,
  withdrawRewardValidate
} from '@screens/PDexV3/features/Staking/Staking.selector';
import withInput from '@screens/PDexV3/features/Staking/Staking.enhanceInput';
import {useError} from '@components/UseEffect/useError';
import {stakingSelector} from '@screens/PDexV3/features/Staking/index';

const initialFormValues = {
  input: ''
};

const Form = createForm(formConfigsWithdrawReward.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const Input = React.memo(({ onWithdrawMaxReward }) => {
  const dispatch = useDispatch();
  const inputValidate = useSelector(withdrawRewardValidate);
  const error = useError(inputValidate());
  const { maxDepositText } = useSelector(withdrawRewardInputAmount);
  const onChangeText = (text) => dispatch(change(formConfigsWithdrawReward.formName, formConfigsWithdrawReward.input, text));
  const onChangeWithdrawMax = () => onWithdrawMaxReward(maxDepositText);
  React.useEffect(() => { onChangeWithdrawMax(); }, []);
  return(
    <>
      <Field
        component={TradeInputAmount}
        name={formConfigsWithdrawReward.input}
        onChange={onChangeText}
        editableInput={false}
        hasInfinityIcon={false}
        onPressInfinityIcon={onChangeWithdrawMax}
      />
      <Text style={coinStyled.error}>{error}</Text>
    </>
  );
});

const CustomInput = withInput(Input);

const StakingWithdrawReward = () => {
  const coin = useSelector(stakingSelector.withdrawRewardCoinSelector);
  const fee = useSelector(stakingFeeSelector);
  const disabled = useSelector(withdrawRewardDisable);
  const renderContent = () => {
    if (!coin) return <LoadingContainer />;
    const { token, userBalanceSymbolStr } = coin;
    const { feeAmountSymbolStr, useFeeBalanceSymbolStr, feeToken } = fee;
    return (
      <Form>
        {() => (
          <>
            <CustomInput />
            <RoundCornerButton
              title={STAKING_MESSAGES.withdrawSymbol(token.symbol)}
              style={coinStyled.button}
              disabled={disabled}
            />
            {(token.tokenId !== feeToken.tokenId) && (<RowSpaceText label="Balance" value={userBalanceSymbolStr} />)}
            <RowSpaceText label="Balance" value={useFeeBalanceSymbolStr} />
            <RowSpaceText label="Fee" value={feeAmountSymbolStr} />
          </>
        )}
      </Form>
    );
  };
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.withdraw} />
      <View style={coinStyled.coinContainer}>
        {renderContent()}
        <Text style={coinStyled.coinExtra}>
          Your rewards counter will restart from zero.
          Please wait a couple of minutes for your main
          balance to update.
        </Text>
      </View>
    </View>
  );
};

Input.propTypes = {
  onWithdrawMaxReward: PropTypes.func.isRequired
};

export default React.memo(StakingWithdrawReward);

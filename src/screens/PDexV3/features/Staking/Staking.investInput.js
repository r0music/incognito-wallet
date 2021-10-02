import React, {memo} from 'react';
import {View} from 'react-native';
import {createForm, RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import {formConfigsInvest, STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import {useDispatch, useSelector} from 'react-redux';
import {change, Field} from 'redux-form';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import Header from '@components/Header/Header';
import {
  investCoinSelector,
  investInputValidate,
  investInputAmount, investDisable
} from '@screens/PDexV3/features/Staking/Staking.selector';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {RoundCornerButton, Text} from '@components/core';
import {LoadingContainer} from '@src/components';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import withInput from '@screens/PDexV3/features/Staking/Staking.enhanceInput';
import PropTypes from 'prop-types';

const initialFormValues = {
  input: ''
};

const Form = createForm(formConfigsInvest.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const Input = React.memo(({ onInvestMax }) => {
  const dispatch = useDispatch();
  const { maxDepositText, token } = useSelector(investInputAmount);
  const inputValidate = useSelector(investInputValidate);
  const onChangeText = (text) => dispatch(change(formConfigsInvest.formName, formConfigsInvest.input, text));
  const onChangeMaxInvest = () => onInvestMax(maxDepositText);
  return(
    <Field
      component={TradeInputAmount}
      name={formConfigsInvest.input}
      hasInfinityIcon
      validate={[
        ...validator.combinedAmount,
        inputValidate,
      ]}
      symbol={token && token?.symbol}
      onChange={onChangeText}
      editableInput
      canSelectSymbol
      onPressInfinityIcon={onChangeMaxInvest}
      onPressSymbol={() => {}}
    />
  );
});

const CustomInput = withInput(Input);

const StakingMoreInput = () => {
  const navigation = useNavigation();
  const coin = useSelector(investCoinSelector);
  const disable = useSelector(investDisable);
  const navigateConfirm = () => navigation.navigate(routeNames.StakingMoreConfirm);
  const renderContent = () => {
    if (!coin) return <LoadingContainer />;
    return (
      <Form>
        {() => (
          <>
            <Text
              style={{ textAlign: 'right', color: '#858383', fontSize: 12, lineHeight: 18, marginBottom: 8 }}
            >{`Balance: ${coin.userBalanceSymbolStr}`}
            </Text>
            <CustomInput />
            <RoundCornerButton
              title={STAKING_MESSAGES.staking}
              style={coinStyled.button}
              disabled={disable}
              onPress={navigateConfirm}
            />
          </>
        )}
      </Form>
    );
  };
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.staking} />
      <View style={coinStyled.coinContainer}>
        {renderContent()}
      </View>
    </View>
  );
};

Input.propTypes = {
  onInvestMax: PropTypes.func.isRequired
};

export default memo(StakingMoreInput);

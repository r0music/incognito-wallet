import React from 'react';
import { FONT, COLORS } from '@src/styles';
import { View, StyleSheet } from 'react-native';
import { Row } from '@src/components';
import {
  RFTradeInputAmount as TradeInputAmount,
  validator,
} from '@components/core/reduxForm';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { change, Field, focus } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import { Text } from '@src/components/core';
import convert from '@src/utils/convert';
import SelectPercentAmount from '@src/components/SelectPercentAmount';
import { maxAmountValidatorForSellInput } from './OrderLimit.utils';
import {
  inputAmountSelector,
  orderLimitDataSelector,
  rateDataSelector,
} from './OrderLimit.selector';
import { actionSetPercent } from './OrderLimit.actions';
import { TAB_BUY_ID, TAB_SELL_ID, formConfigs } from './OrderLimit.constant';

const styled = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  selectPercentAmountContainer: {
    marginBottom: 24,
  },
  balanceWrapper: {
    justifyContent: 'space-between',
  },
  balanceLabel: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.superSmall,
    color: COLORS.colorGrey3,
  },
  balanceValue: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.superSmall,
    color: COLORS.black,
  },
});

const RateInput = React.memo(() => {
  const dispatch = useDispatch();
  const orderlimitData = useSelector(orderLimitDataSelector);
  const inputAmount = useSelector(inputAmountSelector);
  const rateData = useSelector(rateDataSelector);
  const sellinputAmount = inputAmount(formConfigs.selltoken);
  const buyinputAmount = inputAmount(formConfigs.buytoken);
  const rateToken: SelectedPrivacy = rateData?.rateToken;
  const { activedTab } = orderlimitData;
  const changeBuyAmountByRate = (rate) => {
    switch (activedTab) {
    case TAB_BUY_ID: {
      const sellAmount = format.toFixed(
        new BigNumber(buyinputAmount.amount)
          .multipliedBy(new BigNumber(rate || 0))
          .toNumber(),
          buyinputAmount?.pDecimals,
      );
      dispatch(
        change(formConfigs.formName, formConfigs.selltoken, sellAmount),
      );
      break;
    }
    case TAB_SELL_ID: {
      const buyAmount = format.toFixed(
        new BigNumber(sellinputAmount.amount)
          .multipliedBy(new BigNumber(rate || 0))
          .toNumber(),
          sellinputAmount?.pDecimals,
      );
      dispatch(change(formConfigs.formName, formConfigs.buytoken, buyAmount));
      break;
    }
    default:
      break;
    }
  };
  const onEndEditing = () => changeBuyAmountByRate(rateData?.customRate);
  const onChange = async (rate) => {
    try {
      dispatch(change(formConfigs.formName, formConfigs.rate, rate));
      if (typeof validator.number()(rate) !== 'undefined') {
        dispatch(change(formConfigs.formName, formConfigs.buytoken, ''));
        return;
      }
      changeBuyAmountByRate(rate);
    } catch (error) {
      console.log('onChange-error', error);
    }
  };
  return (
    <View style={styled.inputContainer}>
      <Field
        component={TradeInputAmount}
        name={formConfigs.rate}
        keyboardType="decimal-pad"
        placeholder="0"
        ellipsizeMode="tail"
        numberOfLines={1}
        onEndEditing={onEndEditing}
        onChange={onChange}
        validate={[
          ...(rateToken?.isIncognitoToken
            ? validator.combinedNanoAmount
            : validator.combinedAmount),
        ]}
        editableInput={!!orderlimitData?.editableInput}
        srcIcon={rateToken?.iconUrl}
        symbol={rateToken?.symbol}
      />
    </View>
  );
});

const SellInput = React.memo(() => {
  const orderLimitData = useSelector(orderLimitDataSelector);
  const dispatch = useDispatch();
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const buyInputAmount = inputAmount(formConfigs.buytoken);
  const sellToken: SelectedPrivacy = sellInputAmount?.tokenData;
  const changeBuyAmount = (sellamount) => {
    let amount = convert.toNumber(sellamount, true) || 0;
    let originalAmount = convert.toOriginalAmount(
      amount,
      sellInputAmount?.pDecimals,
    );
    amount = convert.toHumanAmount(originalAmount, sellInputAmount?.pDecimals);
    const buyAmount = format.toFixed(
      new BigNumber(amount).multipliedBy(new BigNumber(customRate)).toNumber(),
      buyInputAmount?.pDecimals,
    );
    dispatch(change(formConfigs.formName, formConfigs.buytoken, buyAmount));
    dispatch(focus(formConfigs.formName, formConfigs.buytoken));
  };
  const onEndEditing = () => {
    changeBuyAmount(sellInputAmount.amount);
  };
  const { customRate } = useSelector(rateDataSelector);
  const onChange = (sellamount) => {
    try {
      dispatch(change(formConfigs.formName, formConfigs.selltoken, sellamount));
      if (typeof validator.number()(sellamount) !== 'undefined') {
        dispatch(change(formConfigs.formName, formConfigs.buytoken, ''));
        return;
      }
      changeBuyAmount(sellamount);
    } catch (error) {
      console.log('SellInput-onChange-error', error);
    }
  };
  const onPressInfinityIcon = async () => {
    dispatch(
      change(
        formConfigs.formName,
        formConfigs.selltoken,
        sellInputAmount?.availableAmountText,
      ),
    );
    changeBuyAmount(sellInputAmount?.availableAmountText);
  };
  let _maxAmountValidatorForSellInput = React.useCallback(
    () => maxAmountValidatorForSellInput(sellInputAmount),
    [
      sellInputAmount?.originalAmount,
      sellInputAmount?.availableOriginalAmount,
      sellInputAmount?.availableAmountText,
      sellInputAmount?.symbol,
    ],
  );
  if (!sellInputAmount) {
    return null;
  }
  return (
    <View style={styled.inputContainer}>
      <Field
        component={TradeInputAmount}
        name={formConfigs.selltoken} //
        hasInfinityIcon
        symbol={sellInputAmount?.symbol}
        srcIcon={sellInputAmount?.iconUrl}
        onEndEditing={onEndEditing}
        onPressInfinityIcon={onPressInfinityIcon}
        validate={[
          ...(sellToken?.isIncognitoToken
            ? validator.combinedNanoAmount
            : validator.combinedAmount),
          _maxAmountValidatorForSellInput,
        ]}
        loadingBalance={!!sellInputAmount?.loadingBalance}
        editableInput={!!orderLimitData?.editableInput}
        onChange={onChange}
      />
    </View>
  );
});

const BuyInput = React.memo(() => {
  const dispatch = useDispatch();
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const buyInputAmount = inputAmount(formConfigs.buytoken);
  const buyToken: SelectedPrivacy = buyInputAmount?.tokenData;
  const orderLimitData = useSelector(orderLimitDataSelector);
  const { customRate } = useSelector(rateDataSelector);
  const { activedTab } = orderLimitData;
  const changeSellAmount = (buyamount) => {
    let amount = convert.toNumber(buyamount, true) || 0;
    let originalAmount = convert.toOriginalAmount(
      amount,
      buyInputAmount?.pDecimals,
    );
    amount = convert.toHumanAmount(originalAmount, buyInputAmount?.pDecimals);
    let sellAmount = '';
    switch (activedTab) {
    case TAB_BUY_ID: {
      sellAmount = format.toFixed(
        new BigNumber(amount)
          .multipliedBy(new BigNumber(customRate))
          .toNumber(),
          sellInputAmount?.pDecimals,
      );
      break;
    }
    case TAB_SELL_ID: {
      sellAmount = format.toFixed(
        new BigNumber(amount).dividedBy(new BigNumber(customRate)).toNumber(),
          sellInputAmount?.pDecimals,
      );
      break;
    }
    default:
      break;
    }
    dispatch(change(formConfigs.formName, formConfigs.selltoken, sellAmount));
    dispatch(focus(formConfigs.formName, formConfigs.selltoken));
  };
  const onEndEditing = () => {
    changeSellAmount(buyInputAmount.amount);
  };
  const onChange = (buyamount) => {
    try {
      dispatch(change(formConfigs.formName, formConfigs.buytoken, buyamount));
      if (typeof validator.number()(buyamount) !== 'undefined') {
        dispatch(change(formConfigs.formName, formConfigs.selltoken, ''));
        return;
      }
      changeSellAmount(buyamount);
    } catch (error) {
      console.log('BuyInput-onChange-error', error);
    }
  };
  if (!buyInputAmount) {
    return null;
  }
  return (
    <View style={styled.inputContainer}>
      <Field
        component={TradeInputAmount}
        name={formConfigs.buytoken} //
        symbol={buyInputAmount?.symbol}
        onEndEditing={onEndEditing}
        validate={[
          ...(buyToken?.isIncognitoToken
            ? validator.combinedNanoAmount
            : validator.combinedAmount),
        ]}
        loadingBalance={!!buyInputAmount?.loadingBalance}
        editableInput={!!orderLimitData?.editableInput}
        onChange={onChange}
        srcIcon={buyInputAmount?.iconUrl}
      />
    </View>
  );
});

const SelectPercentAmountInput = React.memo(() => {
  const dispatch = useDispatch();
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const buyInputAmount = inputAmount(formConfigs.buytoken);
  const { customRate } = useSelector(rateDataSelector);
  const { mainColor, percent: selected } = useSelector(orderLimitDataSelector);
  const onPressPercent = (percent) => {
    let _percent;
    if (percent === selected) {
      _percent = 0;
      dispatch(actionSetPercent(0));
    } else {
      _percent = percent;
      dispatch(actionSetPercent(percent));
    }
    _percent = _percent / 100;
    let amount =
      convert.toNumber(sellInputAmount?.availableAmountText, true) || 0;
    if (!amount) {
      return;
    }
    let originalAmount = convert.toOriginalAmount(
      new BigNumber(amount).multipliedBy(_percent).toNumber(),
      sellInputAmount?.pDecimals,
    );
    amount = convert.toHumanAmount(originalAmount, sellInputAmount?.pDecimals);
    const amounText = format.toFixed(amount, sellInputAmount?.pDecimals);
    const buyAmount = format.toFixed(
      new BigNumber(amount).multipliedBy(new BigNumber(customRate)).toNumber(),
      buyInputAmount?.pDecimals,
    );
    dispatch(change(formConfigs.formName, formConfigs.buytoken, buyAmount));
    dispatch(change(formConfigs.formName, formConfigs.selltoken, amounText));
    dispatch(focus(formConfigs.formName, formConfigs.selltoken));
  };
  return (
    <SelectPercentAmount
      size={4}
      containerStyled={styled.selectPercentAmountContainer}
      percentBtnColor={mainColor}
      selected={selected}
      onPressPercent={onPressPercent}
    />
  );
});

const Balance = React.memo(() => {
  const { balanceStr } = useSelector(orderLimitDataSelector);
  return (
    <Row style={styled.balanceWrapper}>
      <Text style={styled.balanceLabel}>Balance</Text>
      <Text style={styled.balanceValue}>{balanceStr}</Text>
    </Row>
  );
});

const InputsGroup = React.memo(() => {
  const { activedTab } = useSelector(orderLimitDataSelector);
  const renderMain = () => {
    switch (activedTab) {
    case TAB_SELL_ID: {
      return (
        <>
          <SellInput />
          <SelectPercentAmountInput />
          <BuyInput />
        </>
      );
    }
    case TAB_BUY_ID: {
      return (
        <>
          <BuyInput />
          <SelectPercentAmountInput />
          <SellInput />
        </>
      );
    }
    default:
      return null;
    }
  };
  return (
    <View style={styled.container}>
      <RateInput />
      {renderMain()}
      <Balance />
    </View>
  );
});

export default InputsGroup;

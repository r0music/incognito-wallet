import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@src/components/core';
import { Row } from '@src/components';
import { COLORS, FONT } from '@src/styles';
import { change, Field, getFormSyncErrors } from 'redux-form';
import { RFBaseInput, validator } from '@src/components/core/reduxForm';
import { useDispatch, useSelector } from 'react-redux';
import { RFError } from '@src/components/core/reduxForm/fields/createField';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import { Hook } from '@screens/PDexV3/features/Extra';
import { formConfigs } from './OrderLimit.constant';
import {
  inputAmountSelector,
  rateDataSelector,
  orderLimitDataSelector,
} from './OrderLimit.selector';

const styled = StyleSheet.create({
  container: {},
  ctRateContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctRateLabel: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.newGrey,
  },
  ctRateInput: {
    textAlign: 'right',
    maxWidth: 150,
  },
  ctRateInputUnit: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.black,
    textAlign: 'right',
  },
  rightCustom: {
    marginLeft: 15,
  },
  ctRateWrapper: {
    minHeight: 55,
  },
});

const Rate = React.memo(() => {
  const orderlimitData = useSelector(orderLimitDataSelector);
  return (
    <Hook
      label="Rate"
      value={orderlimitData?.rateStr}
      hasQuestionIcon
      onPressQuestionIcon={() => null}
      boldLabel
    />
  );
});

const CustomRate = React.memo(() => {
  const orderlimitData = useSelector(orderLimitDataSelector);
  const inputAmount = useSelector(inputAmountSelector);
  const rateData = useSelector(rateDataSelector);
  const sellinputAmount = inputAmount(formConfigs.selltoken);
  const buyinputAmount = inputAmount(formConfigs.buytoken);
  const formSyncErrors = useSelector((state) =>
    getFormSyncErrors(formConfigs.formName)(state),
  );
  const rateError = formSyncErrors[formConfigs.rate];
  const dispatch = useDispatch();
  const changeBuyAmountByRate = (rate) => {
    const buyFormatAmount = format.toFixed(
      new BigNumber(sellinputAmount.amount)
        .multipliedBy(new BigNumber(rate || 0))
        .toNumber(),
      buyinputAmount?.pDecimals,
    );
    dispatch(
      change(formConfigs.formName, formConfigs.buytoken, buyFormatAmount),
    );
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
    <View style={styled.ctRateWrapper}>
      <Row style={styled.ctRateContainer}>
        <View style={styled.label}>
          <Text
            style={styled.ctRateLabel}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            1 {sellinputAmount?.symbol || ''} =
          </Text>
        </View>
        <View>
          <Field
            component={RFBaseInput}
            name={formConfigs.rate}
            keyboardType="decimal-pad"
            placeholder="0"
            ellipsizeMode="tail"
            numberOfLines={1}
            onEndEditing={onEndEditing}
            inputStyle={styled.ctRateInput}
            rightCustom={
              <View style={styled.rightCustom}>
                <Text style={styled.ctRateInputUnit}>
                  {buyinputAmount?.symbol || ''}
                </Text>
              </View>
            }
            onChange={onChange}
            validate={[...validator.combinedAmount]}
            isCustomizeRenderError
            editableInput={!!orderlimitData?.editableInput}
            autoFocus={false}
          />
        </View>
      </Row>
      {!!rateError && (
        <RFError errMsg={rateError} style={{ textAlign: 'right' }} />
      )}
    </View>
  );
});

const GroupRate = (props) => {
  return (
    <View style={styled.container}>
      <Rate />
      <CustomRate />
    </View>
  );
};

GroupRate.propTypes = {};

export default React.memo(GroupRate);

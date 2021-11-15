import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView, RefreshControl } from '@src/components/core';
import { createForm } from '@src/components/core/reduxForm';
import { ButtonBasic } from '@src/components/Button';
import LoadingTx from '@src/components/LoadingTx';
import GroupSubInfo from './OrderLimit.groupSubInfo';
import { formConfigs } from './OrderLimit.constant';
import { styled } from './OrderLimit.styled';
import { orderLimitDataSelector } from './OrderLimit.selector';
import withOrderLimit from './OrderLimit.enhance';
import OrderLimitInputsGroup from './OrderLimit.inputsGroup';
import OrderDetails from './OrderLimit.details';

const initialFormValues = {
  selltoken: '',
  buytoken: '',
  feetoken: '',
  rate: '',
};

const Form = createForm(formConfigs.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const OrderLimit = (props) => {
  const {
    mainColor,
    btnActionTitle,
    disabledBtn,
    ordering,
    calculating,
  } = useSelector(orderLimitDataSelector);
  const { handleConfirm, onRefresh } = props;
  return (
    <>
      <KeyboardAwareScrollView
        style={styled.container}
        refreshControl={
          <RefreshControl refreshing={calculating} onRefresh={onRefresh} />
        }
      >
        <Form>
          {() => (
            <View>
              <OrderLimitInputsGroup />
            </View>
          )}
        </Form>
        <OrderDetails />
        <ButtonBasic
          btnStyle={{ backgroundColor: mainColor, borderRadius: 8 }}
          title={btnActionTitle}
          disabled={disabledBtn}
          onPress={handleConfirm}
        />
        <GroupSubInfo />
      </KeyboardAwareScrollView>
      {!!ordering && <LoadingTx />}
    </>
  );
};

OrderLimit.propTypes = {
  tabsFactories: PropTypes.array.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
};

export default withOrderLimit(React.memo(OrderLimit));

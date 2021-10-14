import Tabs from '@src/components/core/Tabs';
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { ScrollView, RefreshControl } from '@src/components/core';
import { createForm } from '@src/components/core/reduxForm';
import { NFTTokenBottomBar } from '@screens/PDexV3/features/NFTToken';
import { ButtonBasic } from '@src/components/Button';
import LoadingTx from '@src/components/LoadingTx';
import { GroupActions } from '@screens/PDexV3/features/Share';
import GroupSubInfo from './OrderLimit.groupSubInfo';
import { formConfigs, ROOT_TAB_ORDER_LIMIT } from './OrderLimit.constant';
import { styled } from './OrderLimit.styled';
import { orderLimitDataSelector } from './OrderLimit.selector';
import withOrderLimit from './OrderLimit.enhance';
import OrderLimitInputsGroup from './OrderLimit.inputsGroup';

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
  const { tabsFactories, handleConfirm, onRefresh, callback } = props;
  return (
    <>
      <ScrollView
        style={styled.container}
        refreshControl={
          <RefreshControl refreshing={calculating} onRefresh={onRefresh} />
        }
      >
        <Form>
          {() => (
            <View>
              <GroupActions
                hasChart
                onPressRefresh={onRefresh}
                callback={callback}
              />
              <Tabs
                rootTabID={ROOT_TAB_ORDER_LIMIT}
                styledTabs={{ marginBottom: 24 }}
              >
                {tabsFactories.map((tab) => (
                  <View key={tab.tabID} {...tab} />
                ))}
              </Tabs>
              <OrderLimitInputsGroup />
              <ButtonBasic
                btnStyle={{ backgroundColor: mainColor }}
                title={btnActionTitle}
                disabled={disabledBtn}
                onPress={handleConfirm}
              />
              <GroupSubInfo />
            </View>
          )}
        </Form>
      </ScrollView>
      {!!ordering && <LoadingTx />}
      <NFTTokenBottomBar />
    </>
  );
};

OrderLimit.propTypes = {
  tabsFactories: PropTypes.array.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
};

export default withOrderLimit(React.memo(OrderLimit));

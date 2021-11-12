import { BtnOrderHistory, ButtonTrade } from '@src/components/Button';
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Tabs1 } from '@src/components/core/Tabs';
import { createForm } from '@components/core/reduxForm';
import { useSelector } from 'react-redux';
import LoadingTx from '@src/components/LoadingTx';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { KeyboardAwareScrollView, RefreshControl } from '@src/components/core';
import { styled, tabsStyled } from './Swap.styled';
import {
  ROOT_TAB_ID,
  TAB_SIMPLE_ID,
  TAB_PRO_ID,
  formConfigs,
} from './Swap.constant';
import TabSimple from './Swap.simpleTab';
import TabPro from './Swap.proTab';
import withSwap from './Swap.enhance';
import { swapInfoSelector } from './Swap.selector';
import SwapInputsGroup from './Swap.inputsGroup';

const initialFormValues = {
  selltoken: '',
  buytoken: '',
  slippagetolerance: '',
  feetoken: '',
};

const Form = createForm(formConfigs.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const Swap = (props) => {
  const { initSwapForm, handleConfirm } = props;
  const navigation = useNavigation();
  const handleNavOrderHistory = () =>
    navigation.navigate(routeNames.TradeOrderHistory);
  const swapInfo = useSelector(swapInfoSelector);
  const tabsFactories = [
    {
      tabID: TAB_SIMPLE_ID,
      label: 'Simple',
      onChangeTab: () => null,
      tabStyled: tabsStyled.tabBtn,
      tabStyledDisabled: tabsStyled.tabBtnDisabled,
      titleStyled: tabsStyled.tabTitleStyled,
      titleDisabledStyled: tabsStyled.tabTitleDisabledStyled,
      tab: <TabSimple handleConfirm={handleConfirm} />,
    },
    {
      tabID: TAB_PRO_ID,
      label: 'Pro',
      onChangeTab: () => null,
      tabStyled: tabsStyled.tabBtn,
      tabStyledDisabled: tabsStyled.tabBtnDisabled,
      titleStyled: tabsStyled.tabTitleStyled,
      titleDisabledStyled: tabsStyled.tabTitleDisabledStyled,
      tab: <TabPro handleConfirm={handleConfirm} />,
    },
  ];
  return (
    <>
      <KeyboardAwareScrollView
        style={styled.scrollview}
        refreshControl={
          <RefreshControl
            refreshing={swapInfo?.refreshing}
            onRefresh={initSwapForm}
          />
        }
      >
        <Form>
          {() => (
            <>
              <SwapInputsGroup />
              <ButtonTrade
                btnStyle={styled.btnTrade}
                onPress={handleConfirm}
                title={swapInfo?.btnSwapText || ''}
                disabled={!!swapInfo?.disabledBtnSwap}
              />
              <Tabs1
                rootTabID={ROOT_TAB_ID}
                styledTabList={tabsStyled.styledTabList}
                containerStyled={{
                  marginTop: 0,
                  marginBottom: 0,
                }}
                rightCustom={
                  <BtnOrderHistory onPress={handleNavOrderHistory} />
                }
              >
                {tabsFactories.map(({ tab, ...rest }) => (
                  <View key={rest.tabID} {...rest}>
                    {tab}
                  </View>
                ))}
              </Tabs1>
            </>
          )}
        </Form>
      </KeyboardAwareScrollView>
      {!!swapInfo.swaping && <LoadingTx />}
    </>
  );
};

Swap.propTypes = {
  handleConfirm: PropTypes.func.isRequired,
};

export default withSwap(React.memo(Swap));

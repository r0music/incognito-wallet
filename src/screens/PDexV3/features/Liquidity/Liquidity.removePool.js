import React, { memo } from 'react';
import { RefreshControl, ScrollView, Text } from 'react-native';
import PropTypes from 'prop-types';
import { styled as mainStyle } from '@screens/PDexV3/PDexV3.styled';
import { Header, SuccessModal } from '@src/components';
import {
  formConfigsRemovePool,
  LIQUIDITY_MESSAGES,
  SUCCESS_MODAL,
} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import withLiquidity from '@screens/PDexV3/features/Liquidity/Liquidity.enhance';
import {
  createForm,
  RFTradeInputAmount as TradeInputAmount,
  validator,
} from '@components/core/reduxForm';
import styled from '@screens/PDexV3/features/Liquidity/Liquidity.styled';
import { Field } from 'redux-form';
import { AddBreakLine, View } from '@components/core';
import { batch, useDispatch, useSelector } from 'react-redux';
import {
  liquidityActions,
  removePoolSelector,
} from '@screens/PDexV3/features/Liquidity/index';
import { ButtonTrade } from '@components/Button';
import { compose } from 'recompose';
import withTransaction from '@screens/PDexV3/features/Liquidity/Liquidity.enhanceTransaction';
import { useNavigation } from 'react-navigation-hooks';
import NetworkFee from '@src/components/NetworkFee';
import { withLayout_2 } from '@components/Layout';
import withLazy from '@components/LazyHoc/LazyHoc';
import withInitAccessOTALP from '@screens/PDexV3/features/Liquidity/features/AccessOTA/AccessOTA.enhance';
import withLPTransaction from '@screens/PDexV3/features/Share/Share.transactorLP';

const initialFormValues = {
  inputToken: '',
  outputToken: '',
};

const Form = createForm(formConfigsRemovePool.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const InputsGroup = () => {
  const dispatch = useDispatch();
  const inputAmount = useSelector(removePoolSelector.inputAmountSelector);
  const inputToken = inputAmount(
    formConfigsRemovePool.formName,
    formConfigsRemovePool.inputToken,
  );
  const outputToken = inputAmount(
    formConfigsRemovePool.formName,
    formConfigsRemovePool.outputToken,
  );
  const onChangeInput = (text) =>
    dispatch(liquidityActions.actionChangeInputRemovePool(text));
  const onChangeOutput = (text) =>
    dispatch(liquidityActions.actionChangeOutputRemovePool(text));
  const onMaxPress = () => dispatch(liquidityActions.actionMaxRemovePool());
  const _validateInput = React.useCallback(() => {
    return inputToken.error;
  }, [inputToken.error]);
  const _validateOutput = React.useCallback(() => {
    return outputToken.error;
  }, [outputToken.error]);
  return (
    <>
      <View style={styled.inputBox}>
        <Field
          component={TradeInputAmount}
          name={formConfigsRemovePool.inputToken}
          validate={[_validateInput, ...validator.combinedAmount]}
          editableInput={!inputToken.loadingBalance}
          srcIcon={inputToken && inputToken?.iconUrl}
          symbol={inputToken && inputToken?.symbol}
          onChange={onChangeInput}
          onPressInfinityIcon={onMaxPress}
          hasInfinityIcon
        />
        <AddBreakLine />
        <Field
          component={TradeInputAmount}
          name={formConfigsRemovePool.outputToken}
          validate={[_validateOutput, ...validator.combinedAmount]}
          symbol={outputToken && outputToken?.symbol}
          srcIcon={outputToken && outputToken?.iconUrl}
          editableInput={!outputToken.loadingBalance}
          onChange={onChangeOutput}
          onPressInfinityIcon={onMaxPress}
          visibleHeader
          hasInfinityIcon
        />
      </View>
    </>
  );
};

const BTNRemovePool = React.memo(({ onSubmit }) => {
  const { disabled } = useSelector(removePoolSelector.disableRemovePool);
  const {
    params,
    versionTx
  } = useSelector(removePoolSelector.compressRemovePoolParams);
  const handleSubmit = () => {
    if (disabled) return;
    onSubmit(params, versionTx);
  };

  return (
    <ButtonTrade
      btnStyle={mainStyle.button}
      title={LIQUIDITY_MESSAGES.removePool}
      onPress={handleSubmit}
    />
  );
});

const RemovePool = ({
  onInitRemovePool,
  createAndSendWithdrawContributeRequestTx,
  onCloseModal,
  visible,
  error,
}) => {
  const navigation = useNavigation();
  const isFetching = useSelector(removePoolSelector.isFetchingSelector);
  const { feeAmountStr, showFaucet } = useSelector(removePoolSelector.feeAmountSelector);
  const onSubmit = (params, versionTx) => {
    typeof createAndSendWithdrawContributeRequestTx === 'function'
    && createAndSendWithdrawContributeRequestTx(params, versionTx);
  };
  const onClose = () => {
    batch(() => {
      onCloseModal();
      onInitRemovePool();
      navigation.goBack();
    });
  };

  const renderContent = () => (
    <>
      <InputsGroup />
      <View style={styled.padding}>
        {!!error && <Text style={styled.warning}>{error}</Text>}
        <BTNRemovePool onSubmit={onSubmit} />
        {showFaucet && <NetworkFee feeStr={feeAmountStr} />}
      </View>
    </>
  );

  React.useEffect(() => {
    onInitRemovePool();
  }, []);
  return (
    <>
      <Header style={styled.padding} />
      <View borderTop style={styled.container}>
        <ScrollView
          refreshControl={(
            <RefreshControl
              refreshing={isFetching}
              onRefresh={onInitRemovePool}
            />
          )}
          showsVerticalScrollIndicator={false}
        >
          <Form>{renderContent()}</Form>
        </ScrollView>
      </View>
      <SuccessModal
        closeSuccessDialog={onClose}
        title={SUCCESS_MODAL.REMOVE_POOL.title}
        buttonTitle="OK"
        extraInfo={SUCCESS_MODAL.REMOVE_POOL.desc}
        visible={visible}
      />
    </>
  );
};

RemovePool.defaultProps = {
  error: '',
};

RemovePool.propTypes = {
  onInitRemovePool: PropTypes.func.isRequired,
  createAndSendWithdrawContributeRequestTx: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

BTNRemovePool.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default compose(
  withLazy,
  withLayout_2,
  withInitAccessOTALP,
  withLPTransaction,
)(memo(RemovePool));

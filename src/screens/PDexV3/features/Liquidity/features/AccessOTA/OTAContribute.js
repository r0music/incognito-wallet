import React from 'react';
import withInitAccessOTALP from '@screens/PDexV3/features/Liquidity/features/AccessOTA/AccessOTA.enhance';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Header, RowSpaceText, SuccessModal } from '@src/components';
import styled from '@screens/PDexV3/features/Liquidity/Liquidity.styled';
import withLazy from '@components/LazyHoc/LazyHoc';
import { withLayout_2 } from '@components/Layout';
import { createForm, RFTradeInputAmount as TradeInputAmount, validator } from '@components/core/reduxForm';
import {
  formConfigsContribute,
  LIQUIDITY_MESSAGES,
  liquidityActions,
  SUCCESS_MODAL
} from '@screens/PDexV3/features/Liquidity';
import { useDispatch } from 'react-redux';
import { AddBreakLine, RefreshControl, View } from '@components/core';
import { Field, focus, getFormSyncErrors } from 'redux-form';
import { styled as mainStyle } from '@screens/PDexV3/PDexV3.styled';
import { ButtonTrade } from '@components/Button';
import useSendSelf from '@screens/PDexV3/features/Liquidity/Liquidity.useSendSelf';
import { ScrollView, Text } from 'react-native';
import NetworkFee from '@components/NetworkFee';
import { OTAContributeSelector } from '@screens/PDexV3/features/Liquidity/features/AccessOTA';
import withLPTransaction from '@screens/PDexV3/features/Share/Share.transactorLP';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';

const initialFormValues = {
  inputToken: '',
  outputToken: '',
};

const Form = createForm(formConfigsContribute.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const InputsGroup = React.memo(() => {
  const dispatch = useDispatch();
  const { inputToken, outputToken } = useDebounceSelector(
    OTAContributeSelector.mappingDataSelector,
  );
  const onChangeInput = (newText) =>
    dispatch(liquidityActions.actionChangeInputContribute(newText));
  const onChangeOutput = (newText) =>
    dispatch(liquidityActions.actionChangeOutputContribute(newText));
  const onMaxInput = () =>
    dispatch(
      liquidityActions.actionChangeInputContribute(
        inputAmount.maxOriginalAmountText,
      ),
    );
  const onMaxOutput = () =>
    dispatch(
      liquidityActions.actionChangeOutputContribute(
        outputAmount.maxOriginalAmountText,
      ),
    );
  const amountSelector = useDebounceSelector(OTAContributeSelector.inputAmountSelector);
  const inputAmount = amountSelector(
    formConfigsContribute.formName,
    formConfigsContribute.inputToken,
  );
  const outputAmount = amountSelector(
    formConfigsContribute.formName,
    formConfigsContribute.outputToken,
  );
  const _validateInput = React.useCallback(() => {
    return inputAmount.error;
  }, [inputAmount.error]);
  const _validateOutput = React.useCallback(() => {
    return outputAmount.error;
  }, [outputAmount.error]);
  return (
    <View style={styled.inputBox}>
      <Field
        component={TradeInputAmount}
        name={formConfigsContribute.inputToken}
        symbol={inputToken && inputToken?.symbol}
        srcIcon={inputToken && inputToken?.iconUrl}
        validate={[_validateInput, ...validator.combinedAmount]}
        hasInfinityIcon
        onChange={onChangeInput}
        editableInput={!inputAmount.loadingBalance}
        loadingBalance={inputAmount.loadingBalance}
        onPressInfinityIcon={onMaxInput}
      />
      <AddBreakLine />
      <Field
        component={TradeInputAmount}
        name={formConfigsContribute.outputToken}
        hasInfinityIcon
        symbol={outputToken && outputToken?.symbol}
        srcIcon={outputToken && outputToken?.iconUrl}
        validate={[_validateOutput, ...validator.combinedAmount]}
        visibleHeader
        onChange={onChangeOutput}
        editableInput={!outputAmount.loadingBalance}
        loadingBalance={outputAmount.loadingBalance}
        onPressInfinityIcon={onMaxOutput}
      />
    </View>
  );
});

export const Extra = React.memo(() => {
  const data = useDebounceSelector(OTAContributeSelector.mappingDataSelector);
  const renderHooks = () => {
    if (!data) return;
    return (data?.hookFactories || []).map((item) => (
      <RowSpaceText {...item} key={item?.label} />
    ));
  };
  return <View style={mainStyle.extra}>{renderHooks()}</View>;
});

const ContributeButton = React.memo(({ onSubmit }) => {
  const dispatch = useDispatch();
  const { isDisabled } = useDebounceSelector(OTAContributeSelector.disableContribute);
  const formErrors = useDebounceSelector((state) =>
    getFormSyncErrors(formConfigsContribute.formName)(state),
  );
  const paramsSubmit = useDebounceSelector(OTAContributeSelector.compressParamsContribute);
  const createContributes = async () => {
    // focus input field get error
    const fields = [
      formConfigsContribute.inputToken,
      formConfigsContribute.outputToken,
    ];
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      if (formErrors[field]) {
        return dispatch(focus(formConfigsContribute.formName, field));
      }
    }
    if (isDisabled) return;
    onSubmit(paramsSubmit);
  };

  return (
    <ButtonTrade
      btnStyle={mainStyle.button}
      title={LIQUIDITY_MESSAGES.addLiquidity}
      onPress={createContributes}
    />
  );
});

const OTAContribute = ({
  onInitContribute,
  createContributeTxsWithAccessToken,
  visible,
  onCloseModal,
  setLoading,
  setError,
  error,
}) => {
  const isFetching = useDebounceSelector(OTAContributeSelector.statusSelector);
  const { feeAmountStr, showFaucet } = useDebounceSelector(OTAContributeSelector.feeAmountSelector);
  const _error = useSendSelf({ error, setLoading, setError });
  const onSubmit = (params) => {
    typeof createContributeTxsWithAccessToken === 'function' && createContributeTxsWithAccessToken(params);
  };
  const onClose = () => {
    onCloseModal();
    onInitContribute();
  };
  React.useEffect(() => {
    if (typeof onInitContribute === 'function') onInitContribute();
  }, []);
  return (
    <>
      <Header style={styled.padding} />
      <View borderTop style={styled.container}>
        <ScrollView
          refreshControl={(
            <RefreshControl
              refreshing={isFetching}
              onRefresh={onInitContribute}
            />
          )}
          showsVerticalScrollIndicator={false}
        >
          <Form>
            {() => (
              <>
                <InputsGroup />
                <View style={styled.padding}>
                  {!!_error && <Text style={styled.warning}>{_error}</Text>}
                  <ContributeButton onSubmit={onSubmit} />
                  {showFaucet && <NetworkFee feeStr={feeAmountStr} />}
                  <Extra />
                </View>
              </>
            )}
          </Form>
        </ScrollView>
      </View>
      <SuccessModal
        closeSuccessDialog={onClose}
        title={SUCCESS_MODAL.CREATE_POOL.title}
        buttonTitle="OK"
        extraInfo={SUCCESS_MODAL.CREATE_POOL.desc}
        visible={visible}
      />
    </>
  );
};


ContributeButton.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

OTAContribute.defaultProps = {
  error: '',
};

OTAContribute.propTypes = {
  onInitContribute: PropTypes.func.isRequired,
  createContributeTxsWithAccessToken: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  setError: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default compose(
  withLazy,
  withLayout_2,
  withInitAccessOTALP,
  withLPTransaction,
)(OTAContribute);
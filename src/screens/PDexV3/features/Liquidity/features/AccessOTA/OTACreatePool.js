import React, {memo} from 'react';
import { ScrollView, Text } from 'react-native';
import PropTypes from 'prop-types';
import { styled as mainStyle } from '@screens/PDexV3/PDexV3.styled';
import { Header, RowSpaceText, SuccessModal } from '@src/components';
import {
  LIQUIDITY_MESSAGES,
  formConfigsCreatePool,
  SUCCESS_MODAL,
} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import {createForm, RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import { AddBreakLine, View, RefreshControl } from '@components/core';
import { useDispatch } from 'react-redux';
import { change, Field, focus, getFormSyncErrors } from 'redux-form';
import { liquidityActions } from '@screens/PDexV3/features/Liquidity';
import styled from '@screens/PDexV3/features/Liquidity/Liquidity.styled';
import { ButtonTrade } from '@components/Button';
import { compose } from 'recompose';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import NetworkFee from '@src/components/NetworkFee';
import { withLayout_2 } from '@components/Layout';
import useSendSelf from '@screens/PDexV3/features/Liquidity/Liquidity.useSendSelf';
import withLazy from '@components/LazyHoc/LazyHoc';
import withInitAccessOTALP from '@screens/PDexV3/features/Liquidity/features/AccessOTA/AccessOTA.enhance';
import withLPTransaction from '@screens/PDexV3/features/Share/Share.transactorLP';
import { allTokensIDsSelector } from '@src/redux/selectors/token';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { listPoolsPureSelector } from '@screens/PDexV3/features/Pools';
import { OTACreatePoolSelector } from '@screens/PDexV3/features/Liquidity/features/AccessOTA/index';

const initialFormValues = {
  inputToken: '',
  outputToken: '',
};

const Form = createForm(formConfigsCreatePool.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const InputsGroup = () => {
  const dispatch = useDispatch();
  const inputAmount = useDebounceSelector(OTACreatePoolSelector.inputAmountSelector);
  const inputTokens = useDebounceSelector(OTACreatePoolSelector.inputTokensListSelector);
  const outputTokens = useDebounceSelector(OTACreatePoolSelector.outputTokensListSelector);
  const focusField = useDebounceSelector(OTACreatePoolSelector.focusFieldSelector);
  const isTyping = useDebounceSelector(OTACreatePoolSelector.isTypingSelector);
  const inputToken = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.inputToken);
  const outputToken = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.outputToken);
  const navigation = useNavigation();
  const onChangeText = (text) => dispatch(liquidityActions.actionSetCreatePoolText(text));
  const onFocusToken = (e, focusField) =>  dispatch(liquidityActions.actionSetFocusCreatePool({ focusField }));
  const onGetRate = () => {
    if (!inputToken.originalInputAmount || !outputToken.originalInputAmount || !inputToken.tokenId || !outputToken.tokenId) return;
    const params = {
      inputAmount: inputToken.originalInputAmount,
      inputToken: inputToken.tokenId,
      outputAmount: outputToken.originalInputAmount,
      outputToken: outputToken.tokenId,
    };
    dispatch(liquidityActions.actionSetTypingCreatePool({ isTyping: true }));
    liquidityActions.debouncedGetCreatePoolRate.cancel();
    dispatch(liquidityActions.asyncActionDebounced(params, liquidityActions.debouncedGetCreatePoolRate));
  };
  const _validateInput = React.useCallback(() => {
    return inputToken.error;
  }, [inputToken.error]);
  const _validateOutput = React.useCallback(() => {
    return outputToken.error;
  }, [outputToken.error]);

  const loading = React.useMemo(() => ({
    input: inputToken.loadingBalance || (isTyping && focusField === formConfigsCreatePool.inputToken),
    output: outputToken.loadingBalance || (isTyping && focusField === formConfigsCreatePool.outputToken),
  }), [focusField, isTyping, inputToken.loadingBalance, outputToken.loadingBalance]);

  const onSelectSymbol = (callback, tokens) => {
    navigation.navigate(routeNames.SelectTokenModal, {
      data: tokens,
      onPress: callback
    });
  };

  React.useEffect(() => {
    onGetRate();
  }, [
    inputToken.originalInputAmount,
    inputToken.tokenId,
    outputToken.originalInputAmount,
    outputToken.tokenId,
  ]);

  return (
    <View style={styled.inputBox}>
      <Field
        component={TradeInputAmount}
        name={formConfigsCreatePool.inputToken}
        canSelectSymbol
        symbol={inputToken && inputToken?.symbol}
        validate={[
          _validateInput,
          ...validator.combinedAmount,
        ]}
        onFocus={(e) => onFocusToken(e, formConfigsCreatePool.inputToken)}
        onChange={onChangeText}
        editableInput={!inputToken.loadingBalance}
        loadingBalance={loading.input}
        hasInfinityIcon={!!inputToken && !!inputToken?.balanceStr}
        onPressInfinityIcon={() => {
          dispatch(change(formConfigsCreatePool.formName, formConfigsCreatePool.inputToken, inputToken.maxOriginalAmountText));
        }}
        onPressSymbol={() => {
          if (loading.input) return;
          onSelectSymbol(((token) => {
            setTimeout(() =>
                dispatch(liquidityActions.actionUpdateCreatePoolInputToken(token.tokenId)),
              300);
          }), inputTokens);
        }}
      />
      <AddBreakLine />
      <Field
        component={TradeInputAmount}
        name={formConfigsCreatePool.outputToken}
        canSelectSymbol
        visibleHeader
        symbol={outputToken && outputToken?.symbol}
        hasInfinityIcon={!!outputToken && !!outputToken?.balanceStr}
        validate={[
          _validateOutput,
          ...validator.combinedAmount,
        ]}
        onChange={onChangeText}
        editableInput={!outputToken.loadingBalance}
        loadingBalance={loading.output}
        onPressSymbol={() => {
          if (loading.output) return;
          onSelectSymbol(((token) => {
            setTimeout(() =>
                dispatch(liquidityActions.actionUpdateCreatePoolOutputToken(token.tokenId)),
              300);
          }), outputTokens);
        }}
        onFocus={(e) => onFocusToken(e, formConfigsCreatePool.outputToken)}
        onPressInfinityIcon={() => {
          dispatch(change(formConfigsCreatePool.formName, formConfigsCreatePool.outputToken, outputToken.maxOriginalAmountText));
        }}
      />
    </View>
  );
};

export const Extra = React.memo(() => {
  const hooks = useDebounceSelector(OTACreatePoolSelector.hookFactoriesSelector);
  const renderHooks = () => {
    return hooks.map(item => <RowSpaceText {...item} key={item?.label} />);
  };
  return(
    <View style={{ marginTop: 20 }}>
      {renderHooks()}
    </View>
  );
});

const BTNCreatePool = React.memo(({ onSubmit }) => {
  const dispatch = useDispatch();
  const compressParams = useDebounceSelector(OTACreatePoolSelector.compressParamsCreatePool);
  const { disabled } = useDebounceSelector(OTACreatePoolSelector.disableCreatePool);
  const { feeAmountStr, showFaucet } = useDebounceSelector(OTACreatePoolSelector.feeAmountSelector);
  const { estOutputStr } = useDebounceSelector(OTACreatePoolSelector.ampValueSelector);
  const formErrors = useDebounceSelector((state) =>
    getFormSyncErrors(formConfigsCreatePool.formName)(state),
  );
  const handleSubmit = () => {
    const fields = [
      formConfigsCreatePool.inputToken,
      formConfigsCreatePool.outputToken,
    ];
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      if (formErrors[field]) {
        return dispatch(focus(formConfigsCreatePool.formName, field));
      }
    }
    if (disabled) return;
    onSubmit(compressParams);
  };
  const changeEstRate = () =>
    !!estOutputStr && dispatch(change(formConfigsCreatePool.formName, formConfigsCreatePool.outputToken, estOutputStr));
  return (
    <>
      {!!estOutputStr && (
        <View style={mainStyle.extra}>
          {LIQUIDITY_MESSAGES.estRate(changeEstRate)}
        </View>
      )}
      <ButtonTrade
        btnStyle={mainStyle.button}
        title={LIQUIDITY_MESSAGES.createPool}
        onPress={handleSubmit}
      />
      {showFaucet && <NetworkFee feeStr={feeAmountStr} />}
    </>
  );
});

const OTACreatePool = ({
  onInitCreatePool,
  onFreeCreatePool,
  createNewPoolTxsWithAccessToken,
  visible,
  onCloseModal,
  setLoading,
  setError,
  error,
}) => {
  const tokenIDs = useDebounceSelector(allTokensIDsSelector);
  const listPools = useDebounceSelector(listPoolsPureSelector);
  const isFetching = useDebounceSelector(OTACreatePoolSelector.isFetchingSelector);
  const _error = useSendSelf({ error, setLoading, setError });
  const onSubmit = (params) => {
    typeof createNewPoolTxsWithAccessToken === 'function' && createNewPoolTxsWithAccessToken(params);
  };

  const onRefresh = () => {
    onInitCreatePool({ tokenIDs, listPools });
  };

  const onClose = () => {
    onCloseModal();
    onRefresh();
  };

  const renderContent = () => (
    <>
      <InputsGroup />
      <View style={styled.padding}>
        {!!_error && <Text style={styled.warning}>{_error}</Text>}
        <BTNCreatePool onSubmit={onSubmit} />
        <Extra />
      </View>
    </>
  );
  React.useEffect(() => {
    onRefresh();
    return () => onFreeCreatePool();
  }, []);
  return (
    <>
      <Header style={styled.padding} />
      <View borderTop style={styled.container}>
        <ScrollView
          refreshControl={(<RefreshControl refreshing={isFetching} onRefresh={onRefresh} />)}
          showsVerticalScrollIndicator={false}
        >
          <Form>
            {renderContent()}
          </Form>
        </ScrollView>
      </View>
      <SuccessModal
        closeSuccessDialog={onClose}
        title={SUCCESS_MODAL.ADD_POOL.title}
        buttonTitle="OK"
        extraInfo={SUCCESS_MODAL.ADD_POOL.desc}
        visible={visible}
      />
    </>
  );
};

BTNCreatePool.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

OTACreatePool.defaultProps = {
  error: ''
};

OTACreatePool.propTypes = {
  onInitCreatePool: PropTypes.func.isRequired,
  onFreeCreatePool: PropTypes.func.isRequired,
  createNewPoolTxsWithAccessToken: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default compose(
  withLazy,
  withLayout_2,
  withInitAccessOTALP,
  withLPTransaction,
)(memo(OTACreatePool));

import {
  RFTradeInputAmount as TradeInputAmount,
  validator,
} from '@components/core/reduxForm';
import routeNames from '@src/router/routeNames';
import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { change, Field } from 'redux-form';
import {
  actionEstimateTrade,
  actionGetMaxAmount,
  actionSelectToken,
  actionSetFocusToken,
} from '../redux/Swap.actions';
import { formConfigs } from '../Swap.constant';
import {
  inputAmountSelector,
  listPairsSelector,
  selltokenSelector,
  swapInfoSelector,
  swapSelector,
} from '../redux/Swap.selector';
import { maxAmountValidatorForSellInput } from '../Swap.utils';

export default () => {
  const swapInfo = useSelector(swapInfoSelector);
  const swap = useSelector(swapSelector);
  const pairsToken = useSelector(listPairsSelector);
  const selltoken: SelectedPrivacy = useSelector(selltokenSelector);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  let _maxAmountValidatorForSellInput = React.useCallback(
    () => maxAmountValidatorForSellInput(sellInputAmount, navigation),
    [
      sellInputAmount?.originalAmount,
      sellInputAmount?.availableOriginalAmount,
      sellInputAmount?.availableAmountText,
      sellInputAmount?.symbol,
      navigation,
    ],
  );

  const onPressInfinityIcon = async () => {
    const { availableAmountText } = await dispatch(actionGetMaxAmount());
    dispatch(
      change(formConfigs.formName, formConfigs.selltoken, availableAmountText),
    );
    dispatch(actionEstimateTrade({ useMax: false }));
  };

  const onSelectToken = (token, field) => {
    dispatch(actionSelectToken(token, field));
  };

  const onSelectSellToken = () => {
    navigation.navigate(routeNames.SelectTokenModal, {
      data: pairsToken.filter(
        (token: SelectedPrivacy) => token?.tokenId !== selltoken?.tokenId,
      ),
      onPress: (token) => onSelectToken(token, formConfigs.selltoken),
    });
  };
  const onChange = (field, value) => {
    dispatch(change(formConfigs.formName, field, value));
    dispatch(change(formConfigs.formName, formConfigs.buytoken, ''));
  };
  const onFocusToken = (e, field) => dispatch(actionSetFocusToken(swap[field]));
  const onEndEditing = (field) => dispatch(actionEstimateTrade({ field }));

  return (
    <Field
      component={TradeInputAmount}
      name={formConfigs.selltoken}
      // hasInfinityIcon
      canSelectSymbol
      symbol={selltoken?.symbol}
      onChange={(value) => onChange(formConfigs.selltoken, value)}
      onPressSymbol={onSelectSellToken}
      onFocus={(e) => onFocusToken(e, formConfigs.selltoken)}
      onEndEditing={() => onEndEditing(formConfigs.selltoken)}
      // onPressInfinityIcon={onPressInfinityIcon}
      validate={[
        ...(selltoken.isIncognitoToken
          ? validator.combinedNanoAmount
          : validator.combinedAmount),
        _maxAmountValidatorForSellInput,
      ]}
      loadingBalance={!!sellInputAmount?.loadingBalance}
      editableInput={!!swapInfo?.editableInput}
    />
  );
};

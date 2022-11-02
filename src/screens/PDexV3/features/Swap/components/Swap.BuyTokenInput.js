import {
  RFTradeInputAmount as TradeInputAmount,
  validator,
} from '@components/core/reduxForm';
import routeNames from '@src/router/routeNames';
import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { change, Field } from 'redux-form';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import {
  actionEstimateTrade,
  actionSelectToken,
  actionSetFocusToken,
} from '../redux/Swap.actions';
import { formConfigs } from '../Swap.constant';
import {
  buytokenSelector,
  inputAmountSelector,
  listPairsSelector,
  swapSelector,
} from '../redux/Swap.selector';

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const inputAmount = useSelector(inputAmountSelector);
  const buyInputAmount = inputAmount(formConfigs.buytoken);
  const swap = useSelector(swapSelector);
  const pairsToken = useSelector(listPairsSelector);
  const buytoken: SelectedPrivacy = useSelector(buytokenSelector);
  const onSelectToken = (token, field) => {
    dispatch(actionSelectToken(token, field));
  };

  const onSelectBuyToken = () => {
    navigation.navigate(routeNames.SelectTokenModal, {
      data: pairsToken.filter((token: SelectedPrivacy) => {
        // if (navigation?.state?.routeName === routeNames.Trade) {
        //   return (
        //     token?.tokenId !== buytoken?.tokenId && !token.movedUnifiedToken
        //   );
        // } else {
        //   return (
        //     token?.tokenId !== buytoken?.tokenId && !token?.movedUnifiedToken
        //   );
        // }
        return token?.tokenId !== buytoken?.tokenId && !token.movedUnifiedToken;
      }),
      onPress: (token) => onSelectToken(token, formConfigs.buytoken),
    });
  };

  const onChange = (field, value) => {
    dispatch(change(formConfigs.formName, field, value));
    dispatch(change(formConfigs.formName, formConfigs.selltoken, ''));
  };

  const onFocusToken = (e, field) => dispatch(actionSetFocusToken(swap[field]));
  const onEndEditing = (field) => dispatch(actionEstimateTrade({ field }));

  return (
    <Field
      component={TradeInputAmount}
      name={formConfigs.buytoken}
      canSelectSymbol
      symbol={buytoken?.symbol}
      onPressSymbol={onSelectBuyToken}
      onFocus={(e) => onFocusToken(e, formConfigs.buytoken)}
      // onEndEditing={() => onEndEditing(formConfigs.buytoken)}
      onEndEditing={() => onEndEditing(formConfigs.selltoken)}
      validate={[...validator.combinedAmount]}
      loadingBalance={!!buyInputAmount?.loadingBalance}
      editableInput={false}
      visibleHeader={false}
      onChange={(value) => onChange(formConfigs.buytoken, value)}
    />
  );
};

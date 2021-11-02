import React from 'react';
import { View } from 'react-native';
import {
  RFTradeInputAmount as TradeInputAmount,
  validator,
} from '@components/core/reduxForm';
import { change, Field } from 'redux-form';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { useDispatch, useSelector } from 'react-redux';
import { SwapButton, Text } from '@src/components/core';
import { Row } from '@src/components';
import { ButtonTrade } from '@src/components/Button';
import { COLORS, FONT } from '@src/styles';
import { actionToggleModal } from '@src/components/Modal';
import ModalBottomSheet from '@src/components/Modal/features/ModalBottomSheet';
import { SelectTokenModal } from '@screens/PDexV3/features/SelectToken';
import { maxAmountValidatorForSellInput } from './Swap.utils';
import { formConfigs } from './Swap.constant';
import {
  listPairsSelector,
  selltokenSelector,
  buytokenSelector,
  swapSelector,
  inputAmountSelector,
  swapInfoSelector,
} from './Swap.selector';
import {
  actionEstimateTrade,
  actionSelectToken,
  actionSetFocusToken,
  actionSwapToken,
} from './Swap.actions';
import { inputGroupStyled as styled } from './Swap.styled';
import { Hook } from '../Extra';

const SwapInputsGroup = React.memo(() => {
  const dispatch = useDispatch();
  const swapInfo = useSelector(swapInfoSelector);
  const swap = useSelector(swapSelector);
  const pairsToken = useSelector(listPairsSelector);
  const selltoken: SelectedPrivacy = useSelector(selltokenSelector);
  const buytoken: SelectedPrivacy = useSelector(buytokenSelector);
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const buyInputAmount = inputAmount(formConfigs.buytoken);
  const onSelectToken = (token, field) => {
    dispatch(actionSelectToken(token, field));
    dispatch(actionToggleModal());
  };
  const onSelectSellToken = () => {
    dispatch(
      actionToggleModal({
        visible: true,
        shouldCloseModalWhenTapOverlay: true,
        data: (
          <ModalBottomSheet
            customContent={(
              <SelectTokenModal
                data={pairsToken.filter(
                  (token: SelectedPrivacy) =>
                    token?.tokenId !== selltoken?.tokenId,
                )}
                onPress={(token) => onSelectToken(token, formConfigs.selltoken)}
              />
            )}
          />
        ),
      }),
    );
  };
  const onSelectBuyToken = () =>
    dispatch(
      actionToggleModal({
        visible: true,
        shouldCloseModalWhenTapOverlay: true,
        data: (
          <ModalBottomSheet
            customContent={(
              <SelectTokenModal
                data={pairsToken.filter(
                  (token: SelectedPrivacy) =>
                    token?.tokenId !== buytoken?.tokenId,
                )}
                onPress={(token) => onSelectToken(token, formConfigs.buytoken)}
              />
            )}
          />
        ),
      }),
    );
  const onFocusToken = (e, field) => dispatch(actionSetFocusToken(swap[field]));
  const onEndEditing = (field) => dispatch(actionEstimateTrade(field));
  const onSwapButtons = () => dispatch(actionSwapToken());
  let _maxAmountValidatorForSellInput = React.useCallback(
    () => maxAmountValidatorForSellInput(sellInputAmount),
    [
      sellInputAmount?.originalAmount,
      sellInputAmount?.availableOriginalAmount,
      sellInputAmount?.availableAmountText,
      sellInputAmount?.symbol,
    ],
  );
  const onPressInfinityIcon = () => {
    dispatch(
      change(
        formConfigs.formName,
        formConfigs.selltoken,
        sellInputAmount.availableAmountText,
      ),
    );
    dispatch(actionEstimateTrade());
  };
  const onChange = (field, value) => {
    dispatch(change(formConfigs.formName, field, value));
    switch (field) {
    case formConfigs.selltoken:
      dispatch(change(formConfigs.formName, formConfigs.buytoken, ''));
      break;
    case formConfigs.buytoken:
      dispatch(change(formConfigs.formName, formConfigs.selltoken, ''));
      break;
    default:
      break;
    }
  };

  return (
    <View style={styled.inputGroups}>
      <Field
        component={TradeInputAmount}
        name={formConfigs.selltoken} //
        hasIcon
        srcIcon={selltoken.iconUrl}
        canSelectSymbol
        symbol={selltoken?.symbol}
        onChange={(value) => onChange(formConfigs.selltoken, value)}
        onPressSymbol={onSelectSellToken}
        onFocus={(e) => onFocusToken(e, formConfigs.selltoken)}
        onEndEditing={() => onEndEditing(formConfigs.selltoken)}
        onPressInfinityIcon={onPressInfinityIcon}
        validate={[
          ...(selltoken.isIncognitoToken
            ? validator.combinedNanoAmount
            : validator.combinedAmount),
          _maxAmountValidatorForSellInput,
        ]}
        loadingBalance={!!sellInputAmount?.loadingBalance}
        editableInput={!!swapInfo?.editableInput}
        visibleHeader
        label="From"
        rightHeader={(
          <Row style={styled.rightHeaderSell}>
            <Text
              style={styled.balanceStr}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Balance: {swapInfo.balanceStr}
            </Text>
            <ButtonTrade
              btnStyle={styled.btnStyle}
              titleStyle={styled.titleStyle}
              title="MAX"
              onPress={onPressInfinityIcon}
            />
          </Row>
        )}
      />
      <SwapButton onSwapButtons={onSwapButtons} />
      <Field
        component={TradeInputAmount}
        name={formConfigs.buytoken} //
        canSelectSymbol
        hasIcon
        srcIcon={buytoken.iconUrl}
        symbol={buytoken?.symbol}
        onPressSymbol={onSelectBuyToken}
        onFocus={(e) => onFocusToken(e, formConfigs.buytoken)}
        onEndEditing={() => onEndEditing(formConfigs.buytoken)}
        validate={[...validator.combinedAmount]}
        loadingBalance={!!buyInputAmount?.loadingBalance}
        editableInput={!!swapInfo?.editableInput}
        visibleHeader
        label="To"
        onChange={(value) => onChange(formConfigs.buytoken, value)}
      />
      <Hook
        label="Rate"
        value={swapInfo?.maxPriceStr}
        hasQuestionIcon
        styledHook={{ marginTop: 32, marginBottom: 0 }}
        customStyledLabel={{
          color: COLORS.black,
          fontSize: FONT.SIZE.regular,
        }}
        customStyledValue={{
          color: COLORS.colorGrey3,
          fontSize: FONT.SIZE.small,
        }}
      />
    </View>
  );
});

export default SwapInputsGroup;
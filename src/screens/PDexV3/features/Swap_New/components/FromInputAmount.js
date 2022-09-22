import { Text, View, TouchableOpacity } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { IconArrowDown } from '@src/components/Icons';
import { change, Field } from 'redux-form';
import {
  RFTradeInputAmount as TradeInputAmount,
  validator,
  createForm,
} from '@components/core/reduxForm';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import ToggleArrow from '@src/components/ToggleArrow';
import { formConfigs } from '../Swap.constant';
import MaxButton from './MaxButton';
import {
  actionEstimateTrade,
  actionResetData,
  actionSelectToken,
  actionSetFocusToken,
  actionSwapToken,
  actionToggleProTab,
} from '../../Swap/Swap.actions';

import {
  listPairsSelector,
  selltokenSelector,
  buytokenSelector,
  swapSelector,
  inputAmountSelector,
  swapInfoSelector,
  platformSelectedSelector,
} from '../../Swap/Swap.selector';

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

const styled = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black3,
  },

  textInputContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.black3,
    color: COLORS.white,
  },
});

const FromInputAmount = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const swap = useSelector(swapSelector);

  const { tokenName = 'Incognito' } = props;
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
  const onFocusToken = (e, field) => dispatch(actionSetFocusToken(swap[field]));
  const onEndEditing = (field) => dispatch(actionEstimateTrade({ field }));
  const onSwapButtons = () => {
    // if (selltoken?.movedUnifiedToken) {
    //   return;
    // }
    dispatch(actionSwapToken());
    dispatch(actionResetData());
    dispatch(change(formConfigs.formName, formConfigs.feetoken, ''));
  };

  const onPressInfinityIcon = () => {
    dispatch(
      actionEstimateTrade({
        useMax: true,
      }),
    );
  };

  const onSelectSellToken = () => {
    // navigation.navigate(routeNames.SelectTokenModal, {
    //   data: pairsToken.filter(
    //     (token: SelectedPrivacy) => token?.tokenId !== selltoken?.tokenId,
    //   ),
    //   onPress: (token) => onSelectToken(token, formConfigs.selltoken),
    // });
  };

  return (
    <View style={styled.container}>
      <TextInput
        placeholder="Search for a privacy coin"
        placeholderTextColor={COLORS.white}
        style={styled.textInputContainer}
        selectionColor={COLORS.white}
        value="0.00 USDC"
        onChangeText={() => {}}
      />
      <MaxButton
        onPress={() => {
          navigation.navigate(routeNames.SelectAToken);
        }}
      />
    </View>
  );
};

FromInputAmount.defaultProps = {
  tokenName: PropTypes.string.isRequired,
};

FromInputAmount.propTypes = {};

export default FromInputAmount;

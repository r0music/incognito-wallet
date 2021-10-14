import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { ArrowRightGreyIcon } from '@components/Icons';
import styled from '@components/InputAmount/InputAmount.styled';
import ROUTE_NAMES from '@routers/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import Input from '@screens/DexV2/components/NewInput/Input';
import { ActivityIndicator, Text, TouchableOpacity } from '@components/core';
import { BtnInfinite } from '@components/Button';
import convertUtil from '@utils/convert';
import styles from '@screens/DexV2/components/Trade/style';
import { isEmpty } from 'lodash';
import formatUtils from '@utils/format';

export const RightIcon = React.memo(() => <ArrowRightGreyIcon style={styled.icon} />);

const InputAmount = ({
  token,
  onSelectToken,
  onChange,
  value,
  tokens,
  disabled,
  loading,
  placeholder,
  maxValue,
  disableChooseToken,
  errorMessage,
  onPressMax,
  fee,
  rightField
}) => {

  const navigation = useNavigation();

  const renderTextInput = () => (
    <Input
      style={{ flex: 1, alignItems: 'stretch', paddingRight: 10 }}
      onChange={onChange}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
    />
  );

  const showSelectTokenScreen = () => {
    if (disableChooseToken) return;
    navigation.navigate(ROUTE_NAMES.TokenSelectScreen, {
      onSelectToken,
      tokens,
      placeholder: 'Search coins',
      rightField,
    });
  };

  const handlePressMax = () => {
    if (typeof onPressMax === 'function') {
      onPressMax();
    }
    onChange(formatUtils.amountFull(convertUtil.toInput(maxValue) - fee, token?.pDecimals));
  };

  const renderButtonInfinite = () => {
    if (!!loading || !maxValue || maxValue < fee) return null;

    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <BtnInfinite onPress={handlePressMax} />
      </View>
    );
  };

  const renderLoading = () => {
    if (!loading) return null;
    return (<ActivityIndicator />);
  };

  const renderToken = () => (
    <TouchableOpacity
      onPress={showSelectTokenScreen}
      style={styled.centerJustify}
    >
      {token ? (
        <View style={styled.token}>
          <Text style={styled.bigText} isVerified={token.isVerified}>
            {token.symbol}
          </Text>
          {!disableChooseToken && <RightIcon />}
        </View>
      ) : <RightIcon />}
    </TouchableOpacity>
  );

  return (
    <>
      <View style={[styled.row, styled.justifyBetween]}>
        {renderTextInput()}
        <View style={{ marginRight: 15, alignSelf: 'center' }}>
          {renderLoading()}
          {renderButtonInfinite()}
        </View>
        {renderToken()}
      </View>
      {!isEmpty(errorMessage) && <Text style={styled.error}>{errorMessage}</Text>}
    </>
  );
};

InputAmount.defaultProps = {
  token: null,
  value: undefined,
  onChange: undefined,
  disabled: false,
  loading: false,
  maxValue: undefined,
  placeholder: '',
  errorMessage: '',
  onPressMax: null,
  fee: 0,
  rightField: ''
};

InputAmount.propTypes = {
  token: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tokens: PropTypes.array.isRequired,
  onSelectToken: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  maxValue: PropTypes.string,
  placeholder: PropTypes.string,
  disableChooseToken: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  onPressMax: PropTypes.func,
  fee: PropTypes.number,
  rightField: PropTypes.string,
};

export default memo(InputAmount);

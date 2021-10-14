import React from 'react';
import { ArrowGreyDown, InfiniteIcon } from '@src/components/Icons';
import PropTypes from 'prop-types';
import Row from '@src/components/Row';
import { StyleSheet } from 'react-native';
import {
  Text,
  BaseTextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import { Icon } from '@src/components/Token/Token.shared';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: COLORS.colorGrey4,
    height: 50,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    color: COLORS.black,
    fontSize: FONT.SIZE.medium,
    fontFamily: FONT.NAME.medium,
    marginRight: 15,
  },
  symbol: {
    color: COLORS.black,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 5,
    fontFamily: FONT.NAME.medium,
    marginRight: 8,
  },
  infinityIcon: {
    marginHorizontal: 8,
  },
  loadingIcon: {
    marginRight: 8,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: COLORS.black,
    fontSize: FONT.SIZE.superSmall,
    lineHeight: FONT.SIZE.superSmall + 5,
    fontFamily: FONT.NAME.medium,
  },
});

const TradeInputAmount = (props) => {
  const {
    hasInfinityIcon = false,
    onPressInfinityIcon,
    symbol,
    canSelectSymbol,
    onPressSymbol,
    placeholder = '0',
    loadingBalance,
    editableInput,
    hasIcon = true,
    srcIcon,
    label,
    rightHeader,
    visibleHeader = false,
    inputStyle,
    ...rest
  } = props || {};
  const renderSub = () => {
    if (loadingBalance) {
      return <ActivityIndicator style={styled.loadingIcon} size="small" />;
    }
    if (hasIcon) {
      return <Icon iconUrl={srcIcon} />;
    }
    if (hasInfinityIcon) {
      return (
        <TouchableOpacity
          onPress={() =>
            typeof onPressInfinityIcon === 'function' && onPressInfinityIcon()
          }
          style={styled.infinityIcon}
        >
          <InfiniteIcon style={{ width: 22, height: 10 }} />
        </TouchableOpacity>
      );
    }
  };
  return (
    <View style={styled.container}>
      {visibleHeader && (
        <Row style={styled.header}>
          <Text numberOfLines={1} style={styled.label}>
            {label}
          </Text>
          {rightHeader && rightHeader}
        </Row>
      )}
      <View style={styled.inputContainer}>
        <BaseTextInput
          style={{
            ...styled.input,
            ...inputStyle,
          }}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          ellipsizeMode="tail"
          numberOfLines={1}
          editable={editableInput}
          {...rest}
        />
        {renderSub()}
        {!!symbol && (
          <TouchableOpacity style={{ marginLeft: 8 }} onPress={onPressSymbol}>
            <Row style={{ alignItems: 'center' }}>
              {!!symbol && <Text style={styled.symbol}>{symbol}</Text>}
              {canSelectSymbol && <ArrowGreyDown />}
            </Row>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

TradeInputAmount.defaultProps = {
  hasInfinityIcon: false,
  onPressInfinityIcon: undefined,
  symbol: undefined,
  canSelectSymbol: false,
  onPressSymbol: undefined,
  loadingBalance: false,
  editableInput: false,
  hasIcon: true,
  label: '',
  srcIcon: '',
  visibleHeader: false,
  rightHeader: undefined,
};

TradeInputAmount.propTypes = {
  hasInfinityIcon: PropTypes.bool,
  onPressInfinityIcon: PropTypes.func,
  symbol: PropTypes.string,
  canSelectSymbol: PropTypes.bool,
  onPressSymbol: PropTypes.func,
  loadingBalance: PropTypes.bool,
  editableInput: PropTypes.bool,
  hasIcon: PropTypes.bool,
  srcIcon: PropTypes.string,
  label: PropTypes.string,
  rightHeader: PropTypes.element,
  visibleHeader: PropTypes.bool,
};

export default React.memo(TradeInputAmount);

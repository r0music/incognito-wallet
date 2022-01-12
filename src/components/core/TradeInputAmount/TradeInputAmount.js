import React from 'react';
import { MaxIcon } from '@src/components/Icons';
import PropTypes from 'prop-types';
import Row from '@src/components/Row';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme';
import {
  Text,
  BaseTextInput,
  TouchableOpacity,
  View,
} from '@src/components/core';
import nextFrame from '@src/utils/nextFrame';
import { FONT } from '@src/styles';
import { Icon } from '@src/components/Token/Token.shared';
import { ArrowRight } from '@components/Icons/icon.arrowRightGreyIcon';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    fontSize: FONT.SIZE.avgLarge + 2,
    lineHeight: FONT.SIZE.avgLarge + 8,
    fontFamily: FONT.NAME.medium,
    marginRight: 15,
  },
  symbol: {
    fontSize: FONT.SIZE.avgLarge + 2,
    lineHeight: FONT.SIZE.avgLarge + 8,
    fontFamily: FONT.NAME.medium,
    marginRight: 10,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: FONT.SIZE.small,
    fontFamily: FONT.NAME.regular,
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
    hasIcon = false,
    srcIcon,
    label,
    rightHeader,
    visibleHeader = false,
    inputStyle,
    ...rest
  } = props || {};
  const colors = useSelector(colorsSelector);
  const renderSub = () => {
    if (hasIcon) {
      return <Icon iconUrl={srcIcon} />;
    }
    if (hasInfinityIcon) {
      return (
        <MaxIcon
          style={styled.infinityIcon}
          onPress={() =>
            typeof onPressInfinityIcon === 'function' && onPressInfinityIcon()
          }
        />
      );
    }
  };
  return (
    <View style={styled.container}>
      {visibleHeader && (
        <Row style={styled.header}>
          <Text
            numberOfLines={1}
            style={[styled.label, { color: colors.subText }]}
          >
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
          <TouchableOpacity
            style={{ marginLeft: 16 }}
            onPress={async () => {
              await nextFrame();
              typeof onPressSymbol === 'function' ? onPressSymbol() : false;
            }}
          >
            <Row style={{ alignItems: 'center' }}>
              {!!symbol && <Text style={styled.symbol}>{symbol}</Text>}
              {canSelectSymbol && <ArrowRight />}
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
  hasIcon: false,
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

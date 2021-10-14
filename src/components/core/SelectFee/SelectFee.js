import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '@src/components/core';
import { Row } from '@src/components';
import { COLORS, FONT } from '@src/styles';
import { v4 } from 'uuid';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  symbol: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 5,
    color: COLORS.colorGrey3,
    textAlign: 'right',
    marginRight: 10,
  },
  tail: {
    marginRight: 0,
  },
  isActived: {
    color: COLORS.black,
  },
});

const SelectFeeItem = (props) => {
  const { symbol, tokenId, isActived, tail, canSelected, ...rest } = props;
  return (
    <TouchableWithoutFeedback {...rest}>
      <View style={[styled.feeItem, tail ? styled.tail : null]}>
        <Text
          style={[
            styled.symbol,
            tail && styled.tail,
            isActived ? styled.isActived : null,
          ]}
        >
          {symbol}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const SelectFee = (props) => {
  const { types = [], onChangeTypeFee, canSelected } = props;
  const onChangeFee = (type) => {
    if (!canSelected) {
      return;
    }
    const { actived } = type;
    if (actived) {
      return;
    }
    if (typeof onChangeTypeFee === 'function') {
      onChangeTypeFee(type);
    }
  };
  return (
    <Row style={styled.container}>
      {types.map((type, index) => (
        <SelectFeeItem
          key={`${v4()}-${type.symbol}-${type?.tokenId}-${index}`}
          {...{
            ...type,
            isActived: type?.actived,
            tail: index === types.length - 1,
            onPress: () => onChangeFee(type),
            canSelected,
          }}
        />
      ))}
    </Row>
  );
};

SelectFee.propTypes = {
  onChangeTypeFee: PropTypes.func.isRequired,
  types: PropTypes.arrayOf(
    PropTypes.shape({
      tokenId: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
      actived: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  canSelected: PropTypes.bool,
};

export default React.memo(SelectFee);

import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';
import Row from '@src/components/Row';
import { Text, TouchableOpacity } from '@src/components/core';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  btnContainer: {
    flex: 1,
    marginRight: 15,
  },
  percent: {
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 4,
    color: COLORS.black,
    fontFamily: FONT.NAME.regular,
    textAlign: 'center',
  },
  percentBtn: {
    height: 10,
    borderRadius: 20,
    width: '100%',
    marginBottom: 10,
  },
  btnLastChild: {
    marginRight: 0,
  },
});

const SelectPercentAmount = (props) => {
  const { selected, onPressPercent } = props;
  const {
    size = 4,
    percentBtnColor = COLORS.colorTradeBlue,
    containerStyled,
  } = props;
  const renderMain = () => {
    return [...Array(size)].map((item, index, arr) => {
      const percent = (((index + 1) / size) * 100).toFixed(0);
      const lastChild = index === arr.length - 1;
      const isFilled = Number(percent) <= Number(selected);
      return (
        <View
          key={percent}
          style={[styled.btnContainer, lastChild && styled.btnLastChild]}
        >
          <TouchableOpacity
            style={[
              styled.percentBtn,
              {
                backgroundColor: isFilled
                  ? percentBtnColor
                  : COLORS.lightGrey18,
              },
            ]}
            onPress={() => onPressPercent(percent)}
          />
          <Text style={styled.percent}>{percent}%</Text>
        </View>
      );
    });
  };
  return <Row style={[styled.container, containerStyled]}>{renderMain()}</Row>;
};

SelectPercentAmount.propTypes = {
  size: PropTypes.number.isRequired,
  percentBtnColor: PropTypes.string.isRequired,
  containerStyled: PropTypes.any,
  selected: PropTypes.number.isRequired,
  onPressPercent: PropTypes.func.isRequired,
};

export default React.memo(SelectPercentAmount);

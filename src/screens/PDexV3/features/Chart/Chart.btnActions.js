import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Row } from '@src/components';
import { ButtonTrade } from '@src/components/Button';
import { FONT } from '@src/styles';

const styled = StyleSheet.create({
  container: {},
  btnStyle: {
    height: 28,
    paddingHorizontal: 15,
  },
  titleStyle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
  },
});

const BtnActions = (props) => {
  return (
    <View style={styled.container}>
      <Row
        style={{
          justifyContent: 'flex-end',
        }}
      >
        <ButtonTrade
          title="Trade"
          btnStyle={{ ...styled.btnStyle, marginRight: 15 }}
          titleStyle={styled.titleStyle}
        />
        <ButtonTrade
          title="Invest more"
          btnStyle={styled.btnStyle}
          titleStyle={styled.titleStyle}
        />
      </Row>
    </View>
  );
};

BtnActions.propTypes = {};

export default React.memo(BtnActions);

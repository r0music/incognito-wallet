import { Header } from '@src/components';
import { ButtonTrade } from '@src/components/Button';
import { ScrollView } from '@src/components/core';
import { withLayout_2 } from '@src/components/Layout';
import PropTypes from 'prop-types';
import { COLORS } from '@src/styles';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingTx from '@src/components/LoadingTx';

const styled = StyleSheet.create({
  container: { flex: 1 },
  btnStyled: {
    marginTop: 30,
  },
  scrollview: {
    paddingTop: 32,
    flex: 1,
  },
});

const ReviewOrder = (props) => {
  const {
    extra,
    handleConfirm,
    btnColor = COLORS.colorTradeBlue,
    loadingTx,
  } = props;
  return (
    <View style={styled.container}>
      <Header title="Order preview" />
      <ScrollView style={styled.scrollview}>
        {extra && extra}
        <ButtonTrade
          btnStyle={{ ...styled.btnStyled, backgroundColor: btnColor }}
          title="Confirm"
          onPress={handleConfirm}
        />
      </ScrollView>
      {loadingTx && <LoadingTx />}
    </View>
  );
};

ReviewOrder.propTypes = {
  extra: PropTypes.any.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  btnColor: PropTypes.string,
  loadingTx: PropTypes.bool,
};

export default withLayout_2(React.memo(ReviewOrder));

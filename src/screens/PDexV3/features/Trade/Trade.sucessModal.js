import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Image, Text } from '@src/components/core';
import { ButtonTrade } from '@src/components/Button';
import { COLORS, FONT } from '@src/styles';
import { useDispatch } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { PureModalContent } from '@src/components/Modal/features/PureModal';
import { useNavigation } from 'react-navigation-hooks';
import srcOrdered from '@assets/images/new-icons/order-initiated.png';
import routeNames from '@src/router/routeNames';
import { Row } from '@src/components';

const styled = StyleSheet.create({
  title: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.colorBlue,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  desc: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 24,
  },
  sub: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
    color: COLORS.newGrey,
    textAlign: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'column',
  },
});

const TradeSucessModal = (props) => {
  const {
    title,
    desc,
    sub,
    btnTitle = 'Keep trading',
    handleTradeSucesss,
  } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const handleKeepTrading = () => {
    dispatch(actionToggleModal({ visible: false, data: null }));
    if (typeof handleTradeSucesss === 'function') {
      handleTradeSucesss();
    } else {
      navigation.navigate(routeNames.Trade);
    }
  };
  return (
    <PureModalContent>
      <Row style={styled.row}>
        <Image source={srcOrdered} style={styled.icon} />
        <Text style={styled.title}>{title}</Text>
      </Row>
      <Text style={styled.desc}>{desc}</Text>
      {sub && <Text style={styled.sub}>{sub}</Text>}
      <ButtonTrade
        btnStyle={{ marginTop: 24, marginBottom: 0 }}
        title={btnTitle}
        onPress={handleKeepTrading}
      />
    </PureModalContent>
  );
};

TradeSucessModal.propTypes = {
  desc: PropTypes.string.isRequired,
  btnColor: PropTypes.string.isRequired,
};

export default React.memo(TradeSucessModal);

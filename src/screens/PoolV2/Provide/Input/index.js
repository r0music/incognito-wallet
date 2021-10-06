import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, BaseTextInput, RoundCornerButton, TouchableOpacity, Image } from '@components/core';
import mainStyle from '@screens/PoolV2/style';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout/index';
import withCoinData from '@screens/PoolV2/Provide/Input/coin.enhance';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import withChangeInput from '@screens/DexV2/components/Trade/input.enhance';
import withValidate from '@screens/PoolV2/validate.enhance';
import { useNavigation } from 'react-navigation-hooks';
import ROUTE_NAMES from '@routers/routeNames';
import { Header, Row } from '@src/components/';
import { BtnInfinite } from '@components/Button/index';
import convertUtil, { formatTime }from '@utils/convert';
import formatUtil from '@utils/format';
import ic_radio from '@src/assets/images/icons/ic_radio.png';
import ic_radio_check from '@src/assets/images/icons/ic_radio_check.png';
import styles from './style';

const Provide = ({
  coins,
  coin,
  inputValue,
  inputText,
  onChangeInputText,
  feeToken,
  prvBalance,
  fee,
  error,
  payOnOrigin,
  isPrv,
  initIndex,
}) => {
  const navigation = useNavigation();
  const [i, setI] = React.useState(initIndex);
  const [selectedTerm, setSelectedTerm] = React.useState(coin.locked && coin.terms ? {apy: coin.terms[i].apy, lockTime: coin.terms[i].lockTime, termID: coin.terms[i].termID} : undefined);

  const handleProvide = () => {
    navigation.navigate(ROUTE_NAMES.PoolV2ProvideConfirm, {
      coins,
      coin,
      value: inputValue,
      text: inputText,
      fee,
      feeToken,
      prvBalance,
      payOnOrigin,
      isPrv,
      selectedTerm,
    });
  };

  const handleMax = () => {
    const humanAmount = convertUtil.toHumanAmount(coin.balance, coin.pDecimals);
    const fixDecimals = formatUtil.toFixed(humanAmount, coin.pDecimals);
    onChangeInputText(fixDecimals.toString());
  };

  const handlePress = (index) => {
    setI(index);
    setSelectedTerm({apy: coin.terms[index].apy, lockTime: coin.terms[index].lockTime, termID: coin.terms[index].termID});
  };


  return (
    <View style={mainStyle.flex}>
      <Header title='Provide' />
      <View style={mainStyle.coinContainer}>
        <Row center spaceBetween style={mainStyle.inputContainer}>
          <BaseTextInput
            style={mainStyle.input}
            placeholder="0"
            onChangeText={onChangeInputText}
            value={inputText}
            keyboardType="decimal-pad"
          />
          <BtnInfinite
            style={mainStyle.symbol}
            onPress={handleMax}
          />
        </Row>
        {!coin.locked &&
          <Row center spaceBetween>
            <Text style={mainStyle.coinExtraSmall}>{coin.displayInterest}</Text>
          </Row>
        }
        <Text style={mainStyle.error}>{error}</Text>
        {coin.locked && coin.terms && coin.terms.map((item, index) => {
          return (
            <TouchableOpacity
              style={index === i ? styles.selectedButton : styles.unSelectedButon}
              key={`key-${index}`}
              onPress={() => handlePress(index)}
            >
              <Row style={styles.contentView}>
                <Text style={[styles.textLeft, { marginRight: 20}]}>{item.lockTime} Months</Text>               
                <Row style={styles.contentView}>
                  <Text style={styles.textRight}>{item.apy}% APY </Text>
                  <Image style={styles.textRight} source={index === i ? ic_radio_check : ic_radio} />
                </Row>
              </Row>
            </TouchableOpacity>
          );
        })}
        
        <RoundCornerButton
          title="Provide"
          style={[mainStyle.button, styles.button]}
          onPress={handleProvide}
          disabled={!!error || !inputText}
        />
        <ExtraInfo
          left="Balance"
          right={`${coin.displayFullBalance} ${coin.symbol}`}
          style={mainStyle.coinExtraSmall}
          wrapperStyle={mainStyle.coinExtraSmallWrapper}
        />
        <ExtraInfo
          token={feeToken}
          left="Fee"
          right={`${formatUtil.amount(fee, feeToken.pDecimals)} ${feeToken.symbol}`}
          style={mainStyle.coinExtraSmall}
          wrapperStyle={mainStyle.coinExtraSmallWrapper}
        />
      </View>
    </View>
  );
};

Provide.propTypes = {
  coins: PropTypes.array,
  coin: PropTypes.object.isRequired,
  inputValue: PropTypes.number,
  inputText: PropTypes.string,
  onChangeInputText: PropTypes.func,
  prvBalance: PropTypes.number,
  fee: PropTypes.number,
  feeToken: PropTypes.object,
  error: PropTypes.string,
  payOnOrigin: PropTypes.bool.isRequired,
  isPrv: PropTypes.bool.isRequired
};

Provide.defaultProps = {
  inputValue: 0,
  inputText: '',
  onChangeInputText: undefined,
  prvBalance: 0,
  fee: 0,
  feeToken: null,
  error: '',
  coins: []
};

export default compose(
  withLayout_2,
  withCoinData,
  withChangeInput,
  withValidate,
)(Provide);


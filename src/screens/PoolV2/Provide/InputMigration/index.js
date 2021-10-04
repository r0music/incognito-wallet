import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, BaseTextInput, RoundCornerButton } from '@components/core';
import mainStyle from '@screens/PoolV2/style';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout/index';
import withCoinData from '@screens/PoolV2/Provide/InputMigration/coin.enhance';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import withChangeInput from '@screens/DexV2/components/Trade/input.enhance';
import withValidate from '@screens/PoolV2/validate.enhance';
import { useNavigation } from 'react-navigation-hooks';
import ROUTE_NAMES from '@routers/routeNames';
import { Header, Row } from '@src/components/';
import { BtnInfinite } from '@components/Button/index';
import convertUtil from '@utils/convert';
import formatUtil from '@utils/format';
import styles from './style';

const InputMigration = ({
  data,
  coin,
  inputValue,
  inputText,
  onChangeInputText,
  error,
  coins,
}) => {
  const navigation = useNavigation();

  const handleProvide = () => {
    navigation.navigate(ROUTE_NAMES.PoolV2ProvideMigrateConfirm, {
      data,
      coin,
      coins,
      value: inputValue,
      text: inputText,
    });
  };

  const handleMax = () => {
    const humanAmount = convertUtil.toHumanAmount(data.balance, coin.pDecimals);
    const fixDecimals = formatUtil.toFixed(humanAmount, coin.pDecimals);
    onChangeInputText(fixDecimals.toString());
  };

  return (
    <View style={mainStyle.flex}>
      <Header title='Migrate' />
      <View style={mainStyle.coinContainer}>
        <Row center spaceBetween style={mainStyle.inputContainer}>
          <BaseTextInput
            style={mainStyle.input}
            placeholder="0"
            onChangeText={onChangeInputText}
            value={inputText}
            keyboardType="decimal-pad"
          />
          <BtnInfinite style={mainStyle.symbol} onPress={handleMax} />
        </Row>
        {!!error && <Text style={mainStyle.error}>{error}</Text>}
        <Text style={mainStyle.coinExtraSmall}>Migrate your PRV from instant access to a fixed term ({coin?.lockTime} months) to get {coin?.apy}% APY.</Text>
        <RoundCornerButton
          title="Migrate"
          style={[mainStyle.button, styles.button]}
          onPress={handleProvide}
          disabled={!!error || !inputText}
        />
        <ExtraInfo
          left="Balance"
          right={`${data.displayFullBalance} ${coin.symbol}`}
          style={mainStyle.coinExtraSmall}
        />
      </View>
    </View>
  );
};

InputMigration.propTypes = {
  coins: PropTypes.array,
  data: PropTypes.object.isRequired,
  coin: PropTypes.object.isRequired,
  inputValue: PropTypes.number,
  inputText: PropTypes.string,
  onChangeInputText: PropTypes.func,
  error: PropTypes.string,
};

InputMigration.defaultProps = {
  inputValue: 0,
  inputText: '',
  onChangeInputText: undefined,
  error: '',
  coins: [],
};

export default compose(
  withLayout_2,
  withCoinData,
  withChangeInput,
  withValidate,
)(InputMigration);

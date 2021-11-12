import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import withToken from '@screens/Wallet/features/Home/Wallet.enhanceToken';
import { useSelector } from 'react-redux';
import { currencySelector } from '@screens/Setting';
import Swipeout from 'react-native-swipeout';
import { BtnDelete } from '@components/Button';
import {tokenStyled} from '@screens/Wallet/features/Home/Wallet.styled';
import {Row} from '@src/components';
import {formatAmount, formatPrice} from '@components/Token';
import format from '@utils/format';
import replace from 'lodash/replace';
import round from 'lodash/round';
import {COLORS} from '@src/styles';
import {TokenVerifiedIcon} from '@components/Icons';

const TokenDefault = React.memo((props) => {
  const { symbol, name, priceUsd, amount, pDecimals, decimalDigits, pricePrv, tokenId, change, onPress, isVerified } = props;
  const isToggleUSD = useSelector(currencySelector);
  const balance = React.useMemo(() => {
    const price = isToggleUSD ? priceUsd : pricePrv;
    const amountCompare = formatAmount(price, amount, pDecimals, pDecimals, decimalDigits, false);
    const tokenAmount = format.amountVer2(amount, pDecimals);
    const isTokenDecrease = change[0] === '-';
    const changeToNumber = Number(replace(change, '-', ''));
    const changeStr = changeToNumber === 0 ? '' : `${isTokenDecrease ? '-' : '+'}${round(changeToNumber, 2)}%`;
    const changeColor = isTokenDecrease ? COLORS.red2 : COLORS.green;
    return {
      amountCompare,
      price: formatPrice(price),
      tokenAmount,
      changeStr,
      changeColor
    };
  }, [priceUsd, pricePrv, amount, isToggleUSD]);
  return (
    <TouchableOpacity style={tokenStyled.container} onPress={onPress}>
      <View style={tokenStyled.wrapFirst}>
        <Row centerVertical>
          <Text numberOfLines={1} style={tokenStyled.blackText}>{symbol}</Text>
          {/*{isVerified && <TokenVerifiedIcon style={tokenStyled.icon} />}*/}
        </Row>
        <Text numberOfLines={1} style={tokenStyled.grayText}>{name}</Text>
      </View>
      <View style={tokenStyled.wrapSecond}>
        <Text numberOfLines={1} style={tokenStyled.blackText}>{balance.tokenAmount}</Text>
        <Text numberOfLines={1} style={tokenStyled.grayText}>{`${balance.amountCompare} ${symbol}`}</Text>
      </View>
      <View style={tokenStyled.wrapThird}>
        <Text numberOfLines={1} style={tokenStyled.blackText}>{balance.price}</Text>
        <Text numberOfLines={1} style={[tokenStyled.grayText, { color: balance.changeColor }]}>{balance.changeStr}</Text>
      </View>
      <TouchableOpacity style={tokenStyled.btnTrade}>
        <Text style={tokenStyled.labelTrade}>Trade</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

const Token = (props) => {
  const { handleRemoveToken, swipable } = props;
  if (swipable === true) {
    return (
      <Swipeout
        autoClose
        style={{
          backgroundColor: 'transparent',
          paddingBottom: 28
        }}
        right={[
          {
            component: (
              <BtnDelete
                showIcon={false}
                onPress={
                  typeof handleRemoveToken === 'function'
                    ? handleRemoveToken
                    : null
                }
              />
            ),
          },
        ]}
      >
        <TokenDefault {...props} />
      </Swipeout>
    );
  }
  return (
    <View style={{ paddingBottom: 28 }}>
      <TokenDefault {...props} />
    </View>
  );
};

Token.defaultProps = {
  displayName: 'Incognito Token',
  amount: 0,
  onPress: null,
  symbol: null,
  isGettingBalance: false,
  style: null,
  pDecimals: null,
  isVerified: false,
  iconUrl: null,
  amountInPRV: 0,
  price: 0,
  percentChange: 0,
  pricePrv: 0,
  swipable: false,
  handleRemoveToken: null
};
Token.propTypes = {
  pDecimals: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  displayName: PropTypes.string,
  amount: PropTypes.number,
  onPress: PropTypes.func,
  symbol: PropTypes.string,
  isGettingBalance: PropTypes.bool,
  style: PropTypes.any,
  isVerified: PropTypes.bool,
  iconUrl: PropTypes.string,
  amountInPRV: PropTypes.number,
  price: PropTypes.number,
  percentChange: PropTypes.number,
  pricePrv: PropTypes.number,
  swipable: PropTypes.bool,
  handleRemoveToken: PropTypes.func,
};
TokenDefault.propTypes = {
  symbol: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  priceUsd: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  pDecimals: PropTypes.string.isRequired,
  decimalDigits: PropTypes.string.isRequired,
  pricePrv: PropTypes.string.isRequired,
  tokenId: PropTypes.string.isRequired,
};

export default withToken(memo(Token));
import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import withToken from '@screens/Wallet/features/Home/Wallet.enhanceToken';
import { useSelector } from 'react-redux';
import { currencySelector, hideWalletBalanceSelector } from '@screens/Setting';
import Swipeout from 'react-native-swipeout';
import { tokenStyled } from '@screens/Wallet/features/Home/Wallet.styled';
import { ImageCached } from '@src/components';
import { formatAmount, formatPrice } from '@components/Token';
import format from '@utils/format';
import replace from 'lodash/replace';
import round from 'lodash/round';
import { COLORS, FONT } from '@src/styles';
import { ActivityIndicator } from '@components/core';
import { NormalText } from '@components/Token/Token';
import { itemStyled } from '@screens/Setting/features/Keychain/keychain.styled';
import { DeleteFillIcon } from '@components/Icons/icon.delete';
import incognito from '@assets/images/new-icons/incognito.png';
import { colorsSelector } from '@src/theme/theme.selector';
import nextFrame from '@src/utils/nextFrame';

const TokenDefault = React.memo((props) => {
  const {
    symbol,
    priceUsd,
    amount,
    pDecimals,
    decimalDigits,
    pricePrv,
    change,
    onPress,
    name,
    isGettingBalance,
    showGettingBalance,
    iconUrl,
  } = props;
  const shouldShowGettingBalance = isGettingBalance || showGettingBalance;
  const isToggleUSD = useSelector(currencySelector);
  const hideBalance = useSelector(hideWalletBalanceSelector);
  const colors = useSelector(colorsSelector);
  const balance = React.useMemo(() => {
    const price = isToggleUSD ? priceUsd : pricePrv;
    const amountCompare = formatAmount(
      price,
      amount,
      pDecimals,
      pDecimals,
      decimalDigits,
      false,
    );
    const tokenAmount = format.amountVer2(amount, pDecimals);
    const isTokenDecrease = change[0] === '-';
    const changeToNumber = Number(replace(change, '-', ''));
    const changeStr =
      changeToNumber === 0
        ? ''
        : `${isTokenDecrease ? '-' : '+'}${round(changeToNumber, 2)}%`;
    const changeColor = isTokenDecrease ? COLORS.red2 : COLORS.green;
    return {
      amountCompare,
      price: formatPrice(price),
      tokenAmount,
      changeStr,
      changeColor,
    };
  }, [priceUsd, pricePrv, amount, isToggleUSD]);

  return (
    <TouchableOpacity
      style={tokenStyled.container}
      onPress={async () => {
        await nextFrame();
        typeof onPress === 'function' && onPress();
      }}
    >
      <ImageCached
        style={tokenStyled.icon}
        uri={iconUrl}
        defaultImage={incognito}
      />
      <View style={tokenStyled.wrapFirst}>
        <NormalText style={tokenStyled.mainText} text={symbol} />
        <NormalText
          text={name}
          style={[tokenStyled.grayText, { color: colors.text3 }]}
        />
      </View>
      <View style={tokenStyled.wrapSecond}>
        {shouldShowGettingBalance ? (
          <View style={tokenStyled.wrapLoader}>
            <ActivityIndicator />
          </View>
        ) : (
          <NormalText
            text={balance.amountCompare}
            hasPSymbol
            style={tokenStyled.mainText}
            stylePSymbol={[
              tokenStyled.mainText,
              { fontFamily: FONT.NAME.specialRegular },
            ]}
            showBalance={!hideBalance}
          />
        )}
        <NormalText
          text={`${balance.tokenAmount} ${symbol}`}
          style={[tokenStyled.grayText, { color: colors.text3 }]}
          showBalance={!hideBalance}
          symbol={symbol}
        />
      </View>
    </TouchableOpacity>
  );
});

const Token = (props) => {
  const { handleRemoveToken, swipable } = props;
  const colors = useSelector(colorsSelector);
  if (swipable === true) {
    return (
      <Swipeout
        autoClose
        style={{
          ...itemStyled.swipeout,
          borderBottomColor: colors.border4,
        }}
        right={[
          {
            component: (
              <View style={itemStyled.wrapBin}>
                <DeleteFillIcon />
              </View>
            ),
            onPress: handleRemoveToken,
          },
        ]}
      >
        <TokenDefault {...props} />
      </Swipeout>
    );
  }
  return (
    <View
      style={{
        ...itemStyled.swipeout,
        borderBottomColor: colors.border4,
      }}
    >
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
  handleRemoveToken: null,
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
  priceUsd: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  pDecimals: PropTypes.string.isRequired,
  decimalDigits: PropTypes.string.isRequired,
  pricePrv: PropTypes.string.isRequired,
  change: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  isGettingBalance: PropTypes.bool.isRequired,
  showGettingBalance: PropTypes.bool.isRequired,
  iconUrl: PropTypes.string.isRequired,
};

export default withToken(memo(Token));

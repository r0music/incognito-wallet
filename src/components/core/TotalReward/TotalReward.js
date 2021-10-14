import React from 'react';
import {isNaN} from 'lodash';
import formatUtils from '@utils/format';
import {Text, View} from '@components/core';
import PRVSymbol from '@components/PRVSymbol';
import {CONSTANT_COMMONS} from '@src/constants';
import HelpIcon from '@components/HelpScreen/Icon';
import PropTypes from 'prop-types';
import Row from '@src/components/Row';
import convert from '@src/utils/convert';
import styled from './TotalReward.styled';

const TotalReward = ({ total, nativeToken, subTitle, style, balanceStyle, helperScreen }) => {

  const displayClipTotalUSDRewards = React.useMemo(() => {
    const pDecimals = nativeToken?.pDecimals || 0;

    const price = nativeToken?.priceUsd || 0;
    const totalAmountNumber = convert.toNumber(total, true);
    const totalAmountOriginal = convert.toOriginalAmount(totalAmountNumber, pDecimals, false);
    let totalAmount = convert.toNumber(totalAmountOriginal, true) * price;

    if (isNaN(totalAmount)) totalAmount = 0;

    return formatUtils.amountFull(totalAmount, pDecimals, true);
  }, [total, nativeToken]);

  return (
    <View style={style}>
      <Row center style={[styled.rewards, { marginBottom: 0 }, balanceStyle]}>
        <Text>
          <PRVSymbol style={styled.symbol} />
          &nbsp;
          <Text style={styled.amount}>{total}</Text>
        </Text>
      </Row>
      <Row center style={[styled.rewards, { marginTop: 0 }]}>
        <Text>
          <PRVSymbol
            style={styled.symbolUSD}
            symbol={CONSTANT_COMMONS.USD_SPECIAL_SYMBOL}
          />
          &nbsp;
          <Text style={styled.symbolUSD}>
            {displayClipTotalUSDRewards}
          </Text>
        </Text>
      </Row>
      {!!subTitle && (
        <Row center style={{marginTop: 8}}>
          <Text style={[styled.center, styled.rateStyle]}>
            {subTitle}
          </Text>
          <HelpIcon screen={helperScreen} style={styled.icon} />
        </Row>
      )}
    </View>
  );
};

TotalReward.propTypes = {
  total: PropTypes.string.isRequired,
  nativeToken: PropTypes.any,
  subTitle: PropTypes.string,
  style: PropTypes.any,
  balanceStyle: PropTypes.any,
  helperScreen: PropTypes.string
};

TotalReward.defaultProps = {
  nativeToken: {},
  subTitle: '',
  style: null,
  balanceStyle: null,
  helperScreen: ''
};

export default React.memo(TotalReward);

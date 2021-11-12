import React, { memo } from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { actionUpdateShowWalletBalance, showWalletBalanceSelector } from '@screens/Setting';
import {styled, styledBalance} from '@screens/Wallet/features/Home/Wallet.styled';
import {
  isGettingBalance as isGettingTotalBalanceSelector,
  totalShieldedTokensSelector
} from '@src/redux/selectors/shared';
import isNaN from 'lodash/isNaN';
import { Amount } from '@components/Token/Token';
import { PRV } from '@services/wallet/tokenService';

const Balance = React.memo(() => {
  let totalShielded = useSelector(totalShieldedTokensSelector);
  const isGettingTotalBalance =
    useSelector(isGettingTotalBalanceSelector).length > 0;
  if (isNaN(totalShielded)) {
    totalShielded = 0;
  }
  return (
    <View style={styledBalance.container}>
      <Text style={styledBalance.title}>Balance</Text>
      <Amount
        amount={totalShielded}
        pDecimals={PRV.pDecimals}
        showSymbol={false}
        isGettingBalance={isGettingTotalBalance}
        customStyle={styledBalance.balance}
        hasPSymbol
        stylePSymbol={styledBalance.pSymbol}
        containerStyle={styledBalance.balanceContainer}
        size="large"
        hideBalance={false}
        fromBalance
      />
    </View>
  );
});

const Extra = () => {
  const dispatch = useDispatch();
  const showBalance = useSelector(showWalletBalanceSelector);
  const updateShowBalance = () => dispatch(actionUpdateShowWalletBalance());
  return (
    <View>
      <Balance
        hideBalance={showBalance}
        onPressHideBalance={updateShowBalance}
      />
    </View>
  );
};

Extra.propTypes = {};

export default memo(Extra);

import React, {memo} from 'react';
import {View} from 'react-native';
import Header from '@components/Header';
import {STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {confirmStyle} from '@screens/PDexV3/features/Staking/Staking.styled';
import styles from '@screens/PoolV2/Provide/Confirm/style';
import {RoundCornerButton, ScrollView, Text} from '@components/core';
import {useSelector} from 'react-redux';
import {
  investPoolSelector,
  stakingFeeSelector,
  investInputAmount
} from '@screens/PDexV3/features/Staking/Staking.selector';
import {RowSpaceText} from '@src/components';
import mainStyles from '@screens/PoolV2/style';

const StakeMoreConfirm = () => {
  const coin = useSelector(investPoolSelector);
  const inputAmount = useSelector(investInputAmount);
  const fee = useSelector(stakingFeeSelector);
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.orderReview} />
      <ScrollView>
        <View style={confirmStyle.mainInfo}>
          <Text style={confirmStyle.bigText}>{STAKING_MESSAGES.staking}</Text>
          <Text style={styles.bigText} numberOfLines={3}>{inputAmount.inputText} {coin.token.symbol}</Text>
          <RowSpaceText label="Deposit" value={inputAmount.depositSymbolStr} style={{ marginTop: 30 }} />
          <RowSpaceText label="Fee" value={fee.feeAmountSymbolStr} />
          {/*{!!error && <Text style={styles.error}>{error}</Text>}*/}
          <RoundCornerButton
            style={[styles.button, mainStyles.button]}
            title="Confirm"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default memo(StakeMoreConfirm);

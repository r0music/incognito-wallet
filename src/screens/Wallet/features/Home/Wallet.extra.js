import React, { memo } from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { actionUpdateShowWalletBalance, showWalletBalanceSelector } from '@screens/Setting';
import { styledBalance, groupButtonStyled } from '@screens/Wallet/features/Home/Wallet.styled';
import {
  isGettingBalance as isGettingTotalBalanceSelector,
  totalShieldedTokensSelector
} from '@src/redux/selectors/shared';
import isNaN from 'lodash/isNaN';
import { Amount } from '@components/Token/Token';
import { PRV } from '@services/wallet/tokenService';
import { BTNBorder } from '@components/core/Button';
import { useNavigation } from 'react-navigation-hooks';
import { shieldStorageSelector } from '@screens/Shield/Shield.selector';
import routeNames from '@routers/routeNames';
import { actionToggleGuide } from '@screens/Shield/Shield.actions';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import appConstant from '@src/constants/app';
import Tooltip from '@components/Tooltip/Tooltip';
import { BtnClose } from '@components/Button';
import {Row} from '@src/components';

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
      <Row style={styledBalance.wrapBalance} center>
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
      </Row>
    </View>
  );
});

const Hook = React.memo(() => {
  const dispatch = useDispatch();
  const { guide } = useSelector(shieldStorageSelector);
  const handleCloseShield = async () => {
    if (!guide) {
      await dispatch(actionToggleGuide());
    }
  };
  return (
    <View style={groupButtonStyled.wrapHook}>
      <View style={groupButtonStyled.btnClose}>
        <BtnClose size={20} onPress={handleCloseShield} />
      </View>
      <Text style={groupButtonStyled.title}>
        {'Turn your public coins into\nprivacy coins.'}
      </Text>
      <Text style={groupButtonStyled.desc}>
        Enter the Incognito network and transact without a trace.
      </Text>
    </View>
  );
});

const GroupButton = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { guide } = useSelector(shieldStorageSelector);
  const handleShield = async () => {
    navigation.navigate(routeNames.Shield);
    if (!guide) {
      await dispatch(actionToggleGuide());
    }
  };
  const [onFeaturePress, isDisabled] = useFeatureConfig(
    appConstant.DISABLED.SHIELD,
    handleShield,
  );
  return (
    <View style={groupButtonStyled.container}>
      {!guide && (
        <Tooltip
          content={<Hook />}
          containerStyle={groupButtonStyled.tooltip}
          triangleStyle={groupButtonStyled.triangleStyle}
        />
      )}
      <BTNBorder
        disabled={isDisabled}
        onPress={onFeaturePress}
        title="Add crypto"
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
      <Balance hideBalance={showBalance} onPressHideBalance={updateShowBalance} />
      <GroupButton />
    </View>
  );
};

Extra.propTypes = {};

export default memo(Extra);

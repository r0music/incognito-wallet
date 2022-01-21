import React from 'react';
import PropTypes from 'prop-types';
import { RoundCornerButton } from '@components/core';
import ROUTE_NAMES from '@routers/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import { Row } from '@src/components/';
import mainStyle from '@screens/PoolV2/style';
import globalStyled from '@src/theme/theme.styled';
import { BtnSecondary } from '@components/core/Button';
import styles from './style';

const Actions = ({
  buy,
  coins,
  groupedCoins,
  data,
  totalRewardsNonLock,
  displayFullTotalRewardsNonLock
}) => {
  const navigation = useNavigation();

  const handleBuy = () => {
    navigation.navigate(ROUTE_NAMES.Trade);
  };

  const handleWithdraw = () => {
    navigation.navigate(ROUTE_NAMES.PoolV2WithdrawSelectCoin, {
      data,
      totalRewardsNonLock,
      displayFullTotalRewardsNonLock,
    });
  };

  const handleProvide = () => {
    navigation.navigate(ROUTE_NAMES.PoolV2ProvideSelectCoin, {
      coins: groupedCoins
    });
  };

  const provideButton = (
    <RoundCornerButton
      title={buy ? 'Provide now' : 'Provide more'}
      style={[styles.actionButton, mainStyle.button]}
      onPress={handleProvide}
    />
  );
  const buyButton = (
    <BtnSecondary
      title="Buy crypto"
      wrapperStyle={[styles.actionButton, mainStyle.button]}
      onPress={handleBuy}
    />
  );
  const withdrawButton = (
    <BtnSecondary
      title="Withdraw"
      wrapperStyle={[styles.actionButton, mainStyle.button]}
      onPress={handleWithdraw}
    />
  );

  return (
    <Row spaceBetween style={[styles.actions, globalStyled.defaultPaddingHorizontal]}>
      {buy ? buyButton : withdrawButton}
      {provideButton}
    </Row>
  );
};

Actions.propTypes = {
  buy: PropTypes.bool,
  coins: PropTypes.array,
  groupedCoins: PropTypes.array,
  data: PropTypes.array,
  totalRewardsNonLock: PropTypes.number,
  displayFullTotalRewardsNonLock: PropTypes.string,
};

Actions.defaultProps = {
  buy: false,
  coins: [],
  groupedCoins: [],
  data: [],
  totalRewardsNonLock: 0,
  displayFullTotalRewardsNonLock: '',
};

export default React.memo(Actions);

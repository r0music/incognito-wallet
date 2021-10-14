import React, {memo} from 'react';
import {RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Header, Row, RowSpaceText} from '@src/components';
import {STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {useFocusEffect, useNavigation, useNavigationParam} from 'react-navigation-hooks';
import {useDispatch, useSelector} from 'react-redux';
import {stakingActions, stakingSelector} from '@screens/PDexV3/features/Staking/index';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {COLORS} from '@src/styles';
import {ArrowDown} from '@components/Icons';
import {BTNBorder, BTNPrimary} from '@components/core/Button';
import {HeaderRow, OneRowCoin} from '@screens/PDexV3/features/Staking/Staking.item';
import isEmpty from 'lodash/isEmpty';
import {isFetchingNFTSelector} from '@src/redux/selectors/account';
import debounce from 'lodash/debounce';
import routeNames from '@routers/routeNames';
import {actionToggleModal} from '@components/Modal';
import ModalBottomSheet from '@components/Modal/features/ModalBottomSheet';
import withTransaction from '@screens/PDexV3/features/Staking/Staking.transaction';
import PropTypes from 'prop-types';
import {Icon} from '@components/Token/Token.shared';

const PortfolioDetail = ({ onWithdrawReward, error, setError }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const tokenId = useNavigationParam('tokenId');
  const coin = useSelector(stakingSelector.stakingCoinByTokenIDSelector)(tokenId);
  const pool = useSelector(stakingSelector.stakingPoolByTokenId)(tokenId);
  const { feeAmount } = useSelector(stakingSelector.stakingFeeSelector);
  const loading = useSelector(isFetchingNFTSelector);
  const onFetchData = () => {
    dispatch(stakingActions.actionFetchCoins());
    setError('');
  };
  const debounceFetchData = debounce(React.useCallback(onFetchData, []), 300);
  const renderModelCell = (data) => <OneRowCoin token={data.token} valueText={data.rewardStr} />;
  const showDetailReward = () => {
    const { rewardsMerged } = coin.reward || {};
    if (isEmpty(rewardsMerged)) return;
    dispatch(actionToggleModal({
      data: (
        <ModalBottomSheet
          title='Rewards'
          headerView={<HeaderRow array={['Name', 'Amount']} />}
          contentView={<View style={{ marginTop: 24 }}>{rewardsMerged.map(renderModelCell)}</View>}
        />
      ),
      visible: true,
      shouldCloseModalWhenTapOverlay: true
    }));
  };

  const renderWarning = (hasPendingNFT, cantWithdraw) => {
    if (cantWithdraw) return <Text style={coinStyled.warning}>{STAKING_MESSAGES.cantWithdraw}</Text>;
    if (hasPendingNFT) STAKING_MESSAGES.pendingNFTs(() => navigation.navigate(routeNames.NFTToken));
    return null;
  };
  const renderMainContent = () => {
    const { token, staking, inValidNFTs, hasValidNFT } = coin;
    const hasPendingNFT = isEmpty(inValidNFTs);
    const cantWithdraw = staking.stakingAmount && !hasValidNFT;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onFetchData} />
          }
        >
          <Row spaceBetween style={{ marginBottom: 32, marginTop: 24 }}>
            <Row centerVertical>
              <Icon iconUrl={token.iconUrl} style={coinStyled.image} />
              <Text style={[coinStyled.coinName, { marginLeft: 12 }]}>{token.symbol}</Text>
            </Row>
            <Text style={coinStyled.coinName}>{staking.stakingAmountStr}</Text>
          </Row>
          <RowSpaceText
            label="APY"
            leftStyle={coinStyled.regularGray}
            rightStyle={coinStyled.regularDark}
            value={pool.apyStr}
          />
          <RowSpaceText
            label="Reward"
            leftStyle={coinStyled.regularGray}
            customRight={(
              <TouchableOpacity style={coinStyled.rowCenterVertical} onPress={showDetailReward}>
                <Text
                  style={[
                    coinStyled.regularDark,
                    { marginRight: 5  },
                    !!coin.reward.totalRewardUSD && { color: COLORS.green2 }
                  ]}
                >
                  {`+ ${coin.reward.totalRewardUSDStr}`}
                </Text>
                {!!coin.reward.totalRewardUSD && (<ArrowDown />)}
              </TouchableOpacity>
            )}
          />
          {renderWarning(hasPendingNFT, cantWithdraw)}
          {!!error && <Text style={coinStyled.error}>{error}</Text>}
        </ScrollView>
      </View>
    );
  };
  const onSubmit = () => {
    if (!coin.withdrawReward.withdrawRewardNFT || coin.withdrawReward.withdrawRewardNFT.length === 0) return;
    const params = coin.withdrawReward.withdrawRewardNFT.map(nftId => ({ nftID: nftId, stakingTokenID: coin.tokenId, fee: feeAmount }));
    onWithdrawReward(params);
  };
  const renderContent = () => {
    if (!coin || !pool) return null;
    const { disableAction, reward } = coin;
    return(
      <View style={{ justifyContent: 'space-between', flex: 1 }}>
        {renderMainContent()}
        <SafeAreaView>
          <BTNBorder
            title={STAKING_MESSAGES.withdrawStaking}
            disabled={disableAction}
            onPress={() => {
              navigation.navigate(routeNames.StakingWithdrawInvest);
              dispatch(stakingActions.actionSetWithdrawInvestCoin({ tokenID: tokenId }));
            }}
          />
          {!!reward.totalRewardUSD && (
            <BTNPrimary
              title={STAKING_MESSAGES.withdrawReward}
              disabled={disableAction}
              onPress={onSubmit}
            />
          )}
        </SafeAreaView>
      </View>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      debounceFetchData();
    }, [])
  );

  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.staking} />
      {renderContent()}
    </View>
  );
};

PortfolioDetail.defaultProps = {
  error: undefined
};

PortfolioDetail.propTypes = {
  onWithdrawReward: PropTypes.func.isRequired,
  error: PropTypes.string,
  setError: PropTypes.func.isRequired
};

export default withTransaction(memo(PortfolioDetail));

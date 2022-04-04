import React from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { View } from '@src/components/core';
import { View2 } from '@src/components/core/View';
import globalStyled from '@src/theme/theme.styled';
import Header from '@src/components/Header';
import {
  selectedPrivacySelector,
  sharedSelector,
  tokenSelector,
  accountSelector,
} from '@src/redux/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { BtnInfo } from '@src/components/Button';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { Amount, ChangePrice, Price } from '@src/components/Token/Token';
import HistoryToken from '@screens/Wallet/features/HistoryToken';
import MainCryptoHistory from '@screens/Wallet/features/MainCryptoHistory';
import { isGettingBalance as isGettingTokenBalanceSelector } from '@src/redux/selectors/token';
import { isGettingBalance as isGettingMainCryptoBalanceSelector } from '@src/redux/selectors/account';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import { useHistoryEffect } from '@screens/Wallet/features/History';
import appConstant from '@src/constants/app';
import { actionChangeTab } from '@components/core/Tabs/Tabs.actions';
import {
  ROOT_TAB_TRADE,
  TAB_BUY_LIMIT_ID,
  TAB_SELL_LIMIT_ID,
} from '@screens/PDexV3/features/Trade/Trade.constant';
import {
  actionInit,
  actionSetPoolSelected,
} from '@screens/PDexV3/features/OrderLimit';
import { BtnSecondary, BtnPrimary } from '@components/core/Button';
import { COLORS } from '@src/styles';
import { ThreeDotsVerIcon } from '@components/Icons';
import { actionToggleModal } from '@components/Modal';
import ModalBottomSheet from '@components/Modal/features/ModalBottomSheet';
import { Row } from '@src/components';
import { colorsSelector } from '@src/theme';
import withLazy from '@components/LazyHoc/LazyHoc';
import { followTokenItemSelector } from '@screens/Wallet/features/FollowList/FollowList.selector';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { groupBtnStyled, balanceStyled, historyStyled } from './Detail.styled';

const GroupButton = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selected = useDebounceSelector(selectedPrivacySelector.selectedPrivacy);
  const handleBuy = () => {
    navigation.navigate(routeNames.Trade, { tabIndex: 0 });
    const poolId = selected.defaultPoolPair;
    if (poolId) {
      dispatch(
        actionChangeTab({ rootTabID: ROOT_TAB_TRADE, tabID: TAB_BUY_LIMIT_ID }),
      );
      dispatch(actionSetPoolSelected(poolId));
      setTimeout(() => {
        dispatch(actionInit());
      }, 200);
    }
  };
  const handleSell = () => {
    const poolId = selected.defaultPoolPair;
    navigation.navigate(routeNames.Trade, { tabIndex: 1 });
    if (poolId) {
      dispatch(
        actionChangeTab({
          rootTabID: ROOT_TAB_TRADE,
          tabID: TAB_SELL_LIMIT_ID,
        }),
      );
      dispatch(actionSetPoolSelected(poolId));
      setTimeout(() => {
        dispatch(actionInit());
      }, 200);
    }
  };

  return (
    <SafeAreaView>
      <View2
        style={[
          groupBtnStyled.groupButton,
          { ...globalStyled.defaultPaddingHorizontal },
        ]}
      >
        <BtnPrimary
          title="Buy"
          wrapperStyle={groupBtnStyled.btnStyle}
          background={COLORS.green}
          onPress={handleBuy}
        />
        <BtnPrimary
          title="Sell"
          wrapperStyle={groupBtnStyled.btnStyle}
          background={COLORS.red2}
          onPress={handleSell}
        />
      </View2>
    </SafeAreaView>
  );
});

const Balance = React.memo(() => {
  const selected = useDebounceSelector(selectedPrivacySelector.selectedPrivacy);
  const tokenID = useNavigationParam('tokenId');
  const token = useDebounceSelector(followTokenItemSelector)(tokenID);
  const colors = useDebounceSelector(colorsSelector);
  const isGettingBalance = useDebounceSelector(
    sharedSelector.isGettingBalance,
  ).includes(selected?.tokenId);
  const tokenData = {
    ...selected,
    isGettingBalance,
  };
  const amountProps = {
    customStyle: balanceStyled.amount,
    ...tokenData,
    showSymbol: false,
  };
  const changePriceProps = {
    customStyle: balanceStyled.changePrice,
    ...tokenData,
  };
  return (
    <View style={balanceStyled.container}>
      <Amount {...amountProps} amount={token?.amount} />
      <View style={balanceStyled.hook}>
        <Price
          pricePrv={selected.pricePrv}
          priceUsd={selected.priceUsd}
          textStyle={{ color: colors.text3 }}
        />
        <ChangePrice {...changePriceProps} />
      </View>
    </View>
  );
});

const History = React.memo(() => {
  const selectedPrivacy = useDebounceSelector(
    selectedPrivacySelector.selectedPrivacy,
  );
  return (
    <View style={[historyStyled.container, { marginTop: 12 }]}>
      {selectedPrivacy?.isMainCrypto ? <MainCryptoHistory /> : <HistoryToken />}
    </View>
  );
});

const CustomRightHeader = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleSend = () => {
    navigation.navigate(routeNames.Send);
    dispatch(actionToggleModal({ visible: false }));
  };
  const handleReceive = () => {
    navigation.navigate(routeNames.ReceiveCrypto);
    dispatch(actionToggleModal({ visible: false }));
  };
  const [onPressSend, isSendDisabled] = useFeatureConfig(
    appConstant.DISABLED.SEND,
    handleSend,
  );
  const onToggle = () => {
    dispatch(
      actionToggleModal({
        data: (
          <ModalBottomSheet
            style={{ height: '15%' }}
            contentView={
              <Row style={[groupBtnStyled.groupButton, { paddingVertical: 0 }]}>
                <BtnSecondary
                  title="Receive"
                  wrapperStyle={[groupBtnStyled.btnStyle, { marginTop: 0 }]}
                  onPress={handleReceive}
                />
                <BtnPrimary
                  title="Send"
                  wrapperStyle={groupBtnStyled.btnStyle}
                  onPress={onPressSend}
                  disabled={isSendDisabled}
                />
              </Row>
            }
          />
        ),
        visible: true,
        shouldCloseModalWhenTapOverlay: true,
      }),
    );
  };
  return (
    <TouchableOpacity
      style={{ height: 30, justifyContent: 'center' }}
      onPress={onToggle}
    >
      <ThreeDotsVerIcon />
    </TouchableOpacity>
  );
};

const Detail = (props) => {
  const navigation = useNavigation();
  const selected = useDebounceSelector(selectedPrivacySelector.selectedPrivacy);
  const { isFetching } = useDebounceSelector(
    tokenSelector.historyTokenSelector,
  );
  const token = useDebounceSelector(
    selectedPrivacySelector.selectedPrivacyByFollowedSelector,
  );
  const isGettingTokenBalance = useDebounceSelector(
    isGettingTokenBalanceSelector,
  );
  const isGettingMainCryptoBalance = useDebounceSelector(
    isGettingMainCryptoBalanceSelector,
  );
  const defaultAccount = useDebounceSelector(
    accountSelector.defaultAccountSelector,
  );
  const refreshing =
    !!isFetching || selected?.isMainCrypto
      ? isGettingMainCryptoBalance.length > 0 || !defaultAccount
      : isGettingTokenBalance.length > 0 || !token;
  const onGoBack = () => navigation.navigate(routeNames.Wallet);
  const { onRefresh } = useHistoryEffect();
  return (
    <View2 fullFlex>
      <Header
        title={selected?.name}
        customHeaderTitle={<BtnInfo />}
        rightHeader={<CustomRightHeader />}
        onGoBack={onGoBack}
        handleSelectedAccount={onRefresh}
      />
      <View borderTop fullFlex>
        <View borderTop paddingHorizontal style={{ paddingBottom: 0 }}>
          <Balance />
        </View>
        <History {...{ ...props, refreshing }} />
      </View>
      <GroupButton />
    </View2>
  );
};

Detail.propTypes = {};

History.propTypes = {};

export default withLazy(React.memo(Detail));

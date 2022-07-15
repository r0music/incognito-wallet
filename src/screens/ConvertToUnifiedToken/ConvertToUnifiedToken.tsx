import { Button, View, ActivityIndicator } from '@src/components/core';
import Empty from '@src/components/Empty';
import { MAX_FEE_PER_TX } from '@src/components/EstimateFee/EstimateFee.utils';
import Header from '@src/components/Header';
import { withLayout_2 } from '@src/components/Layout';
import ModalConfirm from '@src/components/Modal/ModalConfirm';
import { COINS, CONSTANT_CONFIGS } from '@src/constants';
import { defaultAccountSelector } from '@src/redux/selectors/account';
import { walletSelector } from '@src/redux/selectors/wallet';
import routeNames from '@src/router/routeNames';
import accountService from '@src/services/wallet/accountService';
import { COLORS } from '@src/styles';
import { PrivacyVersion } from 'incognito-chain-web-js/build/wallet';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, TextStyle, ViewStyle } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import appConstant from '@src/constants/app';
import { ConvertItem } from './ConvertItem';
import {
  setListTokenConvert,
  updateSelectedTokenToConvert,
} from './state/operations';
import {
  listTokenConvertSelector,
  listUnifiedTokenSelectedSelector,
  listUnifiedTokenSelector,
  loadingGetListUnifiedTokenSelector,
} from './state/selectors';
import BtnInfo from './BtnInfo';

const ConvertToUnifiedToken: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const account: any = useSelector(defaultAccountSelector);
  const wallet: any = useSelector(walletSelector);
  const listPTokenConvert = useSelector(listTokenConvertSelector);

  const [isVisibleModalWarning, setIsVisibleModalWarning] =
    useState<boolean>(false);

  const [isVisibleModalConfirm, setIsVisibleModalConfirm] =
    useState<boolean>(false);

  const [enableFaucet, setEnableFaucet] = useState<boolean>(false);

  useEffect(() => {
    dispatch(setListTokenConvert());
  }, []);

  const listUnifiedTokenConvert = useSelector(listUnifiedTokenSelector);

  const isLoading: boolean = useSelector(loadingGetListUnifiedTokenSelector);

  const listUnifiedTokenConvertSelected = useSelector(
    listUnifiedTokenSelectedSelector,
  );

  const keyExtractor = useCallback((item) => item?.id?.toString(), []);

  const onSelectTokenConvert = (tokenId: string) => {
    dispatch(updateSelectedTokenToConvert(tokenId));
  };

  const [onPress, isDisabledConvert] = useFeatureConfig(
    appConstant.DISABLED.CONVERT_UNIFY,
  );

  const renderItem = useCallback(
    ({ item }) => (
      <ConvertItem
        unifiedTokenData={item}
        onSelect={() => onSelectTokenConvert(item?.tokenId)}
        selected={item?.selected}
      />
    ),
    [],
  );

  const renderItemSeparatorComponent = useCallback(
    () => <View style={itemSpace} />,
    [],
  );

  const checkPRVBalance = async () => {
    // get PRV balance
    const prvBalance = await accountService.getBalance({
      account,
      wallet,
      tokenID: COINS.PRV_ID,
      version: PrivacyVersion?.ver2,
    });
    let minimumPRVBalanceToCreateTransaction =
      MAX_FEE_PER_TX * listPTokenConvert?.length * 2;
    if (minimumPRVBalanceToCreateTransaction < 1000) {
      minimumPRVBalanceToCreateTransaction = 1000;
    }
    if (prvBalance >= minimumPRVBalanceToCreateTransaction) {
      return true;
    }
    return false;
  };

  const checkEnableFaucet = async () => {
    const prvBalance: number = await accountService.getBalance({
      account,
      wallet,
      tokenID: COINS.PRV_ID,
      version: PrivacyVersion?.ver2,
    });
    let minimumPRVBalanceToCreateTransaction =
      MAX_FEE_PER_TX * listPTokenConvert?.length * 2;
    if (minimumPRVBalanceToCreateTransaction - prvBalance > 1000) {
      return false;
    }
    return true;
  };

  const onPressButtonConvert = async () => {
    // If enough PRV balance to create transaction => navigate to Convert screen
    // if not enough PRV balance => show popup swap or faucet
    const isEnoughPrvBalance: boolean = await checkPRVBalance();
    if (isEnoughPrvBalance) {
      setIsVisibleModalConfirm(true);
    } else {
      const isEnableFaucet: boolean = await checkEnableFaucet();
      if (isEnableFaucet) {
        setEnableFaucet(true);
      } else {
        setEnableFaucet(false);
      }
      setIsVisibleModalWarning(true);
    }
  };

  const goToFaucet = async () => {
    if (!enableFaucet) return;
    setIsVisibleModalWarning(false);
    const params = {
      url: CONSTANT_CONFIGS.FAUCET_URL + `address=${account?.paymentAddress}`,
    };
    navigation.navigate(routeNames.WebView, params);
  };

  const goToSwaps = () => {
    setIsVisibleModalWarning(false);
    navigation.navigate(routeNames.Trade, {
      tabIndex: 2,
    });
  };

  const renderListEmptyComponent = useCallback(() => <Empty />, []);

  return (
    <>
      <Header
        title="Unify coins"
        accountSelectable
        customHeaderTitle={<BtnInfo />}
        handleSelectedAccount={() => dispatch(setListTokenConvert())}
      />
      <View borderTop fullFlex>
        {isLoading ? (
          <ActivityIndicator size="large" style={loadingIndicatorStyle} />
        ) : (
          <FlatList
            data={listUnifiedTokenConvert}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={renderItemSeparatorComponent}
            contentContainerStyle={flatListContentContainerStyle}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            windowSize={10}
            ListEmptyComponent={renderListEmptyComponent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <View style={bottomButtonContainerStyle}>
        <Button
          title="Unify"
          onPress={onPressButtonConvert}
          disabled={
            !listUnifiedTokenConvertSelected.length ||
            isLoading ||
            isDisabledConvert
          }
          disabledStyle={disabledButtonStyle}
          titleStyle={buttonTitleStyle}
          buttonStyle={buttonStyle}
          disabledTitleStyle={buttonTitleStyle}
        />
      </View>
      {/* Modal swap or faucet*/}
      <ModalConfirm
        isVisible={isVisibleModalWarning}
        title="Where can I get some?"
        description={
          enableFaucet
            ? 'Please go to Swap or Faucet to get more PRV to create converting transactions.'
            : 'Please go to Swap to get more PRV to create converting transactions.'
        }
        onPressLeftButton={() => goToSwaps()}
        onPressRightButton={() => goToFaucet()}
        leftButtonTitle="Swap"
        leftButtonStyle={swapButtonStyle}
        leftButtonTitleStyle={swapButtonTitle}
        rightButtonTitle="Faucet"
        hideRightButton={!enableFaucet}
        disabledRightButton={!enableFaucet}
        onBackdropPress={() => setIsVisibleModalWarning(false)}
      />
      {/* Modal confirm */}
      <ModalConfirm
        isVisible={isVisibleModalConfirm}
        title="Unify coins"
        description="Are you sure to unify your coins?"
        onPressLeftButton={() => setIsVisibleModalConfirm(false)}
        onPressRightButton={() => {
          setIsVisibleModalConfirm(false);
          navigation.navigate(routeNames.ProcessConvertToUnifiedToken);
        }}
        leftButtonTitle="Cancel"
        rightButtonTitle="Confirm"
        onBackdropPress={() => setIsVisibleModalConfirm(false)}
      />
    </>
  );
};

export default withLayout_2(ConvertToUnifiedToken);

const itemSpace: ViewStyle = {
  width: '100%',
  height: 16,
};

const flatListContentContainerStyle: ViewStyle = {
  flexGrow: 1,
  paddingHorizontal: 16,
  paddingVertical: 24,
};

const loadingIndicatorStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
};

const bottomButtonContainerStyle: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 16,
};

const buttonStyle: ViewStyle = {
  width: '100%',
  height: 50,
  borderRadius: 8,
};

const swapButtonStyle: ViewStyle = {
  backgroundColor: COLORS.white,
  opacity: 1,
};

const swapButtonTitle: TextStyle = {
  color: COLORS.blue5,
};

const disabledButtonStyle: ViewStyle = {
  backgroundColor: COLORS.lightGrey35,
};

const buttonTitleStyle: TextStyle = {
  color: COLORS.white,
};

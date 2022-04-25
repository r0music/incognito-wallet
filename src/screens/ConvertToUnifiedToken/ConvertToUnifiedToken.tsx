import { Button, RefreshControl, View } from '@src/components/core';
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
    if (prvBalance > minimumPRVBalanceToCreateTransaction) {
      return true;
    }
    return false;
  };

  const onPressButtonConvert = async () => {
    // If enough PRV balance to create transaction => navigate to Convert screen
    // if not enough PRV balance => show popup swap or faucet
    const isEnoughPrvBalance: boolean = await checkPRVBalance();
    if (isEnoughPrvBalance) {
      setIsVisibleModalConfirm(true);
    } else {
      setIsVisibleModalWarning(true);
    }
  };

  const goToFaucet = () => {
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
        title="Convert coins"
        accountSelectable
        handleSelectedAccount={() => dispatch(setListTokenConvert())}
      />
      <View borderTop fullFlex>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => dispatch(setListTokenConvert())}
            />
          }
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
        />
      </View>
      <View style={bottomButtonContainerStyle}>
        <Button
          title="Convert"
          onPress={onPressButtonConvert}
          disabled={!listUnifiedTokenConvertSelected.length || isLoading}
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
        description="Please go to Swap or Faucet to get more PRV to create converting transactions."
        onPressLeftButton={() => goToSwaps()}
        onPressRightButton={() => goToFaucet()}
        leftButtonTitle="Swap"
        rightButtonTitle="Faucet"
        onBackdropPress={() => setIsVisibleModalWarning(false)}
      />
      {/* Modal confirm */}
      <ModalConfirm
        isVisible={isVisibleModalConfirm}
        title="Convert unified coins"
        description="Are you sure to convert your coins to unified coins?"
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

const bottomButtonContainerStyle: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 16,
};

const buttonStyle: ViewStyle = {
  width: '100%',
  height: 50,
  borderRadius: 8,
};

const disabledButtonStyle: ViewStyle = {
  backgroundColor: COLORS.lightGrey35,
};

const buttonTitleStyle: TextStyle = {
  color: COLORS.white,
};

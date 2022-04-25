import { ExHandler } from '@services/exception';
import { Button, ScrollViewBorder, Text, View } from '@src/components/core';
import Header from '@src/components/Header';
import { withLayout_2 } from '@src/components/Layout';
import { CONSTANT_COMMONS } from '@src/constants';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import { selectedPrivacySelector } from '@src/redux/selectors';
import routeNames from '@src/router/routeNames';
import { PRV_ID } from '@src/screens/DexV2/constants';
import withBridgeConnect from '@src/screens/Wallet/features/BridgeConnect/WalletConnect.enhance';
import { COLORS } from '@src/styles';
import React, { useState } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import { ListItem } from './ListItem';

const ChooseNetworkForShield: React.FC = (props) => {
  // get route params
  const tokenInfo = useNavigationParam('tokenShield');

  const getPrivacyDataByTokenID = useSelector(
    selectedPrivacySelector.getPrivacyDataByTokenID,
  );

  const dispatch = useDispatch();

  const getNetworks = () => {
    let networks: SelectedPrivacy[] =
      tokenInfo?.isPUnifiedToken && tokenInfo.listUnifiedToken
        ? tokenInfo.listUnifiedToken
        : [tokenInfo];
    return networks;
  };

  const networks = getNetworks();

  // state
  const [selectedNetwork, setSelectedNetwork] = useState<SelectedPrivacy>(
    networks?.length === 1 ? networks[0] : null,
  );
  const [selectedSubView, setSelectedSubView] = useState<
    'GENERATE_ADDRESS' | 'CONNECT_WALLET'
  >(null);

  const navigation = useNavigation();

  // Check token belong to Polygon network
  const isPolygonToken =
    selectedNetwork?.isPolygonErc20Token ||
    selectedNetwork?.currencyType ===
      CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC;

  // Check token belong to Fantom network
  const isFantomToken =
    selectedNetwork?.isFantomErc20Token ||
    selectedNetwork?.currencyType ===
      CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.FTM;

  // Only show Sub View when selected network is Ethereum of Binance Smart Chain
  const isShowSubView = (): boolean => {
    const isPRV = selectedNetwork?.tokenId === PRV_ID;
    if (
      selectedNetwork?.isDecentralized &&
      !isPRV &&
      !isPolygonToken &&
      !isFantomToken
    ) {
      return true;
    }
    return false;
  };

  const isDisabledNextButton = () => {
    if (!selectedNetwork) return true;
    if (selectedNetwork && isShowSubView() && !selectedSubView) return true;
    return false;
  };

  const navigateToShieldGenerateQrCodeScreen = () => {
    if (!selectedNetwork) return;
    const tokenShieldSelectedPrivacy = getPrivacyDataByTokenID(
      selectedNetwork?.tokenId,
    );
    const params = {
      tokenShield: tokenShieldSelectedPrivacy,
      selectedTerm: selectedSubView,
    };
    navigation.navigate(routeNames.ShieldGenQRCode, params);
  };

  const handleConnectWallet = () => {
    if (typeof props?.handleConnect === 'function') {
      (async () => {
        try {
          const isConnected = await props?.handleConnect?.();
          if (!isConnected) {
            new ExHandler(
              null,
              'WalletConnect connection rejected',
            ).showErrorToast();
            return;
          }
          navigateToShieldGenerateQrCodeScreen();
        } catch (e) {
          new ExHandler(e).showErrorToast();
          return;
        }
      })();
    }
  };

  const onNext = async () => {
    if (selectedNetwork?.networkId === 'INCOGNITO') {
      await dispatch(setSelectedPrivacy(tokenInfo?.tokenId));
      navigation.navigate(routeNames.ReceiveCrypto);
    }
    if (isShowSubView()) {
      if (selectedSubView === 'GENERATE_ADDRESS') {
        navigateToShieldGenerateQrCodeScreen();
      }
      if (selectedSubView === 'CONNECT_WALLET') {
        handleConnectWallet();
      }
    } else {
      navigateToShieldGenerateQrCodeScreen();
    }
  };

  const renderSubView = () => {
    const subViewItems = [
      {
        key: 'GENERATE_ADDRESS',
        label: 'Generate a shielding address',
      },
      {
        key: 'CONNECT_WALLET',
        label: `Connect your ${selectedNetwork?.network} wallet`,
      },
    ];
    return (
      <View style={subViewContainerStyle}>
        <Text style={descStyle}>
          To anonymize your coins, you’ll need to send funds to Incognito. You
          can simply generate a shielding address, or connect directly with the
          bridge smart contract using your {selectedNetwork?.network} wallet.
        </Text>
        {subViewItems?.map((item: any, i) => {
          return (
            <ListItem
              key={i}
              content={item?.label}
              onPress={() => setSelectedSubView(item?.key)}
              selected={selectedSubView === item?.key}
            />
          );
        })}
      </View>
    );
  };

  const renderNetworks = () => {
    return (
      <>
        {networks?.map((item, i) => {
          return (
            <ListItem
              key={i}
              content={item?.network}
              onPress={() => {
                if (selectedNetwork?.networkId === item?.networkId) return;
                setSelectedNetwork(item);
                setSelectedSubView(null);
              }}
              selected={selectedNetwork?.networkId === item?.networkId}
              disabled={
                networks?.length === 1 &&
                selectedNetwork.networkId === item?.networkId
              }
            />
          );
        })}
      </>
    );
  };

  return (
    <>
      <Header title={`Shield ${tokenInfo?.symbol}`} />
      <ScrollViewBorder
        style={scrollViewContainerStyle}
        contentContainerStyle={scrollViewContentContainerStyle}
      >
        <Text style={titleStyle}>Choose network type</Text>
        <Text style={descStyle}>
          Ensure the network you choose to shield matches your funds networks,
          or assets maybe lost.
        </Text>
        {renderNetworks()}
        {isShowSubView() && renderSubView()}
      </ScrollViewBorder>
      <View style={bottomButtonContainerStyle}>
        <Button
          title="Next"
          disabled={isDisabledNextButton()}
          onPress={onNext}
          style={buttonStyle}
        />
      </View>
    </>
  );
};

export default compose(
  withBridgeConnect,
  withLayout_2,
)(React.memo(ChooseNetworkForShield));

const scrollViewContainerStyle: ViewStyle = {
  paddingHorizontal: 0,
  paddingVertical: 0,
};

const scrollViewContentContainerStyle: ViewStyle = {
  flexGrow: 1,
  padding: 24,
};

const titleStyle: TextStyle = {
  fontSize: 20,
  fontWeight: '500',
  textAlign: 'center',
  letterSpacing: 0.2,
};

const descStyle: TextStyle = {
  fontSize: 14,
  color: COLORS.lightGrey36,
  marginVertical: 8,
  letterSpacing: 0.2,
};

const bottomButtonContainerStyle: ViewStyle = {
  padding: 24,
};

const buttonStyle: ViewStyle = {
  height: 50,
};

const subViewContainerStyle: ViewStyle = {
  marginTop: 24,
};

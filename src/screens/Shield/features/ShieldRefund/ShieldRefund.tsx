import { CopiableTextDefault as CopiableText } from '@src/components/CopiableText';
import {
  Button,
  ScrollViewBorder,
  Text,
  View,
  ActivityIndicator,
} from '@src/components/core';
import Header from '@src/components/Header';
import { CheckedBlueIcon } from '@src/components/Icons';
import { withLayout_2 } from '@src/components/Layout';
import ModalConfirm from '@src/components/Modal/ModalConfirm';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import { historyDetailSelector } from '@src/redux/selectors/history';
import {
  checkShieldRefundInfo,
  submitShieldRefund,
} from '@src/services/api/deposit';
import { ExHandler } from '@src/services/exception';
import { COLORS } from '@src/styles';
import React, { useEffect, useState } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { useSelector } from 'react-redux';

interface ShieldRefundData {
  fee: number;
  feeFormat: string;
  currentBalance: number;
  symbol: string;
  address: string;
  allowedRefund: boolean;
  msg: string;
  network: string;
  userRefundAddress: string;
}

const ShieldRefund: React.FC = () => {
  const navigation = useNavigation();

  const { tx } = useSelector(historyDetailSelector);

  const [isFetchingShieldRefundData, setIsFetchingShieldRefundData] =
    useState<boolean>(false);

  const [shieldRefundData, setShieldRefundData] =
    useState<ShieldRefundData>(null);

  const [modalConfirmVisible, setModalConfirmVisible] =
    useState<boolean>(false);

  const [isSubmittingRefund, setIsSubmittingRefund] = useState<boolean>(false);

  const getRefundInfo = async () => {
    try {
      setIsFetchingShieldRefundData(true);
      const result: any = await checkShieldRefundInfo({
        decentralized: tx?.decentralized,
        shieldID: tx?.id,
      });
      if (result) {
        setIsFetchingShieldRefundData(false);
        setShieldRefundData({
          fee: result?.Fee || 0,
          feeFormat: result?.FeeFormat || '',
          currentBalance: result?.CurrentBalance || 0,
          symbol: result?.Symbol || '',
          address: result?.Address || '',
          msg: result?.Msg || '',
          allowedRefund: result?.AllowedRefund || false,
          network: result?.Network || '',
          userRefundAddress: result?.UserRefundAddress || '',
        });
      }
    } catch (error) {
      console.log(error);
      new ExHandler(
        error?.message || 'Can not get refund info',
      ).showErrorToast();
    }
  };

  useEffect(() => {
    getRefundInfo();
  }, []);

  const onSubmitRefund = async () => {
    try {
      setIsSubmittingRefund(true);
      const result = await submitShieldRefund({
        decentralized: tx?.decentralized,
        shieldID: tx?.id,
      });
      setIsSubmittingRefund(false);
      if (result) {
        setModalConfirmVisible(true);
      }
    } catch (error) {
      setIsSubmittingRefund(false);
      new ExHandler(
        error?.message || 'Request submit refund failed',
      ).showErrorToast();
    }
  };

  return (
    <>
      <Header title="Refund request" />
      {isFetchingShieldRefundData ? (
        <View fullFlex borderTop style={loadingContainerStyle}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <ScrollViewBorder>
            <View style={topBoxContainerStyle}>
              <View style={topWarningContainerStyle}>
                <View style={iconContainerStyle}>
                  <Text style={iconTextStyle}>!</Text>
                </View>
                <Text style={descriptionTextStyle}>Blocked address</Text>
              </View>
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                style={addressStyle}
              >
                {shieldRefundData?.userRefundAddress}
              </Text>
              <Text style={topBoxTextStyle}>
                This address is blocked on Incognito because it is associated
                with one or more blocked activities.{'\n\n'}Please send the
                network fee to the address below to create a refund transaction.
              </Text>
            </View>

            <QrCodeGenerate
              value={shieldRefundData?.address}
              size={175}
              style={qrCodeStyle}
            />
            <Text style={descriptionText2Style}>
              Send only {shieldRefundData?.symbol} to this address
            </Text>

            <View style={boxContainerStyle}>
              <Text style={labelTextStyle}>
                {shieldRefundData?.symbol} address
              </Text>
              <CopiableText
                data={shieldRefundData?.address}
                textStyle={{ color: COLORS.white }}
              />
            </View>

            <View style={rowItemContainerStyle}>
              <Text style={rowItemLabelStyle}>Network type</Text>
              <Text style={rowItemValueStyle}>{shieldRefundData?.network}</Text>
            </View>
            <View style={rowItemContainerStyle}>
              <Text style={rowItemLabelStyle}>Current balance</Text>
              <Text style={rowItemValueStyle}>
                {shieldRefundData?.currentBalance} {shieldRefundData?.symbol}
              </Text>
            </View>
            <View style={rowItemContainerStyle}>
              <Text style={rowItemLabelStyle}>Minimum amount</Text>
              <Text style={rowItemValueStyle}>
                {shieldRefundData?.feeFormat} {shieldRefundData?.symbol}
              </Text>
            </View>
            <Text style={descriptionTextStyle}>
              Smaller amounts will be rejected by the network and lost.
            </Text>

            {shieldRefundData?.msg && (
              <Text style={warningTextStyle}>{shieldRefundData?.msg}</Text>
            )}

            <View style={{ height: 50 }} />
          </ScrollViewBorder>
          <View style={confirmButtonContainerStyle}>
            <Button
              title="Request"
              isAsync
              isLoading={isSubmittingRefund}
              onPress={onSubmitRefund}
              style={confirmButtonStyle}
              disabled={!shieldRefundData?.allowedRefund || isSubmittingRefund}
            />
          </View>
          <ModalConfirm
            isVisible={modalConfirmVisible}
            title="Confirmed"
            titleStyle={modalTitleStyle}
            descStyle={modalDescStyle}
            description="Your funds will be landed in your wallet soon."
            renderModalIcon={() => <CheckedBlueIcon />}
            hideLeftButton
            rightButtonTitle="Go back to wallet"
            onPressRightButton={() => {
              setModalConfirmVisible(false);
              navigation?.popToTop();
            }}
          />
        </>
      )}
    </>
  );
};

export default withLayout_2(ShieldRefund);

const loadingContainerStyle: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
};

const topBoxContainerStyle: ViewStyle = {
  backgroundColor: COLORS.gray1,
  padding: 16,
  borderRadius: 8,
};

const addressStyle: TextStyle = {
  fontSize: 16,
  fontWeight: '400',
  color: COLORS.white,
  marginRight: 60,
  marginTop: 4,
};

const topBoxTextStyle: TextStyle = {
  fontSize: 12,
  color: COLORS.lightGrey36,
  marginTop: 12,
};

const iconTextStyle: TextStyle = {
  fontSize: 8,
  color: COLORS.black,
};

const topWarningContainerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.gray1,
};

const iconContainerStyle: ViewStyle = {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: COLORS.orange,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 8,
};

const qrCodeStyle: ViewStyle = {
  marginTop: 32,
};

const rowItemContainerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 8,
};

const rowItemLabelStyle: TextStyle = {
  fontWeight: '500',
  fontSize: 14,
  color: COLORS.lightGrey36,
};

const rowItemValueStyle: TextStyle = {
  ...rowItemLabelStyle,
  color: COLORS.white,
};

const descriptionText2Style: TextStyle = {
  fontSize: 12,
  color: COLORS.lightGrey36,
  fontWeight: '400',
  textAlign: 'center',
  marginTop: 16,
};

const labelTextStyle: TextStyle = {
  color: COLORS.white,
  fontWeight: '400',
  fontSize: 14,
  marginBottom: 4,
};

const boxContainerStyle: ViewStyle = {
  marginTop: 32,
  marginBottom: 8,
};

const descriptionTextStyle: TextStyle = {
  fontSize: 12,
  fontWeight: '400',
  color: COLORS.orange,
};

const warningTextStyle: TextStyle = {
  ...labelTextStyle,
  color: COLORS.lightGrey36,
  marginTop: 16,
};

const confirmButtonContainerStyle: ViewStyle = {
  padding: 16,
};

const confirmButtonStyle: ViewStyle = {
  height: 50,
};

const modalTitleStyle: TextStyle = {
  color: COLORS.blue5,
  fontSize: 24,
  marginTop: 8,
};

const modalDescStyle: TextStyle = {
  fontSize: 16,
  color: COLORS.white,
};

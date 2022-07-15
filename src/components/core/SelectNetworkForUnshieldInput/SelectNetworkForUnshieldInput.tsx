import { Text, TouchableOpacity } from '@src/components/core';
import { ConvertIcon2 } from '@src/components/Icons';
import { COLORS } from '@src/styles';
import React, { useState } from 'react';
import { ScrollView, TextStyle, View, ViewStyle } from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export interface SelectNetworkForUnshieldInputProps extends ModalProps {
  style?: ViewStyle;
  networks?: any[];
  selectedNetwork: any;
  onChange?: (value: any) => void;
}

export const SelectNetworkForUnshieldInput: React.FC<
  SelectNetworkForUnshieldInputProps
> = ({
  networks,
  selectedNetwork,
  style,
  onChange,
}: SelectNetworkForUnshieldInputProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <>
      {/* Render select network input */}
      <View style={style}>
        <Text style={networkInputLabelStyle}>Network type</Text>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsVisible(true)}
          style={networkMainContainerStyle}
        >
          {selectedNetwork ? (
            <Text numberOfLines={1} style={networkTextStyle}>
              {selectedNetwork?.network}
            </Text>
          ) : (
            <Text numberOfLines={1} style={selectNetworkTextStyle}>
              Select network
            </Text>
          )}
          <View style={rightItemStyle}>
            <ConvertIcon2 />
          </View>
        </TouchableOpacity>
      </View>

      {/* Render Modal */}
      <Modal
        isVisible={isVisible}
        style={modalStyle}
        useNativeDriver
        useNativeDriverForBackdrop
        onBackdropPress={() => setIsVisible(false)}
        onModalHide={() => setIsVisible(false)}
        hideModalContentWhileAnimating
      >
        {/* modal header */}
        <View style={modalContainerStyle}>
          <View style={modalHeaderStyle}>
            <Text style={modalTitleStyle}>Choose network type</Text>
            <Text style={modalDescriptionStyle}>
              Please check the selected network if it matches your wallet
              network, or assets might be lost.
            </Text>
          </View>

          {/* modal content */}
          {/* render list network */}
          <ScrollView contentContainerStyle={modalContentStyle}>
            {networks?.map((network, networkIndex) => {
              return (
                <TouchableOpacity
                  key={networkIndex}
                  onPress={() => {
                    onChange(network?.currencyType);
                    setIsVisible(false);
                  }}
                  activeOpacity={0.8}
                  style={networkItemContainerStyle}
                >
                  <Text style={networkNameStyle}>{network?.network || ''}</Text>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={COLORS.gray2}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const modalStyle: ViewStyle = {
  justifyContent: 'flex-end',
  margin: 0,
};

const modalContainerStyle: ViewStyle = {
  backgroundColor: COLORS.darkGrey,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  maxHeight: '75%',
};

const modalHeaderStyle: ViewStyle = {
  padding: 16,
  alignItems: 'center',
};

const modalTitleStyle: TextStyle = {
  fontSize: 20,
  lineHeight: 30,
  fontWeight: '500',
  textAlign: 'center',
};

const modalDescriptionStyle: TextStyle = {
  fontSize: 14,
  fontWeight: '400',
  color: COLORS.lightGrey36,
  textAlign: 'center',
  marginTop: 8,
};

const modalContentStyle: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 50,
};

const networkItemContainerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: COLORS.gray1,
  borderRadius: 8,
  paddingVertical: 13,
  paddingHorizontal: 16,
  marginTop: 8,
};

const networkNameStyle: TextStyle = {
  fontSize: 16,
  fontWeight: '500',
  lineHeight: 24,
  marginRight: 24,
};

const networkInputLabelStyle: TextStyle = {
  fontSize: 18,
  lineHeight: 21,
  fontWeight: 'bold',
};

const networkMainContainerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 8,
};

const networkTextStyle: TextStyle = {
  fontSize: 18,
  fontWeight: '500',
};

const selectNetworkTextStyle: TextStyle = {
  fontSize: 18,
  color: COLORS.lightGrey36,
  fontWeight: '500',
};

const rightItemStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 16,
};

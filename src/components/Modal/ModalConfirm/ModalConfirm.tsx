import { Button, Text, View } from '@src/components/core';
import { COLORS } from '@src/styles';
import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import Modal from 'react-native-modal';

export interface ModalConfirmProps {
  title?: string;
  description?: string;
  isVisible: boolean;
  style?: ViewStyle;
  leftButtonTitle?: string;
  rightButtonTitle?: string;
  renderModalIcon?: () => void;
  leftButtonStyle?: ViewStyle;
  rightButtonStyle?: ViewStyle;
  onPressLeftButton?: () => void;
  onPressRightButton?: () => void;
  onBackdropPress?: () => void;
  disabledLeftButton?: boolean;
  disabledRightButton?: boolean;
  leftButtonDisabledStyle?: ViewStyle;
  titleStyle?: TextStyle;
  descStyle?: TextStyle;
  rightButtonDisabledStyle?: ViewStyle;
  leftButtonTitleStyle?: TextStyle;
  rightButtonTitleStyle?: TextStyle;
  leftButtonTitleDisabledStyle?: TextStyle;
  rightButtonTitleDisabledStyle?: TextStyle;
  hideLeftButton?: boolean;
  hideRightButton?: boolean;
}

export const ModalConfirm: React.FC<ModalConfirmProps> = ({
  isVisible,
  title,
  renderModalIcon,
  description,
  leftButtonTitle,
  rightButtonTitle,
  leftButtonStyle,
  rightButtonStyle,
  onPressLeftButton,
  onPressRightButton,
  onBackdropPress,
  disabledLeftButton,
  disabledRightButton,
  titleStyle,
  descStyle,
  leftButtonDisabledStyle,
  rightButtonDisabledStyle,
  leftButtonTitleStyle,
  rightButtonTitleStyle,
  leftButtonTitleDisabledStyle,
  rightButtonTitleDisabledStyle,
  hideLeftButton,
  hideRightButton,
  style,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      useNativeDriver
      useNativeDriverForBackdrop
      animationIn="fadeIn"
      animationOut="fadeOut"
      hideModalContentWhileAnimating
      onBackdropPress={onBackdropPress}
      style={style}
    >
      <View style={modalContainerStyle}>
        {renderModalIcon?.()}
        <Text style={[modalTitleStyle, titleStyle]}>{title}</Text>
        <Text style={[modalDescriptionStyle, descStyle]}>{description}</Text>
        <View style={rowStyle}>
          {!hideLeftButton && (
            <Button
              title={leftButtonTitle || 'Cancel'}
              onPress={() => onPressLeftButton?.()}
              buttonStyle={[defaultLeftButtonStyle, leftButtonStyle]}
              disabled={disabledLeftButton}
              titleStyle={leftButtonTitleStyle}
              disabledStyle={leftButtonDisabledStyle}
              disabledTitleStyle={leftButtonTitleDisabledStyle}
            />
          )}
          {!hideLeftButton && !hideRightButton && <View style={spaceStyle} />}
          {!hideRightButton && (
            <Button
              title={rightButtonTitle || 'Confirm'}
              onPress={() => onPressRightButton?.()}
              buttonStyle={[defaultRightButtonStyle, rightButtonStyle]}
              disabled={disabledRightButton}
              titleStyle={rightButtonTitleStyle}
              disabledStyle={rightButtonDisabledStyle}
              disabledTitleStyle={rightButtonTitleDisabledStyle}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const modalContainerStyle: ViewStyle = {
  padding: 24,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 16,
  backgroundColor: COLORS.darkGrey,
};

const modalTitleStyle: TextStyle = {
  color: COLORS.white,
  fontSize: 20,
  fontWeight: '700',
  textAlign: 'center',
};

const modalDescriptionStyle: TextStyle = {
  color: COLORS.lightGrey36,
  fontSize: 16,
  fontWeight: '500',
  marginTop: 16,
  textAlign: 'center',
};

const rowStyle: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 24,
};

const defaultLeftButtonStyle: ViewStyle = {
  flex: 1,
  backgroundColor: COLORS.lightGrey35,
  height: 50,
  borderRadius: 8,
};

const spaceStyle: ViewStyle = {
  width: 8,
};

const defaultRightButtonStyle: ViewStyle = {
  ...defaultLeftButtonStyle,
  backgroundColor: COLORS.blue5,
};

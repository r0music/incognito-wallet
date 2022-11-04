import { Text, View } from '@components/core';
import { BtnPrimary } from '@components/core/Button';
import { colorsSelector } from '@src/theme';
import React, { memo } from 'react';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import styles from './styles';

const UnifiedInforAlert = ({
  isVisible,
  cancelOnClick,
  confirmOnClick,
  onTouchOutside,
}) => {
  const colors = useSelector(colorsSelector);
  return (
    <View>
      <Modal
        isVisible={isVisible}
        style={styles.dialog}
        onTouchOutside={onTouchOutside}
      >
        <View style={styles.hook}>
          <Text style={[styles.title, { color: colors.text1 }]}>
            Unified Information Alert Title
          </Text>
          <Text style={[styles.desc, { color: colors.text3 }]}>
            Unified Information Alert Description
          </Text>

          <View style={styles.buttonArea}>
            <BtnPrimary
              title="No"
              onPress={cancelOnClick}
              wrapperStyle={styles.wrapperCancelBtn}
              textStyle={{ color: colors.ctaMain }}
            />
            <View style={styles.spaceView} />
            <BtnPrimary
              title="Yes"
              onPress={confirmOnClick}
              wrapperStyle={styles.wrapperConfirmBtn}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default memo(UnifiedInforAlert);

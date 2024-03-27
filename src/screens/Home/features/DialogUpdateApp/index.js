import React from 'react';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import PropTypes from 'prop-types';
import { BtnPrimary } from '@components/core/Button';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme';
import styled from './styles';

const DialogUpdateApp = React.memo((props) => {
  const { textTitle, textContent, visible, onPress } = props;
  const title = textTitle ? textTitle : 'Update available';
  const colors = useSelector(colorsSelector);
  const content = textContent
    ? textContent
    : 'We just released new version of the app!\nTo continue to use the app, simply update\nto new version on the store.';
  return (
    <Dialog width={0.88} dialogStyle={{ height: 280 }} visible={visible}>
      <DialogContent
        style={[styled.dialog_content, { backgroundColor: colors.background1 }]}
      >
        <View style={styled.wrapper}>
          <Text style={[styled.title, { color: colors.text1 }]}>{title}</Text>
          <Text style={[styled.text, { color: colors.text3 }]}>{content}</Text>
          <BtnPrimary
            title="OK"
            wrapperStyle={styled.btnSubmit}
            onPress={onPress}
          />
        </View>
      </DialogContent>
    </Dialog>
  );
});

DialogUpdateApp.propTypes = {
  visible: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  textContent: PropTypes.string,
  textTitle: PropTypes.string,
};

export default DialogUpdateApp;

import React from 'react';
import { StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-native-modal';
import { COLORS } from '@src/styles';
import { ScreenHeight, ScreenWidth } from '@src/utils/devices';
import { modalSelector, modalLoadingSelector } from './modal.selector';
import { actionToggleModal } from './modal.actions';
import LoadingModal from './features/LoadingModal';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    flexDirection: 'column',
  },
});
const ModalComponent = () => {
  const { visible, data, shouldCloseModalWhenTapOverlay, onBack } =
    useSelector(modalSelector);
  const {
    toggle: toggleLoading,
    title: titleLoading,
    desc: descLoading,
  } = useSelector(modalLoadingSelector);
  const dispatch = useDispatch();
  const handleToggle = async () => {
    shouldCloseModalWhenTapOverlay ? await dispatch(actionToggleModal()) : null;
  };
  const onRequestClose = async () => {
    await dispatch(actionToggleModal());
    if (typeof onBack === 'function') {
      onBack();
    }
  };
  React.useEffect(() => {
    return () => {
      dispatch(actionToggleModal());
    };
  }, []);
  if (!visible) {
    return null;
  }
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleToggle}
      onModalWillHide={onRequestClose}
      style={styled.container}
      backdropColor={COLORS.black}
      backdropOpacity={0.4}
      coverScreen
      hideModalContentWhileAnimating
      deviceHeight={ScreenHeight}
      deviceWidth={ScreenWidth}
    >
      {data}
      {toggleLoading && (
        <LoadingModal title={titleLoading} desc={descLoading} />
      )}
    </Modal>
  );
};

ModalComponent.defaultProps = {};

ModalComponent.propTypes = {};

export default ModalComponent;

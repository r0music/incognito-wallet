import React, {memo} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {PureModalContent} from '@components/Modal/features/PureModal';
import Svg, { Path } from 'react-native-svg';
import {COLORS, FONT} from '@src/styles';
import {BTNPrimary} from '@components/core/Button';
import {useDispatch} from 'react-redux';
import {actionToggleModal} from '@components/Modal';

const SuccessIcon = () => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 40 40"
    fill="none"
  >
    <Path
      d="M20 0C16.0444 0 12.1776 1.17298 8.8886 3.37061C5.59962 5.56823 3.03617 8.69181 1.52242 12.3463C0.00866568 16.0009 -0.387401 20.0222 0.384303 23.9018C1.15601 27.7814 3.06082 31.3451 5.85787 34.1421C8.65492 36.9392 12.2186 38.844 16.0982 39.6157C19.9778 40.3874 23.9992 39.9913 27.6537 38.4776C31.3082 36.9638 34.4318 34.4004 36.6294 31.1114C38.827 27.8224 40 23.9556 40 20C39.9936 14.6976 37.8845 9.61423 34.1351 5.86488C30.3858 2.11553 25.3024 0.00635143 20 0ZM29.768 16.768L18.768 27.768C18.5359 28.0002 18.2602 28.1844 17.9569 28.3101C17.6535 28.4358 17.3284 28.5005 17 28.5005C16.6716 28.5005 16.3465 28.4358 16.0431 28.3101C15.7398 28.1844 15.4642 28.0002 15.232 27.768L10.232 22.768C9.7631 22.2991 9.49968 21.6631 9.49968 21C9.49968 20.3369 9.7631 19.7009 10.232 19.232C10.7009 18.7631 11.3369 18.4997 12 18.4997C12.6631 18.4997 13.2991 18.7631 13.768 19.232L17 22.464L26.232 13.232C26.4642 12.9998 26.7398 12.8156 27.0432 12.69C27.3465 12.5643 27.6717 12.4997 28 12.4997C28.3284 12.4997 28.6535 12.5643 28.9568 12.69C29.2602 12.8156 29.5358 12.9998 29.768 13.232C30.0002 13.4642 30.1844 13.7398 30.31 14.0432C30.4357 14.3465 30.5003 14.6716 30.5003 15C30.5003 15.3283 30.4357 15.6535 30.31 15.9568C30.1844 16.2602 30.0002 16.5358 29.768 16.768Z"
      fill="#64A121"
    />
  </Svg>
);

const SuccessModal = ({ onButtonPress, title, content, subContent, buttonText }) => {
  const dispatch = useDispatch();
  const onPress = () => {
    typeof onButtonPress === 'function' && onButtonPress();
    dispatch(actionToggleModal());
  };
  return (
    <PureModalContent styledWrapper={styled.container}>
      <SuccessIcon />
      {!!title && <Text style={styled.title}>{title}</Text>}
      {!!content && (<Text style={styled.content}>{content}</Text>)}
      {!!subContent && (<Text style={styled.content}>{subContent}</Text>)}
      <BTNPrimary title={buttonText} wrapperStyle={styled.button} onPress={onPress} />
    </PureModalContent>
  );
};

SuccessModal.defaultProps = {
  title: null,
  content: null,
  subContent: null,
  buttonText: 'Ok'
};

SuccessModal.propTypes = {
  onButtonPress: PropTypes.func.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  subContent: PropTypes.string,
  buttonText: PropTypes.string,
};

const styled = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONT.STYLE.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    textAlign: 'center',
    marginTop: 8
  },
  content: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.regular,
    color: COLORS.newGrey,
    lineHeight: FONT.SIZE.regular + 5,
    textAlign: 'center',
    marginTop: 24,
  },
  button: {
    width: '100%',
    marginTop: 37
  }
});

export default memo(SuccessModal);

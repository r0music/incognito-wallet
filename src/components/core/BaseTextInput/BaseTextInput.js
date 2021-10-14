import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, TextInputProps } from 'react-native';
import { COLORS } from '@src/styles';
import styles from './styles';

const BaseTextInput = (props: TextInputProps) => {
  const { style, editable = true, ...rest } = props;
  return (
    <TextInput
      placeholderTextColor={COLORS.colorGreyMedium}
      returnKeyType="done"
      autoCorrect={false}
      spellCheck={false}
      autoCompleteType="off"
      style={[
        styles.input,
        style,
        !editable ? { color: COLORS.newGrey } : null,
      ]}
      {...rest}
    />
  );
};

BaseTextInput.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

BaseTextInput.defaultProps = {
  style: null,
};

export default React.memo(BaseTextInput);

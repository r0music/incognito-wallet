import React from 'react';
import PropTypes from 'prop-types';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { isAndroid } from '@src/utils/platform';
import { colorsSelector } from '@src/theme/theme.selector';
import { useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import styles from './styles';

const StyledInput = styled.TextInput`
  color: ${({ theme }) => theme.text1};
`;

// A custome hook for position of cursor's text input on Android OS
const useCursorInputTextForAndroid = ({ value, onBlur, onFocus }) => {
  const [selection, setSelection] = React.useState(undefined);
  const [isFocused, setIsFocused] = React.useState(false);
  const handleSetSelectionForAnroid = React.useCallback(
    (selection, value) => {
      if (isAndroid() && !!value) {
        setSelection(selection);
        setTimeout(() => {
          setSelection(undefined);
        }, 100);
      }
    },
    [value, selection],
  );
  const handleOnBlur = () => {
    setIsFocused(false);
    if (typeof onBlur === 'function') {
      onBlur();
    }
    handleSetSelectionForAnroid({ start: 0, end: 0 }, value);
  };

  const handleOnFocus = async () => {
    setIsFocused(true);
    if (typeof onFocus === 'function') {
      onFocus();
    }
    handleSetSelectionForAnroid(
      { start: value?.length, end: value?.length },
      value,
    );
  };
  const debounceHandleSelection = debounce(
    React.useCallback((value) => {
      handleSetSelectionForAnroid({ start: 0, end: 0 }, value);
    }, []),
    100,
  );
  React.useEffect(() => {
    if (isFocused || !value) {
      return;
    }
    debounceHandleSelection(value);
  }, [value, isFocused]);
  return {
    selection,
    setSelection,
    handleOnBlur,
    handleOnFocus,
  };
};

const BaseTextInput = (props: TextInputProps) => {
  const {
    style,
    editable = true,
    onFocus,
    onBlur,
    onChangeText,
    value,
    ...rest
  } = props;
  const colors = useSelector(colorsSelector);
  const { selection, setSelection, handleOnBlur, handleOnFocus } =
    useCursorInputTextForAndroid({ value, onBlur, onFocus });
  const handleChangeText = (text) => {
    setSelection(undefined);
    if (typeof onChangeText === 'function') {
      onChangeText(text);
    }
  };
  return (
    <StyledInput
      placeholderTextColor={colors.text10}
      returnKeyType="done"
      autoCorrect={false}
      spellCheck={false}
      autoCompleteType="off"
      // style={[styles.input, style, !editable ? { color: colors.text4 } : null]}
      style={[styles.input, style]}
      editable={editable}
      value={value}
      selection={isAndroid() && !!selection ? selection : undefined}
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
      onChangeText={handleChangeText}
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

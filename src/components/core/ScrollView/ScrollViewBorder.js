import React from 'react';
import PropTypes from 'prop-types';
import { ScrollViewProps } from 'react-native';
import styled from 'styled-components/native';
import globalStyled from '@src/theme/theme.styled';
import styleSheet from './style';

const StyledScrollView = styled.ScrollView`
  background-color: ${({ theme }) => theme.background1};
  border-top-left-radius: 26px;
  border-top-right-radius: 26px;
`;

const ScrollView = React.forwardRef(
  (
    {
      style,
      contentContainerStyle,
      paddingBottom,
      border,
      ...otherProps
    }: ScrollViewProps,
    ref,
  ) => (
    <StyledScrollView
      style={style}
      contentContainerStyle={[
        styleSheet.root,
        globalStyled.defaultPadding,
        paddingBottom && styleSheet.content,
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      ref={ref}
      border={border}
      showsVerticalScrollIndicator={false}
      {...otherProps}
    />
  ),
);

ScrollView.defaultProps = {
  style: null,
  contentContainerStyle: null,
  paddingBottom: false,
  border: false,
};

ScrollView.propTypes = {
  style: PropTypes.object,
  contentContainerStyle: PropTypes.any,
  paddingBottom: PropTypes.bool,
  border: PropTypes.bool,
};

export default ScrollView;

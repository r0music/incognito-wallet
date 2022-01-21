import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import globalStyled from '@src/theme/theme.styled';

const Container = styled.View`
  background-color: ${({ theme }) => theme.background1};
`;

const View = (props) => {
  const { style, fullFlex, borderTop, paddingHorizontal, ...rest } = props;
  return (
    <Container
      {...rest}
      style={[
        fullFlex && { flex: 1 },
        borderTop && globalStyled.defaultBorderSection,
        paddingHorizontal && globalStyled.defaultPadding,
        style,
      ]}
    />
  );
};

View.defaultProps = {
  style: null,
  fullFlex: false,
  borderTop: false,
  paddingHorizontal: false
};

View.propTypes = {
  style: PropTypes.object,
  fullFlex: PropTypes.bool,
  borderTop: PropTypes.bool,
  paddingHorizontal: PropTypes.bool
};

export default View;

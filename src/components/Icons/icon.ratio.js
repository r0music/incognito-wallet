import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from '@src/styles';

const Wrapper = styled.View`
  width: 16px;
  height: 16px;
  border: 1px solid ${COLORS.lightGrey37};
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const Content = styled.View`
  width: 10px;
  height: 10px;
  background-color: ${({ theme, selected, selectedColor }) =>
    selected ? selectedColor || theme.icon1 : 'transparent'};
  border-radius: 8px;
`;

const RatioIcon = ({ selected, selectedColor, ...rest }) => {
  return (
    <Wrapper key="wrapper-icon" {...rest}>
      <Content key="icon" selected={selected} selectedColor={selectedColor} />
    </Wrapper>
  );
};

RatioIcon.propTypes = {
  selected: PropTypes.bool.isRequired
};

export default memo(RatioIcon);

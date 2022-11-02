import ToggleArrow from '@src/components/ToggleArrow';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionToggleProTab } from '../redux/Swap.actions';
import { swapInfoSelector } from '../redux/Swap.selector';
import { inputGroupStyled as styled } from '../Swap.styled';

export default () => {
  const dispatch = useDispatch();
  const swapInfo = useSelector(swapInfoSelector);
  return (
    <ToggleArrow
      label="Advanced"
      toggle={swapInfo?.toggleProTab}
      handlePressToggle={() =>
        dispatch(actionToggleProTab(!swapInfo?.toggleProTab))
      }
      style={styled.toggleArrow}
    />
  );
};

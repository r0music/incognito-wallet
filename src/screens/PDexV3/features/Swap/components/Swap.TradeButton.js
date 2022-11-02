import { ButtonTrade } from '@src/components/Button';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { swapInfoSelector } from '../redux/Swap.selector';
import { styled } from '../Swap.styled';

const TradeButton = ({ onPress }) => {
  const swapInfo = useSelector(swapInfoSelector);
  return (
    <ButtonTrade
      btnStyle={styled.btnTrade}
      onPress={onPress}
      title={swapInfo?.btnSwapText || ''}
    />
  );
};

export default memo(TradeButton);

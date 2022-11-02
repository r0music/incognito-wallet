import React, { memo } from 'react';
import { View } from 'react-native';
import PositionSwapButton from './components/Swap.PositionSwapButton';
import SwapDetails from './Swap.details';
import SwapProTab from './Swap.proTab';
import { inputGroupStyled as styled } from './Swap.styled';

import AdvancedView from './components/Swap.AdvancedView';
import BuyTokenInput from './components/Swap.BuyTokenInput';
import SellTokenInput from './components/Swap.SellTokenInput';
import EstimateTradeError from './components/Swap.EstimateTradeError';
// import TradeButton from './components/Swap.TradeButton';

const SwapInputsGroup = () => {
  console.log('SwapInputsGroup  RENDER ');
  return (
    <View style={styled.inputGroups}>
      <SellTokenInput />
      <PositionSwapButton />
      <BuyTokenInput />
      <AdvancedView />
      <SwapProTab />
      <SwapDetails />
      <EstimateTradeError />
      {/* <TradeButton onPress={handleConfirm} /> */}
    </View>
  );
};

export default memo(SwapInputsGroup);

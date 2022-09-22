import React, { memo } from 'react';
import {
  KeyboardAwareScrollView,
  TouchableOpacity,
  Text,
} from '@src/components/core';
import { IconSwapNew } from '@src/components/Icons';
import throttle from 'lodash/throttle';
import { styled } from './Swap.styled';
// import FromForm from './components/FromForm';
// import ToForm from './components/ToForm';
// import withSwap from '../Swap/Swap.enhance';
import GroupSubInfo from '../Swap/Swap.groupSubInfo';
import FromForm from './Swap.FromForm';
import ToForm from './Swap.ToForm';
import AddressBarView from './components/AddressBarView';
import AdvancedView from './components/AdvancedView';

const Swap = (props) => {
  console.log('props: ', props);
  const swapButtonOnPressed = throttle(() => {
    console.log('Swap Button On Pressed! TO DO');
  }, 4000);

  return (
    <KeyboardAwareScrollView
      style={[styled.scrollview]}
      scrollEventThrottle={600}
      onScroll={({ nativeEvent }) => {
        console.log('nativeEvent ', nativeEvent);
      }}
    >
      <FromForm />
      <TouchableOpacity onPress={swapButtonOnPressed}>
        <IconSwapNew style={styled.swaBtn} />
      </TouchableOpacity>

      <ToForm />

      <AddressBarView />

      <AdvancedView />
      <GroupSubInfo page={0} isExpandPage setShowHistory={() => {}} />
    </KeyboardAwareScrollView>
  );
};

Swap.propTypes = {};

export default memo(Swap);

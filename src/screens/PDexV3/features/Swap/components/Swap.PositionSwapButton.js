import { SwapButton as PositionSwapButton } from '@src/components/core';
import { throttle } from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { change } from 'redux-form';
import { actionResetData, actionSwapToken } from '../redux/Swap.actions';
import { formConfigs } from '../Swap.constant';

export default () => {
  const dispatch = useDispatch();
  const onSwapButtons = throttle(
    () => {
      // if (selltoken?.movedUnifiedToken) {
      //   return;
      // }
      dispatch(actionSwapToken());
      dispatch(actionResetData());
      dispatch(change(formConfigs.formName, formConfigs.feetoken, ''));
    },
    1000,
    {
      leading: true,
      trailing: false,
    },
  );
  return <PositionSwapButton onSwapButtons={onSwapButtons} />;
};

import React from 'react';
import {Text} from 'react-native';
import styled from './Liquidity.styled';

export const TYPES = {
  ACTION_SET_CONTRIBUTE_POOL_ID: '[pDexV3][liquidity] Set contribute poolID',
  ACTION_FETCHING_CONTRIBUTE_DATA: '[pDexV3][liquidity] Fetching contribute data',
  ACTION_SET_CONTRIBUTE_POOL_DATA: '[pDexV3][liquidity] Set contribute pool data',

  ACTION_SET_CREATE_POOL_TOKEN: '[pDexV3][liquidity] Set create pool token',
  ACTION_FREE_CREATE_POOL_TOKEN: '[pDexV3][liquidity] Free create pool',
  ACTION_SET_FETCHING_CREATE_POOL: '[pDexV3][liquidity] Set fetching create pool',
  ACTION_SET_TYPING_CREATE_POOL: '[pDexV3][liquidity] Set typing create pool',
  ACTION_SET_FOCUS_CREATE_POOL: '[pDexV3][liquidity] Set focus create pool',
  ACTION_SET_RATE_CREATE_POOL: '[pDexV3][liquidity] Set rate create pool',

  ACTION_SET_REMOVE_FETCHING: '[pDexV3][liquidity] Set remove pool fetching',
  ACTION_SET_REMOVE_POOL_ID: '[pDexV3][liquidity] Set remove pool poolID',
  ACTION_SET_REMOVE_POOL_TOKEN: '[pDexV3][liquidity] Set remove pool token',
};

export const LIQUIDITY_MESSAGES = {
  addLiquidity: 'Add liquidity',
  createPool : 'Create liquidity',
  removePool : 'Remove liquidity',
  estRate: (onPress) => (
    <Text style={styled.warning}>The exchange rate between two tokens have been the wrong rate, please update new&nbsp;
      <Text style={{textDecorationLine: 'underline' }} onPress={onPress}>rate here</Text>.
    </Text>
  )
};

export const formConfigsContribute = {
  formName: 'FORM_CONTRIBUTE',
  inputToken: 'inputToken',
  outputToken: 'outputToken',
};

export const formConfigsCreatePool = {
  formName: 'FORM_CREATE_POOL',
  inputToken: 'inputToken',
  outputToken: 'outputToken',
};

export const formConfigsRemovePool = {
  formName: 'FORM_REMOVE_POOL',
  inputToken: 'inputToken',
  outputToken: 'outputToken',
};

export const SUCCESS_MODAL = {
  ADD_POOL: {
    title: 'Liquidity added',
    desc: 'Please wait a few minutes for your added liquidity to display.'
  },
  CREATE_POOL: {
    title: 'Liquidity added',
    desc: 'Please wait a few minutes for your added liquidity to display.'
  },
  REMOVE_POOL: {
    title: 'Remove added',
    desc: 'Please wait a few minutes for your added remove pool to display.'
  }
};

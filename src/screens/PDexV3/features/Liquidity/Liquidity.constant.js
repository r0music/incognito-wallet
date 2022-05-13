import React from 'react';
import { Text } from 'react-native';
import styled from './Liquidity.styled';

export const TYPES = {
  ACTION_SET_CONTRIBUTE_ID: '[pDexV3][liquidity] Set contribute id',
  ACTION_FETCHING_CONTRIBUTE_DATA: '[pDexV3][liquidity] Fetching contribute data',
  ACTION_SET_CONTRIBUTE_POOL_DATA: '[pDexV3][liquidity] Set contribute pool data',

  ACTION_SET_CREATE_POOL_TOKEN: '[pDexV3][liquidity] Set create pool token',
  ACTION_FREE_CREATE_POOL_TOKEN: '[pDexV3][liquidity] Free create pool',
  ACTION_SET_FETCHING_CREATE_POOL: '[pDexV3][liquidity] Set fetching create pool',
  ACTION_SET_TYPING_CREATE_POOL: '[pDexV3][liquidity] Set typing create pool',
  ACTION_SET_FOCUS_CREATE_POOL: '[pDexV3][liquidity] Set focus create pool',
  ACTION_SET_RATE_CREATE_POOL: '[pDexV3][liquidity] Set rate create pool',

  ACTION_SET_REMOVE_FETCHING: '[pDexV3][liquidity] Set remove pool fetching',
  ACTION_SET_REMOVE_SHARE_ID: '[pDexV3][liquidity] Set remove pool share id',
  ACTION_SET_REMOVE_POOL_TOKEN: '[pDexV3][liquidity] Set remove pool token',
  ACTION_FREE: '[pDexV3][liquidity] Set free data',
};

export const LIQUIDITY_MESSAGES = {
  addLiquidity: 'Contribute liquidity',
  createPool : 'Contribute liquidity',
  removePool : 'Remove liquidity',
  estRate: (onPress) => (
    <Text style={styled.warning}>Are you sure? This varies significantly from normal market rates.&nbsp;
      <Text style={{textDecorationLine: 'underline' }} onPress={onPress}>Switch to market rate.</Text>
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
    title: 'Liquidity contributed',
    desc: 'Please wait a few minutes for your contribution to display.'
  },
  CREATE_POOL: {
    title: 'Liquidity contributed',
    desc: 'Please wait a few minutes for your contribution to display.'
  },
  REMOVE_POOL: {
    title: 'Remove liquidity contribution',
    desc: 'Please wait a few minutes for your pool balance to update.'
  }
};

import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';
import { MAX_FEE_PER_TX } from '@components/EstimateFee/EstimateFee.utils';
import { COINS } from '@src/constants';
import { PRV_ID } from '@src/screens/DexV2/constants';

const withCoinData = WrappedComp => (props) => {
  const data = useNavigationParam('data');
  const coins = useNavigationParam('coins');
  const coin = data?.coin;

  // get min lock amount of prv
  let minLock = coins.find(i => i?.id === PRV_ID && i?.locked);

  return (
    <WrappedComp
      {...{
        ...props,
        data,
        coins,
        coin: minLock,
        inputToken: coin,
        inputBalance: data.balance,
        inputMin: minLock.min || MAX_FEE_PER_TX,
        fee: 0,
        feeToken: COINS.PRV,
      }}
    />
  );
};

export default withCoinData;

import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';
import { MAX_FEE_PER_TX } from '@components/EstimateFee/EstimateFee.utils';
import { COINS } from '@src/constants';
import { PRV_ID } from '@src/screens/DexV2/constants';

function filterLocked(coin) {
  return coin?.locked;
}

const withCoinData = WrappedComp => (props) => {
  const data = useNavigationParam('data');
  const coins = useNavigationParam('coins');
  const coin = data?.coin;

  // get min lock amount of prv
  let minLock = coins.find(i => i?.id === PRV_ID && i?.locked);
  const locks = coins.filter(filterLocked);
  minLock.terms = locks;

  const isDefaultTIme = (element) => element.lockTime == 12;
  const tempIndex = minLock.terms.findIndex(isDefaultTIme);
  const initIndex = tempIndex === -1 ? 0 : tempIndex;

  return (
    <WrappedComp
      {...{
        ...props,
        initIndex,
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

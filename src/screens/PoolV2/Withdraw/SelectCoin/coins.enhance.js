import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';

const filterLocked = (item) => {
  return !item?.locked;
};

const withCoinsData = WrappedComp => (props) => {
  const tempCoins = useNavigationParam('data') || [];
  const totalRewards = useNavigationParam('totalRewards');
  const displayFullTotalRewards = useNavigationParam('displayFullTotalRewards');

  const coins = tempCoins.filter(filterLocked);

  return (
    <WrappedComp
      {...{
        ...props,
        coins,
        totalRewards,
        displayFullTotalRewards,
      }}
    />
  );
};

export default withCoinsData;

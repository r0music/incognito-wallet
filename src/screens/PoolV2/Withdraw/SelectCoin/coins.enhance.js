import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';

const filterLocked = (item) => {
  return !item?.locked;
};

const withCoinsData = WrappedComp => (props) => {
  const tempCoins = useNavigationParam('data') || [];
  const totalRewardsNonLock = useNavigationParam('totalRewardsNonLock');
  const displayFullTotalRewardsNonLock = useNavigationParam('displayFullTotalRewardsNonLock');


  const coins = tempCoins.filter(filterLocked);

  return (
    <WrappedComp
      {...{
        ...props,
        coins,
        totalRewardsNonLock,
        displayFullTotalRewardsNonLock,
      }}
    />
  );
};

export default withCoinsData;

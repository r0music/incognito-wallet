import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';

const withRewards = WrappedComp => (props) => {
  const totalRewardsNonLock = useNavigationParam('totalRewardsNonLock');
  const displayFullTotalRewardsNonLock = useNavigationParam('displayFullTotalRewardsNonLock');

  return (
    <WrappedComp
      {...{
        ...props,
        totalRewardsNonLock,
        displayFullTotalRewardsNonLock,
      }}
    />
  );
};

export default withRewards;

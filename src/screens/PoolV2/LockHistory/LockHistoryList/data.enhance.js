import React from 'react';
import _ from 'lodash';
import { useNavigationParam } from 'react-navigation-hooks';

const LockStatus = {
  Inactive: 0,
  Active: 1,
};

const withData = WrappedComp => (props) => {
  const userData = useNavigationParam('userData');
  const coin = useNavigationParam('coin');

  let lockHistories = userData.filter(item => {
    return item.id === coin.id && item.locked === coin.locked && 
      item.lockTime === coin.lockTime && item.active === LockStatus.Active && item.balance > 0;
  });

  lockHistories = _.orderBy(lockHistories, ['unlockDate'], ['desc']);
  
  return (
    <WrappedComp
      {...{
        ...props,
        coin,
        lockHistories,
      }}
    />
  );
};

export default withData;
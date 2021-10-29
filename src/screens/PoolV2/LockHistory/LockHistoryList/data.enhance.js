import React from 'react';
import _ from 'lodash';
import { useNavigationParam } from 'react-navigation-hooks';

export const LockStatus = {
  Inactive: 0,
  Active: 1,
  Finished: 2,
};

const withData = WrappedComp => (props) => {
  const userData = useNavigationParam('userData');
  const coin = useNavigationParam('coin');

  let lockHistories = userData.filter(item => {
    return item.id === coin.id && item.locked === coin.locked && item.active !== LockStatus.Inactive && item.balance > 0;
  });

  lockHistories = _.orderBy(lockHistories, [i => i.active === LockStatus.Finished, 'lockDate'], ['asce', 'desc']);
  
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
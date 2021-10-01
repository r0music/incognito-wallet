import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';
import formatUtil from '@utils/format';

const withData = WrappedComp => (props) => {
  const data        = useNavigationParam('data');
  const coin        = useNavigationParam('coin');
  const value       = useNavigationParam('value');
  const coins       = useNavigationParam('coins');

  const migrate = formatUtil.amountFull(
    value,
    coin.pDecimals
  );

  const unlockTime = new Date(new Date().getTime() + coin.lockTime*2592000*1000); // 2592000 = 24*60*60*30 = 1 month
  const unlockTimeFormat = formatUtil.formatDateTime(unlockTime, 'DD MMM YYYY');

  return (
    <WrappedComp
      {...{
        ...props,
        coin,
        coins,
        value,
        migrate,
        data,
        unlockTimeFormat,
      }}
    />
  );
};

export default withData;

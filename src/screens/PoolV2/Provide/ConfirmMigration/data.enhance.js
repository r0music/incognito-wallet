import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';
import formatUtil, {LONG_DATE_TIME_FORMAT} from '@utils/format';

const withData = WrappedComp => (props) => {
  const data        = useNavigationParam('data');
  const coin        = useNavigationParam('coin');
  const value       = useNavigationParam('value');
  const coins       = useNavigationParam('coins');

  const migrate = formatUtil.amountFull(
    value,
    coin.pDecimals
  );
  
  let unlockTime = new Date();
  unlockTime.setMonth(unlockTime.getMonth() + coin.lockTime);
  const unlockTimeFormat = formatUtil.formatDateTime(unlockTime, LONG_DATE_TIME_FORMAT);

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

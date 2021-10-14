import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';
import formatUtil, { LONG_DATE_TIME_FORMAT } from '@utils/format';

const withData = (WrappedComp) => (props) => {
  const coins = useNavigationParam('coins');
  const coin = useNavigationParam('coin');
  const value = useNavigationParam('value');
  const fee = useNavigationParam('fee');
  const feeToken = useNavigationParam('feeToken');
  const prvBalance = useNavigationParam('prvBalance');
  const payOnOrigin = useNavigationParam('payOnOrigin');
  const isPrv = useNavigationParam('isPrv');
  const selectedTerm = useNavigationParam('selectedTerm');

  const formatDeposit = (_value, _fee) => {
    return isPrv ? (payOnOrigin ? _value : _value + _fee) : _value;
  };

  const originProvide = payOnOrigin ? value - fee : value;
  const provide = formatUtil.amountFull(originProvide, coin.pDecimals);

  const originDeposit = formatDeposit(value, fee);
  const deposit = formatUtil.amountFull(originDeposit, coin.pDecimals);

  let unlockTimeFormat = '';
  if (coin.locked) {
    let unlockTime = new Date();
    unlockTime.setMonth(unlockTime.getMonth() + selectedTerm.lockTime);
    unlockTimeFormat = formatUtil.formatDateTime(
      unlockTime,
      LONG_DATE_TIME_FORMAT,
    );
  }

  return (
    <WrappedComp
      {...{
        ...props,
        selectedTerm,
        coin,
        value,
        deposit,
        provide,
        fee,
        feeToken,
        prvBalance,
        payOnOrigin,
        isPrv,
        originProvide,
        coins,
        unlockTimeFormat,
      }}
    />
  );
};

export default withData;

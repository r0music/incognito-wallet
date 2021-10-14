import React from 'react';
import _ from 'lodash';
import accountService from '@services/wallet/accountService';
import formatUtil from '@utils/format';
import convert from '@src/utils/convert';
import {
  PRVIDSTR
} from 'incognito-chain-web-js/build/wallet';

const withBalance = WrappedComp => (props) => {
  const { coins: noBalanceCoins, wallet, account } = props;

  const [coins, setCoins] = React.useState(noBalanceCoins);

  const loadBalance = async () => {
    try {
      let coins = await Promise.all(noBalanceCoins.map(async coin => {
        const balance = await accountService.getBalance({
          account,
          wallet,
          tokenID: coin.id
        });
        const displayBalance = formatUtil.amountFull(balance, coin.pDecimals, true) || '0';
        const displayFullBalance = formatUtil.amountFull(balance, coin.pDecimals, false) || '0';
        const decimalBalance = convert.toNumber(displayBalance, true);
        return {
          ...coin,
          balance,
          displayBalance,
          displayFullBalance,
          decimalBalance,
        };
      }));
      coins = _.orderBy(coins, ['locked', (c) => c.id === PRVIDSTR, 'decimalBalance'], ['desc', 'desc', 'desc']);
      setCoins(coins);
    } catch (error) {
      console.debug('CAN GET COIN BALANCE', error);
    }
  };

  React.useEffect(() => {
    loadBalance();
  }, [noBalanceCoins]);

  return (
    <WrappedComp
      {...{
        ...props,
        coins,
      }}
    />
  );
};

export default withBalance;

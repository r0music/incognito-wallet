import React from 'react';
import withWallet from '@screens/Wallet/features/Home/Wallet.enhance';
import Extra from '@screens/Wallet/features/Home/Wallet.extra';
import Followed from '@screens/Wallet/features/Home/Wallet.followed';
import { compose } from 'recompose';

const Wallet = React.memo(() => {
  return (
    <>
      <Extra />
      <Followed />
      {/*<StreamLineBottomBar />*/}
    </>
  );
});

export default compose(
  withWallet,
)(Wallet);

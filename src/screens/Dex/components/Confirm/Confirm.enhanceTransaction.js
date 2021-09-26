import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import accountServices from '@services/wallet/accountService';
import { HEADER_TABS, TRANSACTION_FEE } from '@screens/Dex/Liquidity.constants';
import Loading from '@screens/Dex/components/Loading';
import { ExHandler } from '@services/exception';
import BigNumber from 'bignumber.js';
import {useError} from '@components/UseEffect/useError';

const withTransaction = WrappedComp => props => {
  const {
    account,
    wallet,
    inputValue,
    outputValue,
    inputToken,
    outputToken,
    tabName,
    onSuccess,
    share,
    withdrawFeeValue,
    maxInputShareOriginal,
  } = props;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const errorMessage = useError(error);
  const onCreateContribute = async () => {
    await accountServices.createAndSendTxsWithContributions({
      account,
      wallet,
      tokenID1: inputToken?.id,
      tokenID2: outputToken?.id,
      symbol1: inputToken?.symbol,
      symbol2: outputToken?.symbol,
      contributedAmount1: inputValue,
      contributedAmount2: outputValue,
      fee: TRANSACTION_FEE
    });
  };

  const onRemovePool = async () => {
    let shareWithdraw = Math.ceil(new BigNumber(inputValue).dividedBy(maxInputShareOriginal).multipliedBy(share).toNumber());
    if (shareWithdraw > share) {
      shareWithdraw = share;
    }
    await accountServices.createAndSendWithdrawContributionTx({
      account,
      wallet,
      tokenID1: inputToken?.id,
      tokenID2: outputToken?.id,
      withdrawalShareAmt: shareWithdraw,
      amount1: inputValue,
      amount2: outputValue,
      fee: TRANSACTION_FEE
    });
  };

  const onWithdrawFees = async () => {
    await accountServices.createAndSendWithdrawContributionFeeTx({
      account,
      wallet,
      tokenID1: inputToken?.id,
      tokenID2: outputToken?.id,
      withdrawalFeeAmt: withdrawFeeValue,
      fee: TRANSACTION_FEE
    });
  };

  const onConfirmPress = async () => {
    if (loading || error) return;
    try {
      setLoading(true);
      if (tabName === HEADER_TABS.Add) {
        await onCreateContribute();
      } else if (tabName === HEADER_TABS.Remove) {
        await onRemovePool();
      } else {
        await onWithdrawFees();
      }
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (error) {
      setError(new ExHandler(error).getMessage(error?.message));
      new ExHandler(error).showErrorToast();
    } finally {
      setLoading(false);
    }
  };
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onConfirmPress,
          error: errorMessage,
          loading,
        }}
      />
      <Loading open={loading} />
    </ErrorBoundary>
  );
};

export default withTransaction;

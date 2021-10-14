import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {actionGetPDexV3Inst} from '@screens/PDexV3';
import {batch, useDispatch} from 'react-redux';
import {ExHandler} from '@services/exception';
import Loading from '@screens/Dex/components/Loading';
import {liquidityHistoryActions} from '@screens/PDexV3/features/LiquidityHistories';
import {Toast} from '@components/core';
import {actionFetch} from '@screens/PDexV3/features/Portfolio';

const withTransaction = WrappedComp => props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState('');
  const onShowSuccess = () => {
    setTimeout(() => { setVisible(true); }, 500);
  };
  const onClose = () => {
    setVisible(false);
    setTimeout(() => {
      dispatch(liquidityHistoryActions.actionGetHistories());
    }, 500);
  };
  const onCreateContributes = async ({ fee, tokenId1, tokenId2, amount1, amount2, poolPairID, amp, nftId }) => {
    if (loading) return;
    try {
      setLoading(true);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      await pDexV3Inst.createContributeTxs({
        fee,
        tokenId1,
        tokenId2,
        amount1,
        amount2,
        poolPairID,
        amp,
        nftId,
      });
      onShowSuccess();
    } catch (error) {
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoading(false);
    }
  };
  const onCreateNewPool = async ({ fee, tokenId1, tokenId2, amount1, amount2, amp }) => {
    if (loading) return;
    try {
      setLoading(true);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      await pDexV3Inst.createContributeTxs({
        fee,
        tokenId1,
        tokenId2,
        amount1,
        amount2,
        poolPairID: '',
        amp
      });
      onShowSuccess();
    } catch (error) {
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoading(false);
    }
  };
  const onRemoveContribute = async ({ fee, poolTokenIDs, poolPairID, shareAmount, nftID, amount1, amount2 }) => {
    if (loading) return;
    try {
      setLoading(true);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      await pDexV3Inst.createAndSendWithdrawContributeRequestTx({
        fee, poolTokenIDs, poolPairID, shareAmount, nftID, amount1, amount2
      });
      onShowSuccess();
    } catch (error) {
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoading(false);
    }
  };

  const endWithdrawFee = () => {
    batch(() => {
      onClose();
      dispatch(actionFetch());
    });
  };

  const onCreateWithdrawFeeLP = async ({
    fee,
    withdrawTokenIDs,
    poolPairID,
    nftID,
    amount1,
    amount2,
  }) => {
    if (loading) return;
    try {
      setLoading(true);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      await pDexV3Inst.createAndSendWithdrawLPFeeRequestTx({
        fee,
        withdrawTokenIDs,
        poolPairID,
        nftID,
        amount1,
        amount2,
      });
      endWithdrawFee();
    } catch (error) {
      Toast.showError(error.message || typeof error === 'string' && error);
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoading(false);
      endWithdrawFee();
    }
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onCreateContributes,
          onCreateNewPool,
          onRemoveContribute,
          onCreateWithdrawFeeLP,
          onCloseModal: onClose,
          loading,
          visible,
          error,
        }}
      />
      <Loading open={loading} />
    </ErrorBoundary>
  );
};

export default withTransaction;

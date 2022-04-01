import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { actionGetPDexV3Inst } from '@screens/PDexV3';
import { batch, useDispatch } from 'react-redux';
import { ExHandler } from '@services/exception';
import { Toast } from '@components/core';
import { actionFetch } from '@screens/PDexV3/features/Portfolio';
import Loading from '@screens/DexV2/components/Loading';

const withLPTransaction = WrappedComp => props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState('');
  const onShowSuccess = () => {
    setTimeout(() => { setVisible(true); }, 500);
  };
  const onClose = () => {
    setVisible(false);
  };

  /**
   * @param params Information contribute liquidity params.
   * @param {string} params.tokenId1 Token 1 contributed.
   * @param {string} params.tokenId2 Token 2 contributed.
   * @param {string} params.amount1 Amount Token 1 contribute.
   * @param {string} params.amount2 Amount Token 2 contribute.
   * @param {string | undefined} params.poolPairID Pool pair contribute ID.
   * @param {number} params.amp Amplifier.
   * @param {string | undefined} params.accessID AccessID identify .
   */
  const createContributeTxsWithAccessToken = async (params) => {
    if (loading) return;
    try {
      setLoading(true);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      await pDexV3Inst.createContributeTxsWithAccessToken(params);
      onShowSuccess();
    } catch (error) {
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoading(false);
    }
  };


  /**
   * @param params Information contribute liquidity params.
   * @param {string} params.tokenId1 Token 1 contributed.
   * @param {string} params.tokenId2 Token 2 contributed.
   * @param {string} params.amount1 Amount Token 1 contribute.
   * @param {string} params.amount2 Amount Token 2 contribute.
   * @param {number} params.amp Amplifier.
   */
  const createNewPoolTxsWithAccessToken = async (params) => {
    if (loading) return;
    try {
      setLoading(true);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      await pDexV3Inst.createContributeTxsWithAccessToken(params);
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

  const onCreateWithdrawFeeLP = async ({ fee, withdrawTokenIDs, poolPairID, nftID, amount1, amount2 }) => {
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

          // Transactions
          createContributeTxsWithAccessToken,
          createNewPoolTxsWithAccessToken,
          onRemoveContribute,
          onCreateWithdrawFeeLP,

          onCloseModal: onClose,
          loading,
          setLoading,
          visible,
          error,
          setError,
        }}
      />
      {loading && <Loading open={loading} />}
    </ErrorBoundary>
  );
};

export default withLPTransaction;
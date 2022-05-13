import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { actionGetPDexV3Inst } from '@screens/PDexV3';
import { batch, useDispatch } from 'react-redux';
import { ExHandler } from '@services/exception';
import { Toast } from '@components/core';
import { actionFetch } from '@screens/PDexV3/features/Portfolio';
import Loading from '@screens/DexV2/components/Loading';
import { ACCOUNT_CONSTANT } from 'incognito-chain-web-js/build/wallet';

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
   * @param {string} params.shareAmount Value withdraw.
   * @param {string} params.amount1 Amount Token 1 withdraw.
   * @param {string} params.amount2 Amount Token 2 withdraw.
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

  const createAndSendWithdrawContributeRequestTx = async (params, versionTx) => {
    if (loading) return;
    try {
      setLoading(true);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      if (versionTx === ACCOUNT_CONSTANT.PDEX_TRANSACTION_TYPE.ACCESS_ID) {
        await pDexV3Inst.createAndSendWithdrawContributeRequestTxWithAccessToken(params);
      } else {
        await pDexV3Inst.createAndSendWithdrawContributeRequestTx(params);
      }
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

  const createAndSendWithdrawLPFee = async (params, versionTx) => {
    if (loading) return;
    console.log('params:::: ', params);
    try {
      setLoading(true);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      if (versionTx === ACCOUNT_CONSTANT.PDEX_TRANSACTION_TYPE.ACCESS_ID) {
        await pDexV3Inst.createAndSendWithdrawLPFeeRequestTxWithAccessToken(params);
      } else {
        await pDexV3Inst.createAndSendWithdrawLPFeeRequestTx(params);
      }
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
          createAndSendWithdrawContributeRequestTx,
          createAndSendWithdrawLPFee,

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
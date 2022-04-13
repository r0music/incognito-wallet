import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {actionGetPDexV3Inst} from '@screens/PDexV3';
import {batch, useDispatch} from 'react-redux';
import {ExHandler} from '@services/exception';
import Loading from '@screens/Dex/components/Loading';
import {SUCCESS_MODAL} from '@screens/PDexV3/features/Liquidity';
import {SuccessModal} from '@src/components';
import {liquidityHistoryActions} from '@screens/PDexV3/features/LiquidityHistories/index';
import {actionSetNFTTokenData} from '@src/redux/actions/account';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import {ACCOUNT_CONSTANT} from 'incognito-chain-web-js/build/wallet';

const withContributeDetail = WrappedComp => props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const onSuccess = () => {
    setTimeout(() => { setVisible(true); }, 500);
  };
  const onClose = () => {
    setVisible(false);
    batch(() => {
      dispatch(liquidityHistoryActions.actionGetHistories());
      dispatch(actionSetNFTTokenData());
    });
    setTimeout(() => { navigation.navigate(routeNames.LiquidityHistories); }, 500);
  };
  const handleRefund = async (refundData) => {
    if (loading) return;
    setLoading(true);
    try {
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      const {
        versionTx,
        tokenId: tokenID,
        poolPairID,
        pairHash,
        amplifier,
        accessID,
        sharedAccessReceiver ,
        isFirstContribution,
        nftID
      } = refundData;
      if (versionTx === ACCOUNT_CONSTANT.PDEX_TRANSACTION_TYPE.ACCESS_ID) {
        await pDexV3Inst.createAndSendContributeRequestTxWithAccessToken({
          transfer: { fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX, tokenID },
          extra: {
            poolPairID,
            pairHash,
            contributedAmount: String(1),
            accessID,
            amplifier,
            sharedAccessReceiver,
            isFirstContribution
          },
        });
      } else {
        await pDexV3Inst.createAndSendContributeRequestTx({
          transfer: { fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX, tokenID },
          extra: {
            poolPairID,
            pairHash,
            contributedAmount: String(1),
            nftID,
            amplifier,
          },
        });
      }
      onSuccess();
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      setLoading(false);
    }
  };
  const handleRetry = async (retryData) => {
    if (loading) return;
    setLoading(true);
    try {
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      const {
        versionTx,
        tokenId: tokenID,
        poolPairID,
        pairHash,
        amplifier,
        accessID,
        sharedAccessReceiver ,
        isFirstContribution,
        nftID,
        contributedAmount
      } = retryData;
      if (versionTx === ACCOUNT_CONSTANT.PDEX_TRANSACTION_TYPE.ACCESS_ID) {
        await pDexV3Inst.createAndSendContributeRequestTxWithAccessToken({
          transfer: { fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX, tokenID },
          extra: {
            poolPairID,
            pairHash,
            contributedAmount: String(contributedAmount),
            accessID,
            amplifier,
            sharedAccessReceiver,
            isFirstContribution
          },
        });
      } else {
        await pDexV3Inst.createAndSendContributeRequestTx({
          transfer: { fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX, tokenID },
          extra: {
            poolPairID,
            pairHash,
            contributedAmount: String(contributedAmount),
            nftID,
            amplifier,
          },
        });
      }
      onSuccess();
    } catch (error) {
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
          handleRefund,
          handleRetry,
        }}
      />
      <Loading open={loading} />
      <SuccessModal
        closeSuccessDialog={onClose}
        title={SUCCESS_MODAL.ADD_POOL.title}
        buttonTitle="OK"
        description={SUCCESS_MODAL.ADD_POOL.desc}
        visible={visible}
      />
    </ErrorBoundary>
  );
};

export default withContributeDetail;

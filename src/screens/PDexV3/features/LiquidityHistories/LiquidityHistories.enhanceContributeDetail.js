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
import { ACCOUNT_CONSTANT } from 'incognito-chain-web-js/build/wallet';

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
  const handleRefund = async (params) => {
    if (loading) return;
    setLoading(true);
    try {
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      const { tokenId, versionTx } = params;
      const reFundParams = {
        transfer: { tokenID: tokenId, fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX },
        extra: {
          ...params,
        },
      };

      if (versionTx === ACCOUNT_CONSTANT.PDEX_TRANSACTION_TYPE.ACCESS_ID) {
        await pDexV3Inst.createAndSendContributeRequestTxWithAccessToken(reFundParams);
      } else {
        await pDexV3Inst.createAndSendContributeRequestTx(reFundParams);
      }
      onSuccess();
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      setLoading(false);
    }
  };
  const handleRetry = async (params) => {
    if (loading) return;
    setLoading(true);
    try {
      const { tokenId, versionTx } = params;
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      const reTryParams = {
        transfer: { tokenID: tokenId, fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX },
        extra: {
          ...params,
        },
      };
      if (versionTx === ACCOUNT_CONSTANT.PDEX_TRANSACTION_TYPE.ACCESS_ID) {
        await pDexV3Inst.createAndSendContributeRequestTxWithAccessToken(reTryParams);
      } else {
        await pDexV3Inst.createAndSendContributeRequestTx(reTryParams);
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

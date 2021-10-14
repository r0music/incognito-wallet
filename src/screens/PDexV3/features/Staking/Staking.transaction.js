import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {actionGetPDexV3Inst} from '@screens/PDexV3';
import {ExHandler} from '@services/exception';
import LoadingTx from '@components/LoadingTx/LoadingTx';
import {useError} from '@components/UseEffect/useError';
import {stakingActions} from '@screens/PDexV3/features/Staking/index';
import {actionToggleModal} from '@components/Modal';
import SuccessModal from '@screens/PDexV3/features/Staking/Staking.successModal';
import {useNavigation} from 'react-navigation-hooks';

const withTransaction = WrappedComp => props => {
  const dispatch = useDispatch();
  const [error, setError] = React.useState('');
  const _error = useError(error);
  const [loadingTx, setLoadingTx] = React.useState(false);
  const navigation = useNavigation();
  const refreshStakingCoins = () => {
    dispatch(stakingActions.actionFetchCoins());
  };

  const showSuccess = ({ title, subContent, buttonText, btnPress }) => {
    setTimeout(() => {
      dispatch(actionToggleModal({
        data: (
          <SuccessModal
            title={title}
            subContent={subContent}
            buttonText={buttonText}
            onButtonPress={btnPress}
          />
        ),
        visible: true,
      }));
    }, 500);
  };
  const onStaking = async ({ fee, tokenID, tokenAmount, nftID, stakingAmountStr }) => {
    if (loadingTx) return;
    try {
      setLoadingTx(true);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      await pDexV3Inst.stakeCreateRequestTx({ fee, tokenID, tokenAmount, nftID });
      showSuccess({
        title: `You staked\n${stakingAmountStr}`,
        subContent: 'Thanks for helping people trade with freedom.',
        buttonText: 'Stake more',
        btnPress: () => refreshStakingCoins()
      });
    } catch (error) {
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoadingTx(false);
    }
  };
  const onUnStaking = async (withdrawCoins) => {
    if (loadingTx) return;
    try {
      setLoadingTx(true);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      for (const item of withdrawCoins) {
        await pDexV3Inst.stakeWithdrawRequestTx({...item});
      }
      showSuccess({
        title: 'Withdraw successfully',
        subContent: 'Please wait for your balance to update.',
        buttonText: 'Back to dashboard',
        btnPress: () => {
          refreshStakingCoins();
          navigation.goBack();
        }
      });
    } catch (error) {
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoadingTx(false);
    }
  };
  const onWithdrawReward = async (rewardCoins) => {
    if (loadingTx) return;
    try {
      setLoadingTx(true);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      for (const item of rewardCoins) {
        await pDexV3Inst.stakeWithdrawRewardRequestTx({...item});
      }
      showSuccess({
        title: 'Withdrawal reward\nsuccessfully',
        subContent: 'Please wait for your balance to update.',
        buttonText: 'Back to dashboard',
        btnPress: () => refreshStakingCoins()
      });
    } catch (error) {
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoadingTx(false);
    }
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onStaking,
          onUnStaking,
          onWithdrawReward,
          error: _error,
          setError,
        }}
      />
      {loadingTx && <LoadingTx open={loadingTx} />}
    </ErrorBoundary>
  );
};

export default withTransaction;

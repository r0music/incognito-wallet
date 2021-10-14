import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {batch, useDispatch} from 'react-redux';
import {stakingActions} from '@screens/PDexV3/features/Staking/index';

const enhanceFetch = WrappedComp => props => {
  const dispatch = useDispatch();
  const handleFetchCoins = () => dispatch(stakingActions.actionFetchCoins());
  const handleChangeAccount = () => dispatch(stakingActions.actionChangeAccount());
  const handleFetchStakingPools = () => dispatch(stakingActions.actionFetchStakingPools());
  const handleFetchData = () => {
    batch(() => {
      handleChangeAccount();
      handleFetchCoins();
      dispatch(stakingActions.actionFetchStakingPools());
    });
  };
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          handleFetchCoins,
          handleChangeAccount,
          handleFetchStakingPools,
          handleFetchData,
        }}
      />
    </ErrorBoundary>
  );
};
export default enhanceFetch;


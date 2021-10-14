import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {stakingActions} from '@screens/PDexV3/features/Staking/index';

const enhanceHistories = WrappedComp => props => {
  const dispatch = useDispatch();
  const onFetchHistories = () => dispatch(stakingActions.actionFetchHistories());
  React.useEffect(() => {
    onFetchHistories();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onFetchHistories
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceHistories;

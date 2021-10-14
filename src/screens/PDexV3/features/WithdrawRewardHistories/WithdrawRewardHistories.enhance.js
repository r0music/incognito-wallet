import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {withdrawRewardHistoriesActions} from '@screens/PDexV3/features/WithdrawRewardHistories/index';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(withdrawRewardHistoriesActions.actionFetchData());
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;

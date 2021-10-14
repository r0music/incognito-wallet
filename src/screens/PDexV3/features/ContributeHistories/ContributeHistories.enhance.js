import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {contributeHistoriesActions} from '@screens/PDexV3/features/ContributeHistories';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(contributeHistoriesActions.actionFetchData());
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

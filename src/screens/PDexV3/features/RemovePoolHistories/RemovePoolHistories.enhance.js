import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {removePoolHistoriesActions} from '@screens/PDexV3/features/RemovePoolHistories/index';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(removePoolHistoriesActions.actionFetchData());
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

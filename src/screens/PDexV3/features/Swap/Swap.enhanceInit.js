import ErrorBoundary from '@src/components/ErrorBoundary';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { actionFetchPairs } from './Swap.actions';

const enhanceInit = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('[Swap] enhanceInit');
    dispatch(actionFetchPairs(true));
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

export default enhanceInit;

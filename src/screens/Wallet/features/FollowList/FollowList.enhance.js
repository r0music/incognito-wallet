import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { batch, useDispatch } from 'react-redux';
import { FollowAction } from '@screens/Wallet/features/FollowList/index';
import { getPTokenList } from '@src/redux/actions/token';
import {useIsFocused } from 'react-navigation-hooks';
import debounce from 'lodash/debounce';

const withFollowList = WrappedComp => props => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const refInit = React.useRef(false);

  // debounce load balance
  const loadBalance = React.useCallback(debounce(() => {
    batch(() => {
      dispatch(getPTokenList());
      dispatch(FollowAction.actionLoadFollowBalance());
    });
  }, 1000), []);

   React.useEffect(() => {
     if (!refInit || !refInit.current) {
       refInit.current = true;
       return;
     }
     isFocused && loadBalance();
   }, [isFocused]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          loadBalance,
        }}
      />
    </ErrorBoundary>
  );
};

export default withFollowList;

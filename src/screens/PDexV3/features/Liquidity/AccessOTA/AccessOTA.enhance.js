import React from 'react';
import ErrorBoundary from '@components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import { liquidityActions } from '@screens/PDexV3/features/Liquidity';
import debounce from 'lodash/debounce';
import { actionRefresh } from '@screens/PDexV3/features/Home';
import throttle from 'lodash/throttle';

const withInitAccessOTALP = WrappedComp => props => {
  const dispatch = useDispatch();

  const onInitContribute = () => dispatch(liquidityActions.actionInitContribute());
  const _debounceInitContribute = React.useCallback(debounce(onInitContribute, 300), []);

  const onInitRemovePool = () => dispatch(liquidityActions.actionInitRemovePool());
  const _debounceInitRemovePool = React.useCallback(debounce(onInitRemovePool, 300), []);

  const onFreeCreatePool = () => dispatch(liquidityActions.actionFeeCreatePool());
  const onInitCreatePool = (params) => dispatch(liquidityActions.actionInitCreatePool(params));
  const _debounceInitCreatePool = React.useCallback(debounce(onInitCreatePool, 300), []);

  const onRefreshPool = () => dispatch(actionRefresh());
  const _debounceRefreshPool = React.useCallback(debounce(onRefreshPool, 300), []);

  const onFree = () => dispatch(liquidityActions.actionFree());
  const _throttleFree = React.useCallback(throttle(onFree, 100), []);

  React.useEffect(() => {
    _debounceRefreshPool();
    return () => _throttleFree();
  }, []);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onInitContribute: _debounceInitContribute,
          onInitRemovePool: _debounceInitRemovePool,
          onInitCreatePool: _debounceInitCreatePool,

          onFreeCreatePool,
        }}
      />
    </ErrorBoundary>
  );
};

export default withInitAccessOTALP;

import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch, useSelector} from 'react-redux';
import {pairsActions, pairsSelector} from '@screens/PDexV3/features/PairList';
import isEmpty from 'lodash/isEmpty';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const purePairs = useSelector(pairsSelector.mapPairsDataSelector);
  const [pairs, setPairs] = React.useState([]);
  const onFetchData = () => dispatch(pairsActions.actionFetchPairs());
  const onSearch = (text) => {
    const pairs = purePairs.filter(pair => pair.symbolStr.toLowerCase().includes(text.toLowerCase()));
    setPairs(pairs);
  };
  React.useEffect(() => {
    if (isEmpty(purePairs)) return;
    setPairs(purePairs);
  }, [purePairs]);
  React.useEffect(() => {
    onFetchData();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          pairs,
          onFetchData,
          onSearch,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;

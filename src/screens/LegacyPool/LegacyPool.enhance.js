// eslint-disable-next-line import/no-cycle
import { actionSetPoolSelected } from '@screens/PDexV3/features/OrderLimit';
import ErrorBoundary from '@src/components/ErrorBoundary';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'recompose';

export const NEW_POOL =
  '0000000000000000000000000000000000000000000000000000000000000004-076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229-ecf5fc66e0870854f5e4f7d771b9bb4e688639606634e715f9e09a1b6be3ed0b';

export const LEGACY_POOL_1 =
  '0000000000000000000000000000000000000000000000000000000000000004-076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229-33a8ceae6db677d9860a6731de1a01de7e1ca7930404d7ec9ef5028f226f1633';
export const LEGACY_POOL_2 =
  '0000000000000000000000000000000000000000000000000000000000000004-076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229-c8011262f3c7c173df1dea02370824460d15e5f473142a4709fd091c91969e2d';

export const ListPool = [
  {
    key: '1',
    poolID: LEGACY_POOL_1,
    title: 'PRV/USDT (1633)',
    type: 0,
  },
  {
    key: '2',
    poolID: LEGACY_POOL_2,
    title: 'PRV/USDT (9e2d)',
    type: 1,
  },
];

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();

  const [currentPool, setCurrentPool] = useState(ListPool[0]);

  useEffect(() => {
    dispatch(actionSetPoolSelected(currentPool.poolID));
  }, [currentPool]);

  const onChangePool = (item) => {
    setCurrentPool(item);
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...props}
        onChangePool={onChangePool}
        setCurrentPool={setCurrentPool}
        currentPool={currentPool}
      />
    </ErrorBoundary>
  );
};

export default compose(enhance);

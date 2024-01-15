// eslint-disable-next-line import/no-cycle
import { actionSetPoolSelected } from '@screens/PDexV3/features/OrderLimit';
import ErrorBoundary from '@src/components/ErrorBoundary';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'recompose';

export const POOL_PRV_USDT_LEGACY_ID =
  '0000000000000000000000000000000000000000000000000000000000000004-076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229-33a8ceae6db677d9860a6731de1a01de7e1ca7930404d7ec9ef5028f226f1633';

export const POOL_PRV_USDT_NEW_ID =
  '0000000000000000000000000000000000000000000000000000000000000004-076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229-c8011262f3c7c173df1dea02370824460d15e5f473142a4709fd091c91969e2d';


const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actionSetPoolSelected(POOL_PRV_USDT_LEGACY_ID));
  }, []);

  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default compose(enhance);

import TabSwap, {
  actionReset,
  KEYS_PLATFORMS_SUPPORTED,
  SWAP_DEFAULT_FAIR,
  actionSetDefaultExchange,
} from '@screens/PDexV3/features/Swap';
import Header from '@src/components/Header';
import { withLayout_2 } from '@src/components/Layout';
import { ANALYTICS } from '@src/constants';
import { requestUpdateMetrics } from '@src/redux/actions/app';
import React from 'react';
import { useDispatch } from 'react-redux';

const PrivacyAppsTraderJoe = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.JOE));
    dispatch(actionReset());
    dispatch(
      actionSetDefaultExchange({
        isPrivacyApp: true,
        exchange: KEYS_PLATFORMS_SUPPORTED.joe,
      }),
    );
  }, []);

  return (
    <>
      <Header title="pTraderJoe" accountSelectable />
      <TabSwap
        isPrivacyApp
        defaultPair={SWAP_DEFAULT_FAIR.JOE}
        exchange={KEYS_PLATFORMS_SUPPORTED.joe}
      />
    </>
  );
};

PrivacyAppsTraderJoe.propTypes = {};

export default withLayout_2(React.memo(PrivacyAppsTraderJoe));

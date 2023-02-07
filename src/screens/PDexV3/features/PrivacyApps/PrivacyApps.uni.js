import TabSwap, {
  actionReset, KEYS_PLATFORMS_SUPPORTED, NETWORK_NAME_SUPPORTED,
  SWAP_DEFAULT_FAIR,
  actionSetDefaultExchange
} from '@screens/PDexV3/features/Swap';
import Header from '@src/components/Header';
import { withLayout_2 } from '@src/components/Layout';
import { ANALYTICS } from '@src/constants';
import { requestUpdateMetrics } from '@src/redux/actions/app';
import React from 'react';
import { useDispatch } from 'react-redux';

const PrivacyAppsUni = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.UNISWAP));
    dispatch(actionReset());
    dispatch(
      actionSetDefaultExchange({
        isPrivacyApp: true,
        exchange: KEYS_PLATFORMS_SUPPORTED.uni,
        network: NETWORK_NAME_SUPPORTED.POLYGON,
      }),
    );
  }, []);
  return (
    <>
      <Header
        title="pUniswap"
        accountSelectable
      />
      <TabSwap
        isPrivacyApp
        defaultPair={SWAP_DEFAULT_FAIR.UNISWAP}
        exchange={KEYS_PLATFORMS_SUPPORTED.uni}
        network={NETWORK_NAME_SUPPORTED.POLYGON}
      />
    </>
  );
};

PrivacyAppsUni.propTypes = {};

export default withLayout_2(React.memo(PrivacyAppsUni));

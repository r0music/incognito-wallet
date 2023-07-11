import TabSwap, {
  actionReset,
  actionSetDefaultExchange,
  KEYS_PLATFORMS_SUPPORTED,
  SWAP_DEFAULT_FAIR,
} from '@screens/PDexV3/features/Swap';
import Header from '@src/components/Header';
import { withLayout_2 } from '@src/components/Layout';
import { ANALYTICS } from '@src/constants';
import { requestUpdateMetrics } from '@src/redux/actions/app';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

//TODO
const PrivacyAppsABCDE = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.ABCDE));
    dispatch(actionReset());
    dispatch(
      actionSetDefaultExchange({
        isPrivacyApp: true,
        exchange: KEYS_PLATFORMS_SUPPORTED.abcde, //TODO
      }),
    );
  }, []);

  return (
    <>
      <Header title="pABCDE" accountSelectable />
      <TabSwap
        isPrivacyApp
        defaultPair={SWAP_DEFAULT_FAIR.ABCDE}
        exchange={KEYS_PLATFORMS_SUPPORTED.abcde} //TODO
      />
    </>
  );
};

PrivacyAppsABCDE.propTypes = {};

export default withLayout_2(React.memo(PrivacyAppsABCDE));

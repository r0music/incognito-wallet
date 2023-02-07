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

const PrivacyAppsPancake = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.PANCAKE));
    dispatch(actionReset());
    dispatch(
      actionSetDefaultExchange({
        isPrivacyApp: true,
        exchange: KEYS_PLATFORMS_SUPPORTED.pancake,
      }),
    );
  }, []);

  return (
    <>
      <Header title="pPancakeSwap" accountSelectable />
      <TabSwap
        isPrivacyApp
        defaultPair={SWAP_DEFAULT_FAIR.PANCAKE}
        exchange={KEYS_PLATFORMS_SUPPORTED.pancake}
      />
    </>
  );
};

PrivacyAppsPancake.propTypes = {};

export default withLayout_2(React.memo(PrivacyAppsPancake));

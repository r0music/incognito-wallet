import React from 'react';
import TabSwap, {
  KEYS_PLATFORMS_SUPPORTED,
  actionSetDefaultExchange,
  actionInitSwapForm,
  actionReset, NETWORK_NAME_SUPPORTED,
} from '@screens/PDexV3/features/Swap';
import { withLayout_2 } from '@src/components/Layout';
import Header from '@src/components/Header';
import { useDispatch } from 'react-redux';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { requestUpdateMetrics } from '@src/redux/actions/app';
import { ANALYTICS } from '@src/constants';
import { swapInfoSelector } from '../Swap/Swap.selector';

const PrivacyAppsUni = () => {
  const dispatch = useDispatch();
  const swapInfo = useDebounceSelector(swapInfoSelector);
  const handleOnRefresh = async () => {
    await dispatch(
      actionSetDefaultExchange({
        isPrivacyApp: true,
        exchange: KEYS_PLATFORMS_SUPPORTED.uni,
        network: NETWORK_NAME_SUPPORTED.ETHEREUM
      }),
    );
    await dispatch(
      actionInitSwapForm({
        defaultPair: swapInfo?.defaultPair,
        refresh: true,
        shouldFetchHistory: true,
      }),
    );
  };
  React.useEffect(() => {
    dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.UNISWAP));
    dispatch(actionReset());
  }, []);
  return (
    <>
      <Header
        title="pUniswap"
        accountSelectable
        handleSelectedAccount={handleOnRefresh}
      />
      <TabSwap isPrivacyApp exchange={KEYS_PLATFORMS_SUPPORTED.uni} network={NETWORK_NAME_SUPPORTED.ETHEREUM} />
    </>
  );
};

PrivacyAppsUni.propTypes = {};

export default withLayout_2(React.memo(PrivacyAppsUni));

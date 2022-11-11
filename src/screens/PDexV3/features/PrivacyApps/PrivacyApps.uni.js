import React from 'react';
import TabSwap, {
  KEYS_PLATFORMS_SUPPORTED,
  actionSetDefaultExchange,
  actionInitSwapForm,
  actionReset,
  NETWORK_NAME_SUPPORTED,
} from '@screens/PDexV3/features/Swap';
import { withLayout_2 } from '@src/components/Layout';
import Header from '@src/components/Header';
import { useDispatch } from 'react-redux';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { requestUpdateMetrics } from '@src/redux/actions/app';
import { ANALYTICS, CONSTANT_CONFIGS } from '@src/constants';
import { swapInfoSelector } from '../Swap/Swap.selector';

const PrivacyAppsUni = () => {
  const dispatch = useDispatch();
  const swapInfo = useDebounceSelector(swapInfoSelector);
  const handleOnRefresh = async () => {
    await dispatch(
      actionSetDefaultExchange({
        isPrivacyApp: true,
        exchange: KEYS_PLATFORMS_SUPPORTED.uni,
        network: NETWORK_NAME_SUPPORTED.POLYGON,
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
    CONSTANT_CONFIGS.isMainnet &&
      dispatch(
        actionInitSwapForm({
          defaultPair: {
            selltoken:
              '545ef6e26d4d428b16117523935b6be85ec0a63e8c2afeb0162315eb0ce3d151', //USDC (UT)
            buytoken:
              '3ee31eba6376fc16cadb52c8765f20b6ebff92c0b1c5ab5fc78c8c25703bb19e', //ETH (UT)
          },
          refresh: true,
          shouldFetchHistory: false,
        }),
      );
  }, []);
  return (
    <>
      <Header
        title="pUniswap"
        accountSelectable
        handleSelectedAccount={handleOnRefresh}
      />
      <TabSwap
        isPrivacyApp
        exchange={KEYS_PLATFORMS_SUPPORTED.uni}
        network={NETWORK_NAME_SUPPORTED.POLYGON}
      />
    </>
  );
};

PrivacyAppsUni.propTypes = {};

export default withLayout_2(React.memo(PrivacyAppsUni));

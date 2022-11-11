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

const PrivacyAppsSpooky = () => {
  const dispatch = useDispatch();
  const swapInfo = useDebounceSelector(swapInfoSelector);
  const handleOnRefresh = async () => {
    await dispatch(
      actionSetDefaultExchange({
        isPrivacyApp: true,
        exchange: KEYS_PLATFORMS_SUPPORTED.spooky,
        network: NETWORK_NAME_SUPPORTED.FANTOM,
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
    dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.SPOOKY));
    dispatch(actionReset());
    CONSTANT_CONFIGS.isMainnet &&
      setTimeout(
        () =>
          dispatch(
            actionInitSwapForm({
              defaultPair: {
                selltoken:
                  '545ef6e26d4d428b16117523935b6be85ec0a63e8c2afeb0162315eb0ce3d151', //USDC (UT)
                buytoken:
                  '6eed691cb14d11066f939630ff647f5f1c843a8f964d9a4d295fa9cd1111c474', //FTM
              },
              refresh: true,
              shouldFetchHistory: false,
            }),
          ),
        1000,
      );
  }, []);
  return (
    <>
      <Header
        title="pSpooky"
        accountSelectable
        handleSelectedAccount={handleOnRefresh}
      />
      <TabSwap
        isPrivacyApp
        exchange={KEYS_PLATFORMS_SUPPORTED.spooky}
        network={NETWORK_NAME_SUPPORTED.FANTOM}
      />
    </>
  );
};

PrivacyAppsSpooky.propTypes = {};

export default withLayout_2(React.memo(PrivacyAppsSpooky));

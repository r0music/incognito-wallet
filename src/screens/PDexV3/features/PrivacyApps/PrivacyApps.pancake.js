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
import { useNavigationParam } from 'react-navigation-hooks';
import { swapInfoSelector } from '../Swap/Swap.selector';

const PrivacyAppsPancake = () => {
  const dispatch = useDispatch();
  const swapInfo = useDebounceSelector(swapInfoSelector);
  const handleOnRefresh = async () => {
    await dispatch(
      actionSetDefaultExchange({
        isPrivacyApp: true,
        exchange: KEYS_PLATFORMS_SUPPORTED.pancake,
        network: NETWORK_NAME_SUPPORTED.BINANCE_SMART_CHAIN,
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
    dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.PANCAKE));
    dispatch(actionReset());
    CONSTANT_CONFIGS.isMainnet &&
      dispatch(
        actionInitSwapForm({
          defaultPair: {
            selltoken:
              '545ef6e26d4d428b16117523935b6be85ec0a63e8c2afeb0162315eb0ce3d151', //USDC (UT)
            buytoken:
              'e5032c083f0da67ca141331b6005e4a3740c50218f151a5e829e9d03227e33e2', //BNB (BSC)
          },
          refresh: true,
          shouldFetchHistory: false,
        }),
      );
  }, []);
  return (
    <>
      <Header
        title="pPancakeSwap"
        accountSelectable
        handleSelectedAccount={handleOnRefresh}
      />
      <TabSwap
        isPrivacyApp
        exchange={KEYS_PLATFORMS_SUPPORTED.pancake}
        network={NETWORK_NAME_SUPPORTED.BINANCE_SMART_CHAIN}
      />
    </>
  );
};

PrivacyAppsPancake.propTypes = {};

export default withLayout_2(React.memo(PrivacyAppsPancake));

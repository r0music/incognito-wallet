import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { TradeSuccessModal } from '@src/screens/PDexV3/features/Trade';
import { focus } from 'redux-form';
import { actionCheckNeedFaucetPRV } from '@src/redux/actions/token';
import FaucetPRVModal from '@src/components/Modal/features/FaucetPRVModal';
import RemoveSuccessDialog from '@src/screens/Setting/features/RemoveStorage/RemoveStorage.Dialog';
import { compose } from 'recompose';
import withLazy from '@src/components/LazyHoc/LazyHoc';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import SwapService from '@src/services/api/swap';

import {
  formConfigs,
  KEYS_PLATFORMS_SUPPORTED,
  NETWORK_NAME_SUPPORTED,
} from './Swap.constant';

import {
  actionInitSwapForm,
  actionReset,
  actionFetchSwap,
  actionToggleProTab,
  actionSetDefaultExchange,
  actionNavigateFormMarketTab,
} from './Swap.actions';

import {
  swapInfoSelector,
  swapFormErrorSelector,
  sellInputTokenSelector,
  feetokenDataSelector,
  getEsimateTradeError,
  getIsNavigateFromMarketTab,
  buyInputTokenSeletor,
} from './Swap.selector';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const swapInfo = useDebounceSelector(swapInfoSelector);
  const formErrors = useDebounceSelector(swapFormErrorSelector);
  const sellInputToken = useDebounceSelector(sellInputTokenSelector);
  const buyInputToken = useDebounceSelector(buyInputTokenSeletor);
  const feeTokenData = useDebounceSelector(feetokenDataSelector);
  const estimateTradeError = useSelector(getEsimateTradeError);
  const isNavigateFromMarketTab = useSelector(getIsNavigateFromMarketTab);
  const [visibleSignificant, setVisibleSignificant] = React.useState(false);
  const [ordering, setOrdering] = React.useState(false);
  const navigation = useNavigation();

  const {
    isPrivacyApp = false,
    exchange = KEYS_PLATFORMS_SUPPORTED.incognito,
    network = NETWORK_NAME_SUPPORTED.INCOGNITO,
  } = props;

  const unmountSwap = () => {
    dispatch(actionReset());
  };

  const initSwapForm = (refresh = false) =>
    dispatch(
      actionInitSwapForm({
        defaultPair: swapInfo?.defaultPair,
        refresh,
        shouldFetchHistory: true,
      }),
    );

  const handleCreateSwapOrder = async () => {
    const tx = await dispatch(actionFetchSwap());

    if (tx) {
      setTimeout(() => {
        dispatch(
          actionToggleModal({
            data: (
              <TradeSuccessModal
                title="Swap initiated!"
                desc={`You placed an order to sell\n${
                  swapInfo?.sellInputAmountStr || ''
                } for ${swapInfo?.buyInputAmountStr || ''}.`}
                handleTradeSucesss={() => initSwapForm()}
                sub="Your balance will update in a couple of minutes after the swap is finalized."
              />
            ),
            visible: true,
          }),
        );
      }, 500);
    }
  };
  const handleConfirm = async () => {
    try {
      if (ordering) {
        return;
      }
      await setOrdering(true);
      const fields = [formConfigs.selltoken, formConfigs.buytoken];
      for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        if (formErrors[field]) {
          return dispatch(focus(formConfigs.formName, field));
        }
      }
      if (estimateTradeError) {
        return;
      }
      if (
        swapInfo?.disabledBtnSwap &&
        !formErrors[formConfigs.selltoken] &&
        !formErrors[formConfigs.buytoken] &&
        (!!formErrors[formConfigs.slippagetolerance] ||
          !!formErrors[formConfigs.feetoken])
      ) {
        dispatch(actionToggleProTab(true));
        return;
      }
      if (!sellInputToken.isMainCrypto) {
        const needFaucet = await dispatch(
          actionCheckNeedFaucetPRV(
            <FaucetPRVModal />,
            swapInfo?.accountBalance,
          ),
        );
        if (needFaucet) {
          return;
        }
      }
      const { isSignificant } = feeTokenData;
      if (isSignificant) {
        return setVisibleSignificant(true);
      }
      await handleCreateSwapOrder();
    } catch {
      //
    } finally {
      setOrdering(false);
    }
  };
  const handleInitSwapForm = async () => {
    if (isPrivacyApp) {
      await dispatch(
        actionSetDefaultExchange({
          isPrivacyApp,
          exchange,
          network,
        }),
      );
    } else {
      if (!isNavigateFromMarketTab) {
        await dispatch(
          actionInitSwapForm({
            defaultPair: {
              selltoken:
                'b832e5d3b1f01a4f0623f7fe91d6673461e1f5d37d91fe78c5c2e6183ff39696', //BTC
              buytoken:
                '0000000000000000000000000000000000000000000000000000000000000004', //PRV
            },
            refresh: true,
            shouldFetchHistory: false,
          }),
        );
      }
    }
  };

  React.useEffect(() => {
    handleInitSwapForm();
    if (navigation?.state?.routeName !== routeNames.Trade) {
      return () => {
        unmountSwap();
      };
    }
    dispatch(actionNavigateFormMarketTab(false));
  }, []);

  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleConfirm, initSwapForm }} />
      <RemoveSuccessDialog
        visible={visibleSignificant}
        onPressCancel={() => setVisibleSignificant(false)}
        onPressAccept={() => {
          setVisibleSignificant(false);
          handleCreateSwapOrder();
        }}
        title="Warning"
        subTitle="Do note that due to trade size, the price of this trade varies significantly from market price."
        acceptStr="Accept"
      />
    </ErrorBoundary>
  );
};

export default compose(withLazy, enhance);

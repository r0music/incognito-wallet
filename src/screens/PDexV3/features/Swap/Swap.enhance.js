import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { TradeSuccessModal } from '@src/screens/PDexV3/features/Trade';
import {
  actionInitSwapForm,
  actionReset,
  actionFetchSwap,
  actionFetchSwapOtherPlatforms,
} from './Swap.actions';
import { swapInfoSelector } from './Swap.selector';
import { PlatformNames, SwapPlatforms } from './Swap.constant';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const swapInfo = useSelector(swapInfoSelector);
  const unmountSwap = () => {
    dispatch(actionReset());
  };
  const initSwapForm = (refresh = false) =>
    dispatch(
      actionInitSwapForm({ defaultPair: swapInfo?.defaultPair, refresh }),
    );
  const handleConfirm = async () => {
    try {
      if (swapInfo?.disabledBtnSwap) {
        return;
      }
      // check platforms
      let tx;
      if (swapInfo.platformNameStr === PlatformNames[SwapPlatforms.Incognito]) {
        tx = await dispatch(actionFetchSwap());
      } else {
        tx = await dispatch(actionFetchSwapOtherPlatforms());
      }
     
      if (tx) {
        dispatch(
          actionToggleModal({
            data: (
              <TradeSuccessModal
                title="Order initiated!"
                desc={`You placed an order to sell\n${swapInfo?.sellInputAmountStr ||
                  ''} for ${swapInfo?.buyInputAmountStr || ''}.`}
                handleTradeSucesss={() => initSwapForm()}
                sub={
                  'Your balance will update in a couple of\nminutes after the trade is finalized.'
                }
              />
            ),
            visible: true,
          }),
        );
      }
    } catch {
      //
    }
  };
  React.useEffect(() => {
    initSwapForm(true);
    return () => {
      unmountSwap();
    };
  }, []);

  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleConfirm, initSwapForm }} />
    </ErrorBoundary>
  );
};

export default enhance;

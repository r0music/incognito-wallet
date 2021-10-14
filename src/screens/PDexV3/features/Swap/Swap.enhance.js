import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { TradeSuccessModal } from '@src/screens/PDexV3/features/Trade';
import { useFocusEffect } from 'react-navigation-hooks';
import { actionInitSwapForm, actionFetchSwap } from './Swap.actions';
import { swapInfoSelector } from './Swap.selector';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const swapInfo = useSelector(swapInfoSelector);
  const initSwapForm = React.useCallback(() => {
    dispatch(actionInitSwapForm());
  }, []);
  const handleConfirm = async () => {
    try {
      const tx = await dispatch(actionFetchSwap());
      if (tx) {
        dispatch(
          actionToggleModal({
            data: (
              <TradeSuccessModal
                title="Order initiated!"
                desc={`You placed an order to sell\n${swapInfo?.sellInputAmountStr ||
                  ''} for ${swapInfo?.buyInputAmountStr || ''}.`}
                handleTradeSucesss={initSwapForm}
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
  useFocusEffect(
    React.useCallback(() => {
      initSwapForm();
    }, []),
  );
  React.useEffect(() => {
    initSwapForm();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleConfirm, initSwapForm }} />
    </ErrorBoundary>
  );
};

export default enhance;

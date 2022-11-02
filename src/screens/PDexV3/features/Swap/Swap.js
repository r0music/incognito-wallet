import { createForm } from '@components/core/reduxForm';
import { KeyboardAwareScrollView, RefreshControl } from '@src/components/core';
import LoadingTx from '@src/components/LoadingTx';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import throttle from 'lodash/throttle';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TradeButton from './components/Swap.TradeButton';
import { swapInfoSelector } from './redux/Swap.selector';
import { formConfigs } from './Swap.constant';
import withSwap from './Swap.enhance';
import GroupSubInfo from './Swap.groupSubInfo';
import SwapInputsGroup from './Swap.inputsGroup';
import { styled } from './Swap.styled';

const initialFormValues = {
  selltoken: '',
  buytoken: '',
  slippagetolerance: '',
  feetoken: '',
};

const Form = createForm(formConfigs.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const Swap = (props) => {
  const { initSwapForm, handleConfirm } = props;
  const swapInfo = useDebounceSelector(swapInfoSelector);

  const [page, setPage] = useState(0);
  const [isExpandPage, setIsExpandPage] = useState(false);

  const setLoadPage = () => {
    if (!isExpandPage) return;
    setPage((page) => page + 4);
  };

  const _debounceLoadPage = throttle(() => {
    setLoadPage();
  }, 2000);

  const setShowHistory = (isShow) => {
    setIsExpandPage(isShow);
    if (!isShow) {
      return setPage(0);
    }
    setPage((page) => page + 5);
  };

  return (
    <>
      <KeyboardAwareScrollView
        style={[styled.scrollview]}
        refreshControl={
          <RefreshControl
            refreshing={swapInfo?.refreshing}
            onRefresh={initSwapForm}
          />
        }
        onScroll={({ nativeEvent }) => {
          if (
            isCloseToBottom(nativeEvent) &&
            typeof setLoadPage === 'function'
          ) {
            _debounceLoadPage();
          }
        }}
        scrollEventThrottle={600}
      >
        <Form>
          {() => (
            <>
              <SwapInputsGroup />
              <TradeButton onPress={handleConfirm} />
            </>
          )}
        </Form>
        <GroupSubInfo
          page={page}
          isExpandPage={isExpandPage}
          setShowHistory={setShowHistory}
        />
      </KeyboardAwareScrollView>
      {!!swapInfo.swaping && <LoadingTx />}
    </>
  );
};

Swap.propTypes = {
  handleConfirm: PropTypes.func.isRequired,
};

export default withSwap(React.memo(Swap));

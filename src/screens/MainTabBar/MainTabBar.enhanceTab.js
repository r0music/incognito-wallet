import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import Modal from '@components/Modal';
import BottomBarLearnMore from '@components/core/BottomBar/BottomBar_LearnMore';

const withTab = (WrappedComp) => (props) => {
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
      <Modal />
      <BottomBarLearnMore
        onPress={() => {}}
        text="Sunsetting Incognito."
        autoscroll
      />
    </ErrorBoundary>
  );
};

export default withTab;

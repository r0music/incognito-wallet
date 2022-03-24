import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import Modal from '@components/Modal';

const withTab = (WrappedComp) => (props) => {
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
      <Modal />
    </ErrorBoundary>
  );
};

export default withTab;

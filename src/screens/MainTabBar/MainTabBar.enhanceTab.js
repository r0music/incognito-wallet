import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import Modal from '@components/Modal';
// import withPin from '@components/pin.enhance';
import { compose } from 'recompose';

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

export default compose(
  // withPin,
  withTab
);

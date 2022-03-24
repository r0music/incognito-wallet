import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import { withLayout_2 } from '@src/components/Layout';
import { compose } from 'recompose';
import {
  actionAddFollowToken,
  actionRemoveFollowToken,
} from '@src/redux/actions/token';
import { withTokenVerified } from '@src/components/Token';
import withLazy from '@components/LazyHoc/LazyHoc';

export const withFollow = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const handleToggleFollowToken = async (token) => {
    try {
      if (!token?.isFollowed) {
        dispatch(actionAddFollowToken(token?.tokenId));
      } else {
        dispatch(actionRemoveFollowToken(token?.tokenId));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          handleToggleFollowToken,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withLazy,
  withTokenVerified,
  withFollow,
  withLayout_2,
);

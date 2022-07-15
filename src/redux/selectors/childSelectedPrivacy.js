import { createSelector } from 'reselect';

export const childSelectedPrivacy = createSelector(
  (state) => state?.childSelectedPrivacy?.data,
  (data) => data,
);

export default {
  childSelectedPrivacy,
};

import { createSelector } from 'reselect';

export const tradePDexV3Selector = createSelector(
  (state) => state.pDexV3,
  ({ trade }) => trade,
);

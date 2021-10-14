import { createSelector } from 'reselect';

export const pDexV3Selector = createSelector(
  (state) => state.pDexV3,
  (pDexV3) => pDexV3,
);

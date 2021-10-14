import {createSelector} from 'reselect';

export const liquiditySelector = createSelector(
  (state) => state.pDexV3,
  ({ liquidity }) => liquidity,
);

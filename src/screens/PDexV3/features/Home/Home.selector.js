import { createSelector } from 'reselect';

export const homePDexV3Selector = createSelector(
  (state) => state.pDexV3,
  ({ home }) => {
    const { isFetching, isFetched } = home;
    const shouldHandleChangeTab = isFetched && !isFetching;
    return {
      ...home,
      shouldHandleChangeTab,
    };
  },
);

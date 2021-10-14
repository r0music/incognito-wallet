import { createSelector } from 'reselect';

export const tabsSelector = createSelector(
  (state) => state.tabs,
  (tabs) => tabs,
);

export const activedTabSelector = createSelector(
  tabsSelector,
  (tabs) => (rootTabID) => tabs[rootTabID],
);

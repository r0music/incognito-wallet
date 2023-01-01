import { createSelector } from 'reselect';

const fundingPRVSelector = createSelector(
  (state) => state.fundingPRVReducer,
  (fundingPRVReducer) => fundingPRVReducer,
);

const modalVisibleSelector = createSelector(
  fundingPRVSelector,
  ({ isVisible }) => isVisible,
);

const minPRVNeededSelector = createSelector(
  fundingPRVSelector,
  ({ minPRVNeeded }) => minPRVNeeded,
);



export {
  fundingPRVSelector,
  modalVisibleSelector,
  minPRVNeededSelector
};

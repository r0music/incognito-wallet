import { createSelector } from 'reselect';
import { selectedPrivacySelector, childSelectedPrivacySelector } from '@src/redux/selectors';
import { getFeeData } from './EstimateFee.utils';

export const estimateFeeSelector = createSelector(
  (state) => state.estimateFee,
  (estimateFee) => estimateFee,
);

export const feeDataSelector = createSelector(
  estimateFeeSelector,
  selectedPrivacySelector.selectedPrivacy,
  childSelectedPrivacySelector.childSelectedPrivacy,
  (estimateFee, selectedPrivacy, childSelectedPrivacy) =>
    getFeeData(estimateFee, selectedPrivacy, childSelectedPrivacy),
);


export const networksSelector = createSelector(
  selectedPrivacySelector.selectedPrivacy,
  (selectedPrivacy) => {
    if (selectedPrivacy?.isMainCrypto) {
      return selectedPrivacy?.listChildToken;
    } else if (selectedPrivacy?.isPUnifiedToken) {
      return selectedPrivacy?.listUnifiedToken;
    } else {
      return [selectedPrivacy];
    }
  },
);

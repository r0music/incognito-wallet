import { createSelector } from 'reselect';
import { selectedPrivacySelector, childSelectedPrivacySelector } from '@src/redux/selectors';
import { getFeeData, getNetworksForUnifiedToken } from './EstimateFee.utils';

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
  estimateFeeSelector,
  selectedPrivacySelector.selectedPrivacy,
  (estimateFee, selectedPrivacy) => {
    if (selectedPrivacy?.isMainCrypto) {
      return selectedPrivacy?.listChildToken;
    } else if (selectedPrivacy?.isPUnifiedToken) {
      return getNetworksForUnifiedToken({
        selectedPrivacy,
        networkSupports: estimateFee?.networkSupports || null,
      });
    } else {
      return [selectedPrivacy];
    }
  },
);

export const isFetchingNetworksSelector = createSelector(
  estimateFeeSelector,
  (estimateFee) => estimateFee?.isFetchingNetworkSupports,
);
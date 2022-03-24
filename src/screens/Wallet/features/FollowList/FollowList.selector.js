import { createSelector } from 'reselect';
import { defaultAccountSelector } from '@src/redux/selectors/account';
import { PRVIDSTR } from 'incognito-chain-web-js/build/wallet';
import orderBy from 'lodash/orderBy';

export const followStateSelector = createSelector(
  (state) => state.followWallet,
  (followState) => followState,
);

export const followTokensWalletSelector = createSelector(
  followStateSelector,
  defaultAccountSelector,
  (followList, { OTAKey }) => {
    const tokens = orderBy(
      followList?.data[OTAKey] || [],
      [(c) => c.id === PRVIDSTR, (c) => Number(c.amount || '0')],
      ['desc', 'desc']
    );
    return tokens;
  },
);

export const followTokenItemSelector = createSelector(
  followTokensWalletSelector,
  (tokens) => (tokenId) => {
    return tokens.find(item => item.id === tokenId);
  },
);

export const isFetchingSelector = createSelector(
  followStateSelector,
  (followState) => followState?.isFetching,
);

export default {
  followTokensWalletSelector
};

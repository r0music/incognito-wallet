import { createSelector } from 'reselect';
import { CONSTANT_COMMONS } from '@src/constants';
import {
  pTokensSelector,
  internalTokensSelector,
} from '@src/redux/selectors/token';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { uniqBy, isNaN, compact, fromPairs } from 'lodash';
import convert from '@src/utils/convert';
import { BIG_COINS } from '@src/screens/DexV2/constants';
import { currencySelector, decimalDigitsSelector } from '@screens/Setting';
import { formatAmount } from '@components/Token';
import { PRV } from '@services/wallet/tokenService';
import { getAccountWallet } from '@src/services/wallet/Wallet.shared';
import { FollowSelector } from '@screens/Wallet/features/FollowList';
import {
  defaultAccountName,
  defaultAccountSelector,
} from './account';
import { walletSelector } from './wallet';

export const isGettingBalance = createSelector(
  (state) => state?.token?.isGettingBalance,
  (state) => state?.account?.isGettingBalance,
  defaultAccountName,
  (tokens, accounts, defaultAccountName) => {
    const isLoadingAccountBalance = accounts?.includes(defaultAccountName);
    const result = [...tokens];
    return isLoadingAccountBalance
      ? [...result, CONSTANT_COMMONS.PRV.id]
      : result;
  },
);

export const availableTokensSelector = createSelector(
  pTokensSelector,
  internalTokensSelector,
  FollowSelector.followTokensWalletSelector,
  selectedPrivacySelector.getPrivacyDataByTokenID,
  (pTokens, internalTokens, followedTokens, getPrivacyDataByTokenID) => {
    const followedTokenIds = followedTokens.map((t) => t?.id) || [];
    const allTokenIds = Object.keys(
      fromPairs([
        ...internalTokens?.map((t) => [t?.id]),
        ...pTokens?.map((t) => [t?.tokenId]),
      ]),
    );
    const tokens = [];
    allTokenIds?.forEach((tokenId) => {
      const token = getPrivacyDataByTokenID(tokenId);
      if (token?.name && token?.symbol && token.tokenId) {
        let _token = { ...token };
        if (followedTokenIds.includes(token.tokenId)) {
          _token.isFollowed = true;
        }
        tokens.push(_token);
      }
    });
    const excludeRPV = (token) => token?.tokenId !== CONSTANT_COMMONS.PRV.id;
    return uniqBy(tokens.filter(excludeRPV), 'tokenId') || [];
  },
);

export const marketTokens = createSelector(
  pTokensSelector,
  internalTokensSelector,
  FollowSelector.followTokensWalletSelector,
  selectedPrivacySelector.getPrivacyDataByTokenID,
  (pTokens, internalTokens, followedTokens, getPrivacyDataByTokenID) => {
    const followedTokenIds = followedTokens.map((t) => t?.id) || [];
    const allTokenIds = Object.keys(
      fromPairs([
        ...internalTokens?.map((t) => [t?.id]),
        ...pTokens?.map((t) => [t?.tokenId]),
      ]),
    );
    const tokens = [];
    allTokenIds?.forEach((tokenId) => {
      const token = getPrivacyDataByTokenID(tokenId);
      if (token?.name && token?.symbol && token.tokenId) {
        let _token = { ...token };
        if (followedTokenIds.includes(token.tokenId)) {
          _token.isFollowed = true;
        }
        tokens.push(_token);
      }
    });
    return uniqBy(tokens, 'tokenId') || [];
  },
);

export const pTokenSelector = createSelector(
  selectedPrivacySelector.getPrivacyDataByTokenID,
  currencySelector,
  (getPrivacyDataByTokenID, isToggleUSD) => {
    const decimalDigit = getPrivacyDataByTokenID(
      isToggleUSD ? BIG_COINS.USDT : BIG_COINS.PRV,
    );
    return {
      pToken: decimalDigit,
      isToggleUSD,
    };
  },
);

export const prefixCurrency = createSelector(
  currencySelector,
  (isToggleUSD) => {
    return isToggleUSD
      ? CONSTANT_COMMONS.USD_SPECIAL_SYMBOL
      : CONSTANT_COMMONS.PRV_SPECIAL_SYMBOL;
  },
);

export const totalShieldedTokensSelector = createSelector(
  selectedPrivacySelector.getPrivacyDataByTokenID,
  FollowSelector.followTokensWalletSelector,
  pTokenSelector,
  decimalDigitsSelector,
  (
    getPrivacyDataByTokenID,
    followTokens,
    currency,
    decimalDigits,
  ) => {
    const { isToggleUSD } = currency;
    followTokens = followTokens.map(({ id, amount }) => {
      const { priceUsd, pricePrv, pDecimals } = getPrivacyDataByTokenID(id);
      return {
        priceUsd,
        pricePrv,
        balance: amount,
        pDecimals,
      };
    });
    const totalShielded = compact([...followTokens]).reduce(
      (prevValue, currentValue) => {
        const totalShielded = prevValue;
        const pDecimals = currentValue?.pDecimals || 0;
        const amount = currentValue?.balance || 0;
        const price = isToggleUSD
          ? currentValue?.priceUsd
          : currentValue?.pricePrv || 0;
        let currentAmount = formatAmount(
          price,
          amount,
          pDecimals,
          pDecimals,
          decimalDigits,
          true,
        );

        if (isNaN(currentAmount)) {
          currentAmount = 0;
        }
        return currentAmount + totalShielded;
      },
      0,
    );
    return convert.toOriginalAmount(totalShielded, PRV.pDecimals, true);
  },
);

export const unFollowTokensSelector = createSelector(
  availableTokensSelector,
  (tokens) => tokens.filter((token) => !(token?.isFollowed === true)),
);

export const getDefaultAccountWalletSelector = createSelector(
  defaultAccountSelector,
  walletSelector,
  (account, wallet) => getAccountWallet(account, wallet),
);

export default {
  isGettingBalance,
  getDefaultAccountWalletSelector,
};

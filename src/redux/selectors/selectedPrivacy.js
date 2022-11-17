import { createSelector } from 'reselect';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import memoize from 'memoize-one';
import { CONSTANT_COMMONS } from '@src/constants';
import { ExHandler } from '@src/services/exception';
import { BIG_COINS, PRIORITY_LIST } from '@src/screens/Dex/constants';
import toLower from 'lodash/toLower';
import { followTokensWalletSelector } from '@screens/Wallet/features/FollowList/FollowList.selector';
import { defaultAccount } from './account';
import token, {
  tokensFollowedSelector,
  pTokens,
  internalTokens,
  pTokenIdsSelector,
} from './token';
import { getPrice } from '../utils/selectedPrivacy';

export const selectedPrivacyTokenID = createSelector(
  (state) => state?.selectedPrivacy?.tokenID,
  (tokenId) => tokenId,
);

export const getPrivacyDataByTokenID = createSelector(
  defaultAccount,
  internalTokens,
  pTokens,
  tokensFollowedSelector,
  followTokensWalletSelector,
  (account, internalTokens, pTokens, followed, tokenFollowWallet) =>
    memoize((tokenID) => {
      let data = {};
      if (!tokenID) {
        return data;
      }
      try {
        tokenID = toLower(tokenID);
        const internalTokenData =
          internalTokens?.find(
            (t) => t?.id !== CONSTANT_COMMONS.PRV_TOKEN_ID && t?.id === tokenID,
          ) || {};
        const pTokenData = pTokens?.find((t) => t?.tokenId === tokenID);
        const followedTokenData = followed.find((t) => t?.id === tokenID) || {};
        const isExistTokenFollowInWallet = tokenFollowWallet.some(
          (t) => t?.id === tokenID,
        );
        if (
          !internalTokenData &&
          !pTokenData &&
          tokenID !== CONSTANT_COMMONS.PRV_TOKEN_ID
        ) {
          console.log(`Can not find coin with id ${tokenID}`);
        }
        const token = new SelectedPrivacy(
          account,
          { ...internalTokenData, ...followedTokenData },
          pTokenData,
          tokenID,
        );

        // convert childToken data to selected privacy token data of list unified token
        let listUnifiedToken = token?.listUnifiedToken;
        let unifiedTokens = [];
        for (let i = 0; i < listUnifiedToken?.length; i++) {
          const childTokenId = listUnifiedToken[i]?.tokenId;
          const childTokenData = listUnifiedToken[i];
          const childTokenSelectedPrivacyData = new SelectedPrivacy(
            account,
            null,
            childTokenData,
            childTokenId,
          );
          unifiedTokens.push(childTokenSelectedPrivacyData);
        }
        token.listUnifiedToken = unifiedTokens || [];

        // convert childToken data to selected privacy token data of list child token
        let listChildTokenOfPRV = token?.listChildToken;
        let newListChildTokenOfPRV = [];
        for (let i = 0; i < listChildTokenOfPRV?.length; i++) {
          const childTokenId = listChildTokenOfPRV[i]?.tokenId;
          const childTokenData = listChildTokenOfPRV[i];
          const childTokenSelectedPrivacyData = new SelectedPrivacy(
            account,
            null,
            childTokenData,
            childTokenId,
          );
          newListChildTokenOfPRV.push(childTokenSelectedPrivacyData);
        }
        token.listChildToken = newListChildTokenOfPRV || [];

        const tokenUSDT = pTokens.find(
          (token) => token?.tokenId === BIG_COINS.USDT,
        );
        const price = getPrice({ token, tokenUSDT });
        let priority =
          PRIORITY_LIST.indexOf(tokenID) > -1
            ? PRIORITY_LIST.indexOf(tokenID)
            : PRIORITY_LIST.length + 1;
        data = {
          ...token,
          ...price,
          amount: followedTokenData.amount,
          isFollowed: isExistTokenFollowInWallet,
          priority,
        };
      } catch (e) {
        console.log('error', tokenID, e);
      }
      return data;
    }),
);

export const getPrivacyDataBaseOnAccount = createSelector(
  internalTokens,
  pTokens,
  tokensFollowedSelector,
  selectedPrivacyTokenID,
  (_internalTokens, _pTokens, _followed, tokenID) => (account) => {
    try {
      // 'PRV' is not a token
      const internalTokenData =
        _internalTokens?.find(
          (t) => t?.id !== CONSTANT_COMMONS.PRV_TOKEN_ID && t?.id === tokenID,
        ) || {};
      const pTokenData = _pTokens?.find((t) => t?.tokenId === tokenID);
      const followedTokenData = _followed.find((t) => t?.id === tokenID) || {};
      if (
        !internalTokenData &&
        !pTokenData &&
        tokenID !== CONSTANT_COMMONS.PRV_TOKEN_ID
      ) {
        console.log(`Can not find coin with id ${tokenID}`);
      }
      return new SelectedPrivacy(
        account,
        { ...internalTokenData, ...followedTokenData },
        pTokenData,
      );
    } catch (e) {
      new ExHandler(e);
    }
  },
);

export const selectedPrivacy = createSelector(
  selectedPrivacyTokenID,
  getPrivacyDataByTokenID,
  (selectedSymbol, getFn) => {
    return getFn(selectedSymbol);
  },
);

export const selectedPrivacyByFollowedSelector = createSelector(
  selectedPrivacy,
  tokensFollowedSelector,
  (selected, followed) =>
    followed.find((token) => token?.id === selected?.tokenId),
);

export const findTokenFollowedByIdSelector = createSelector(
  tokensFollowedSelector,
  (followed) => (tokenID) => followed.find((token) => token?.id === tokenID),
);

export const getAllPrivacyDataSelector = createSelector(
  pTokenIdsSelector,
  getPrivacyDataByTokenID,
  (tokenIdList, getPrivacyDataByTokenIDFunction) =>
    memoize(
      () =>
        tokenIdList.map((tokenId) =>
          getPrivacyDataByTokenIDFunction(tokenId),
        ) || [],
    ),
);

export const getPrivacyDataFilterSelector = createSelector(
  getAllPrivacyDataSelector,
  (getAllPrivacyDataFunction) => {
    const selectTokenList: SelectedPrivacy[] = getAllPrivacyDataFunction();
    return selectTokenList.filter((token) => token.tokenId) || [];
  },
);

export default {
  getPrivacyDataByTokenID,
  selectedPrivacyTokenID,
  selectedPrivacy,
  getPrivacyDataBaseOnAccount,
  selectedPrivacyByFollowedSelector,
  findTokenFollowedByIdSelector,
  getAllPrivacyDataSelector,
  getPrivacyDataFilterSelector,
};

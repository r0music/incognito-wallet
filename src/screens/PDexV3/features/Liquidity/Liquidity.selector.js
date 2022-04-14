import { createSelector } from 'reselect';
import { getDataByShareIdSelector } from '@screens/PDexV3/features/Portfolio';
import { ACCOUNT_CONSTANT } from 'incognito-chain-web-js/build/wallet';
import uniq from 'lodash/uniq';

export const liquiditySelector = createSelector(
  (state) => state.pDexV3,
  ({ liquidity }) => liquidity,
);

export const compressParamsWithdrawFee = createSelector(
  getDataByShareIdSelector,
  (getDataShare) => ({ poolId, shareId }) => {
    // Get data share
    const dataShare = getDataShare(shareId);
    if (!dataShare) return null;

    // Get params
    const { nftId, tokenId1, tokenId2, rewards, orderRewards, currentAccessOta, versionTx } = dataShare;
    if (versionTx === ACCOUNT_CONSTANT.PDEX_TRANSACTION_TYPE.ACCESS_ID && !currentAccessOta) return null;

    // Get Token fee
    let tokenIDs = [tokenId1, tokenId2]
      .concat(Object.keys(rewards || {}))
      .concat(Object.keys(orderRewards || {}));
    tokenIDs = uniq(tokenIDs.map(tokenID => tokenID.toLowerCase()));

    // prepare params
    let params = {
      fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
      withdrawTokenIDs: tokenIDs,
      poolPairID: poolId,
      amount1: String(0),
      amount2: String(0)
    };

    if (versionTx === ACCOUNT_CONSTANT.PDEX_TRANSACTION_TYPE.ACCESS_ID) {
      params = {
        ...params,
        burnOTA: currentAccessOta,
        accessID: nftId
      };
    } else {
      params = {
        ...params,
        nftID: nftId
      };
    }
    return { params, versionTx };
  },
);
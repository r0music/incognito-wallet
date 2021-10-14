import {createSelector} from 'reselect';
import format from '@utils/format';
import {selectedPrivacySelector as selectedPrivacy} from '@src/redux/selectors';
import isEmpty from 'lodash/isEmpty';

const liquidityHistoriesSelector = createSelector(
  (state) => state.pDexV3,
  ({ liquidityHistory }) => liquidityHistory,
);

const contribute = createSelector(
  liquidityHistoriesSelector,
  ({ contribute }) => contribute,
);

const isFetchingContribute = createSelector(
  contribute,
  ({ isFetching }) => isFetching,
);

const contributePureData = createSelector(
  contribute,
  ({ histories }) => histories,
);

const mapContributeData = createSelector(
  contributePureData,
  selectedPrivacy.getPrivacyDataByTokenID,
  (histories, getPrivacyDataByTokenID) => {
    const _histories = (histories || []).map((history) => {
      const returnValue = (history.returnTokens || []).map((tokenId, index) => {
        const token = getPrivacyDataByTokenID(tokenId);
        const returnAmount = history.returnAmount[index];
        const returnAmountStr = format.amountFull(returnAmount, token.pDecimals, true);
        const returnAmountSymbolStr = `${returnAmountStr} ${token.symbol}`;
        return {
          token,
          returnAmount,
          returnAmountStr,
          returnAmountSymbolStr,
        };
      });
      const contributes = (history['contributeTokens'] || []).map((tokenId, index) => {
        const token = getPrivacyDataByTokenID(tokenId);
        const contributeAmount = history['contributeAmount'][index];
        const requestTx = history['requestTxs'][index];
        const contributeAmountStr = format.amountFull(contributeAmount, token.pDecimals, true);
        const contributeAmountSymbolStr = `${contributeAmountStr} ${token.symbol}`;
        return {
          token,
          contributeAmount,
          contributeAmountStr,
          contributeAmountSymbolStr,
          requestTx,
        };
      });
      const key = (history.requestTxs || []).join('-');
      const timeStr = format.formatDateTime(history.requestTime);
      const contributeAmountDesc = contributes.map(item => item.contributeAmountSymbolStr).join(' + ');

      const storageValue = (history['storageContribute'] || []).map((item) => {
        const token = getPrivacyDataByTokenID(item.tokenId);
        const contributeAmount = item['contributeAmount'];
        const requestTx = item['requestTx'];
        const contributeAmountStr = format.amountFull(contributeAmount, token.pDecimals, true);
        const contributeAmountSymbolStr = `${contributeAmountStr} ${token.symbol}`;
        return {
          token,
          contributeAmount,
          contributeAmountStr,
          contributeAmountSymbolStr,
          requestTx,
        };
      });

      const { refund, retry, nftid: nftId, pairHash } = history;
      let refundData;
      let retryData;
      if (!isEmpty(refund) && refund.amp) {
        const { tokenId, amount, amp } = refund;
        const token = getPrivacyDataByTokenID(tokenId);
        refundData = {
          tokenId,
          amount,
          token,
          title: 'Refund',
          pairHash,
          nftId,
          amp,
          poolId: history.poolId,
        };
      }

      if (!isEmpty(retry) && retry.amp) {
        const { tokenId, amount, amp } = retry;
        const token = getPrivacyDataByTokenID(tokenId);
        retryData = {
          tokenId,
          amount,
          token,
          title: 'Refund',
          pairHash,
          nftId,
          amp,
          poolId: history.poolId,
        };
      }

      return {
        ...history,
        key,
        contributes,
        returnValue,
        timeStr,
        contributeAmountDesc,
        storageValue,
        retryData,
        refundData,
      };
    });
    return _histories;
  },
);

const removeLP = createSelector(
  liquidityHistoriesSelector,
  ({ removeLP }) => removeLP,
);

const isFetchingRemoveLP = createSelector(
  removeLP,
  ({ isFetching }) => isFetching,
);

const removeLPPureData = createSelector(
  removeLP,
  ({ histories }) => histories,
);

const mapRemoveLPData = createSelector(
  removeLPPureData,
  selectedPrivacy.getPrivacyDataByTokenID,
  (histories, getPrivacyDataByTokenID) => {
    const _histories = histories.map(history => {
      const { requestTime, tokenId1, tokenId2, amount1, amount2 } = history;
      const timeStr = format.formatDateTime(requestTime);
      const tokenIds = [tokenId1, tokenId2];
      const amounts = [amount1, amount2];
      const removeData = tokenIds.map((tokenId, index) => {
        const token = getPrivacyDataByTokenID(tokenId);
        const removeAmount = amounts[index] || 0;
        const removeAmountStr = format.amountFull(removeAmount, token.pDecimals, true);
        const removeAmountSymbolStr = `${removeAmountStr} ${token.symbol}`;
        return {
          token,
          removeAmount,
          removeAmountStr,
          removeAmountSymbolStr,
        };
      });
      const removeLPAmountDesc = removeData.map(item => item.removeAmountSymbolStr).join(' + ');
      return {
        ...history,
        timeStr,
        removeData,
        removeLPAmountDesc,
      };
    });
    return _histories;
  },
);

const withdrawFeeLP = createSelector(
  liquidityHistoriesSelector,
  ({ withdrawFeeLP }) => withdrawFeeLP,
);

const isFetchingWithdrawFeeLP = createSelector(
  withdrawFeeLP,
  ({ isFetching }) => isFetching,
);

const withdrawFeeLPPureData = createSelector(
  withdrawFeeLP,
  ({ histories }) => histories,
);

const mapWithdrawFeeLPData = createSelector(
  withdrawFeeLPPureData,
  selectedPrivacy.getPrivacyDataByTokenID,
  (histories, getPrivacyDataByTokenID) => {
    const _histories = histories.map(history => {
      const { requestTime, tokenId1, tokenId2, amount1, amount2 } = history;
      const timeStr = format.formatDateTime(requestTime);
      const tokenIds = [tokenId1, tokenId2];
      const amounts = [amount1, amount2];
      const withdrawData = tokenIds.map((tokenId, index) => {
        const token = getPrivacyDataByTokenID(tokenId);
        const withdrawAmount = amounts[index] || 0;
        const withdrawAmountStr = format.amountFull(withdrawAmount, token.pDecimals, true);
        const withdrawAmountSymbolStr = `${withdrawAmountStr} ${token.symbol}`;
        return {
          token,
          withdrawAmount,
          withdrawAmountStr,
          withdrawAmountSymbolStr,
        };
      });
      const withdrawLPAmountDesc = withdrawData.map(item => item.withdrawAmountSymbolStr).join(' + ');
      return {
        ...history,
        timeStr,
        withdrawData,
        withdrawLPAmountDesc,
      };
    });
    return _histories;
  },
);

const isFetching = createSelector(
  isFetchingContribute,
  isFetchingRemoveLP,
  isFetchingWithdrawFeeLP,
  (fetchingContribute, fetchingRemoveLP, fetchingWithdrawFeeLP) => (fetchingContribute || fetchingRemoveLP || fetchingWithdrawFeeLP),
);

const showHistorySelector = createSelector(
  contributePureData,
  removeLPPureData,
  withdrawFeeLPPureData,
  (contribute, removeLP, withdrawFeeLP) => !isEmpty(contribute) || !isEmpty(removeLP) || !isEmpty(withdrawFeeLP)
);

export default ({
  contribute,
  isFetchingContribute,
  contributePureData,
  mapContributeData,

  isFetchingRemoveLP,
  removeLPPureData,
  mapRemoveLPData,

  isFetchingWithdrawFeeLP,
  withdrawFeeLPPureData,
  mapWithdrawFeeLPData,

  isFetching,
  showHistorySelector
});

import { PRV } from '@src/constants/common';
import { sharedSelector } from '@src/redux/selectors';
import { ACCOUNT_CONSTANT } from 'incognito-chain-web-js/build/wallet';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import { COLORS } from '@src/styles';
import convert from '@src/utils/convert';
import format from '@src/utils/format';
import floor from 'lodash/floor';
import { formValueSelector, isValid } from 'redux-form';
import isEmpty from 'lodash/isEmpty';
import { createSelector } from 'reselect';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { getExchangeRate, getPairRate } from '@screens/PDexV3';
import { getDataByPoolIdSelector } from '@screens/PDexV3/features/Pools';
import { activedTabSelector } from '@src/components/core/Tabs/Tabs.selector';
import { nftTokenDataSelector } from '@src/redux/selectors/account';
import BigNumber from 'bignumber.js';
import isEqual from 'lodash/isEqual';
import {
  formConfigs,
  ROOT_TAB_ORDER_LIMIT,
  TAB_BUY_ID,
  TAB_SELL_ID,
} from './OrderLimit.constant';
import {
  calDefaultPairOrderLimit,
  getInputAmount as getInputTokenAmount,
} from './OrderLimit.utils';

const BTN_WITHDRAW_ORDER = {
  [ACCOUNT_CONSTANT.TX_STATUS.PROCESSING]: 'ing',
  [ACCOUNT_CONSTANT.TX_STATUS.TXSTATUS_PENDING]: 'ing',
  [ACCOUNT_CONSTANT.TX_STATUS.TXSTATUS_SUCCESS]: 'ed',
};

export const orderLimitSelector = createSelector(
  (state) => state.pDexV3.orderLimit,
  (orderLimit) => orderLimit,
);

export const poolIdSelector = createSelector(
  orderLimitSelector,
  ({ poolId }) => poolId,
);

export const poolSelectedDataSelector = createSelector(
  orderLimitSelector,
  getDataByPoolIdSelector,
  ({ poolId }, getDataByPoolId) => {
    try {
      return getDataByPoolId(poolId);
    } catch (error) {
      console.log('poolSelectedDataSelector-error', error);
    }
  },
);

// group inputs

// fee

export const inpuTokenSelector = createSelector(
  getPrivacyDataByTokenIDSelector,
  orderLimitSelector,
  (getPrivacyDataByTokenID, orderLimit) => (field) => {
    try {
      const tokenId = orderLimit[field];
      if (!tokenId) {
        return {};
      }
      const token = getPrivacyDataByTokenID(orderLimit[field]);
      return token;
    } catch (error) {
      console.log('inpuTokenSelector-error', error);
    }
  },
);

export const selltokenSelector = createSelector(
  inpuTokenSelector,
  (getInputToken) => getInputToken(formConfigs.selltoken),
);

export const buytokenSelector = createSelector(
  inpuTokenSelector,
  (getInputToken) => getInputToken(formConfigs.buytoken),
);

export const feeSelectedSelector = createSelector(
  orderLimitSelector,
  ({ feetoken }) => feetoken || '',
);

export const feetokenDataSelector = createSelector(
  (state) => state,
  orderLimitSelector,
  feeSelectedSelector,
  getPrivacyDataByTokenIDSelector,
  (state, { data }, feetoken, getPrivacyDataByTokenID) => {
    try {
      const feeTokenData: SelectedPrivacy = getPrivacyDataByTokenID(feetoken);
      const selector = formValueSelector(formConfigs.formName);
      const fee = selector(state, formConfigs.feetoken);
      const { fee: minFeeOriginal = 0 } = data;
      const feeAmount = convert.toNumber(fee, true) || 0;
      const feeAmountText = fee;
      const origininalFeeAmount = convert.toOriginalAmount(
        feeAmount,
        feeTokenData?.pDecimals,
        false,
      );
      const minFeeAmount = convert.toHumanAmount(
        minFeeOriginal,
        feeTokenData?.pDecimals,
      );
      const minFeeAmountText = format.toFixed(
        minFeeAmount,
        feeTokenData?.pDecimals,
      );
      const minFeeAmountStr = `${minFeeAmountText} ${feeTokenData?.symbol}`;
      return {
        feetoken,
        symbol: feeTokenData?.symbol,
        pDecimals: feeTokenData?.pDecimals,

        feeAmount,
        feeAmountText,
        origininalFeeAmount,

        minFeeOriginal,
        minFeeAmount,
        minFeeAmountStr,
        minFeeAmountText,
      };
    } catch (error) {
      console.log('feetokenDataSelector-error', error);
    }
  },
);

export const feeTypesSelector = createSelector(
  selltokenSelector,
  feeSelectedSelector,
  (selltoken: SelectedPrivacy, feetoken) => {
    let types = [
      {
        tokenId: PRV.id,
        symbol: PRV.symbol,
        actived: feetoken == PRV.id,
      },
    ];
    if (selltoken?.tokenId && !selltoken.isMainCrypto) {
      types.push({
        tokenId: selltoken.tokenId,
        symbol: selltoken.symbol,
        actived: feetoken == selltoken.tokenId,
      });
    }
    return types;
  },
);

export const inputAmountSelector = createSelector(
  (state) => state,
  feetokenDataSelector,
  orderLimitSelector,
  sharedSelector.isGettingBalance,
  getPrivacyDataByTokenIDSelector,
  poolSelectedDataSelector,
  getInputTokenAmount,
);

export const rateDataSelector = createSelector(
  (state) => state,
  inputAmountSelector,
  poolSelectedDataSelector,
  (state, getInputAmount, pool) => {
    let rate = '';
    let rateStr = '';
    let customRate = '';
    let defaultRate = {};
    let rateToken = {};
    try {
      const sellInputAmount = getInputAmount(formConfigs.selltoken);
      const buyInputAmount = getInputAmount(formConfigs.buytoken);
      if (isEmpty(sellInputAmount) || isEmpty(buyInputAmount)) {
        return {
          rate,
          rateStr,
          customRate,
        };
      }
      rateToken = pool?.token2;
      defaultRate = calDefaultPairOrderLimit({
        pool,
        x: pool?.token1,
        y: pool?.token2,
        x0: convert.toOriginalAmount(1, pool?.token1?.pDecimals, true),
      }).rate;
      const selector = formValueSelector(formConfigs.formName);
      customRate = selector(state, formConfigs.rate);
      customRate = customRate || defaultRate;
      rateStr = format.amountFull(defaultRate, 0, false);
    } catch (error) {
      console.log('rateSelector-error', error);
    }
    return {
      rate,
      rateStr,
      customRate,
      defaultRate,
      rateToken,
    };
  },
);

export const orderLimitDataSelector = createSelector(
  (state) => state,
  orderLimitSelector,
  activedTabSelector,
  getPrivacyDataByTokenIDSelector,
  inputAmountSelector,
  feetokenDataSelector,
  rateDataSelector,
  poolSelectedDataSelector,
  nftTokenDataSelector,
  (
    state,
    { networkfee, initing, percent, ordering },
    getActivedTab,
    getPrivacyDataByTokenID,
    getInputAmount,
    feeTokenData,
    rateData,
    pool,
    { nftTokenAvailable },
  ) => {
    const sellInputAmount = getInputAmount(formConfigs.selltoken);
    const buyInputAmount = getInputAmount(formConfigs.buytoken);
    const activedTab = getActivedTab(ROOT_TAB_ORDER_LIMIT);
    let btnActionTitle;
    const buyColor = COLORS.green;
    const sellColor = COLORS.red;
    let reviewOrderTitle = '';
    let mainColor;
    let reviewOrderDesc = '';
    let reviewOrderDescValue = '';
    let cfmTitle = '';
    switch (activedTab) {
    case TAB_SELL_ID: {
      mainColor = sellColor;
      btnActionTitle = `Sell ${sellInputAmount?.symbol}`;
      reviewOrderTitle = `Sell ${sellInputAmount?.amountText} ${sellInputAmount?.symbol}`;
      reviewOrderDesc = 'Receive';
      reviewOrderDescValue = `${buyInputAmount?.amountText} ${buyInputAmount?.symbol}`;
      cfmTitle = `You placed an order to sell ${sellInputAmount?.amountText} ${sellInputAmount?.symbol} for ${reviewOrderDescValue}`;
      break;
    }
    case TAB_BUY_ID: {
      mainColor = buyColor;
      btnActionTitle = `Buy ${buyInputAmount?.symbol}`;
      reviewOrderTitle = `Buy ${buyInputAmount?.amountText} ${buyInputAmount?.symbol}`;
      reviewOrderDesc = 'Pay with';
      reviewOrderDescValue = `${sellInputAmount?.amountText} ${sellInputAmount?.symbol}`;
      cfmTitle = `You placed an order to buy ${buyInputAmount?.amountText} ${buyInputAmount?.symbol} for ${reviewOrderDescValue}`;
      break;
    }
    default:
      break;
    }
    const token1: SelectedPrivacy = pool?.token1;
    const token2: SelectedPrivacy = pool?.token2;
    const networkfeeAmount = format.toFixed(
      convert.toHumanAmount(networkfee, PRV.pDecimals),
      PRV.pDecimals,
    );
    const networkfeeAmountStr = `${networkfeeAmount} ${PRV.symbol}`;
    const prv: SelectedPrivacy = getPrivacyDataByTokenID(PRV.id);
    const showPRVBalance =
      !sellInputAmount?.isMainCrypto && !buyInputAmount.isMainCrypto;
    const prvBalance = format.amountFull(prv.amount, PRV.pDecimals, false);
    const prvBalanceStr = `${prvBalance} ${PRV.symbol}`;
    const balanceStr = `${sellInputAmount?.balanceStr} ${sellInputAmount?.symbol}`;
    const poolSizeStr = `${sellInputAmount?.poolValueStr} ${sellInputAmount?.symbol} + ${buyInputAmount?.poolValueStr} ${buyInputAmount?.symbol}`;
    const editableInput = !initing;
    const calculating = initing;
    const disabledBtn =
      calculating ||
      !isValid(formConfigs.formName)(state) ||
      !nftTokenAvailable;
    if (!nftTokenAvailable) {
      btnActionTitle = 'Not enough NFT token';
    }
    if (calculating) {
      btnActionTitle = 'Calculating...';
    }
    const tradingFeeStr = `${feeTokenData?.feeAmountText} ${feeTokenData?.symbol}`;
    const rateStr = `1 ${sellInputAmount?.symbol} = ${format.amountFull(
      rateData.customRate,
      0,
      false,
    )} ${buyInputAmount?.symbol}`;
    const refreshing = initing;
    const poolStr = `${token1?.symbol || ''} / ${token2?.symbol || ''}`;
    const priceChange24h = pool?.priceChange24h || 0;
    let colorPriceChange24h = COLORS.green;
    if (priceChange24h < 0) {
      colorPriceChange24h = COLORS.red;
    }
    return {
      mainColor,
      buyColor,
      sellColor,
      btnActionTitle,
      activedTab,
      editableInput,
      networkfeeAmount,
      networkfeeAmountStr,
      networkfee,
      showPRVBalance,
      prvBalance,
      prvBalanceStr,
      balanceStr,
      poolSizeStr,
      disabledBtn,
      percent,
      tradingFeeStr,
      rateStr,
      reviewOrderTitle,
      reviewOrderDesc,
      reviewOrderDescValue,
      cfmTitle,
      poolTitle: pool?.poolTitle || '',
      poolId: pool?.poolId,
      ordering,
      refreshing,
      sellTokenId: sellInputAmount?.tokenId,
      buyTokenId: buyInputAmount?.tokenId,
      poolStr,
      priceChange24hStr: `${priceChange24h}%`,
      colorPriceChange24h,
      calculating,
    };
  },
);

// history

export const mappingOrderHistorySelector = createSelector(
  orderLimitSelector,
  poolSelectedDataSelector,
  nftTokenDataSelector,
  getPrivacyDataByTokenIDSelector,
  (
    { withdrawingOrderTxs, withdrawOrderTxs },
    pool,
    { nftTokenAvailable },
    getPrivacyDataByTokenID,
  ) => (order) => {
    try {
      if (!order) {
        return {};
      }
      const token1: SelectedPrivacy = pool?.token1;
      const token2: SelectedPrivacy = pool?.token2;
      let {
        sellTokenId,
        requestime,
        matched,
        amount,
        minAccept: price,
        requestTx,
        isCompleted,
        status,
        statusCode,
        minAccept,
        buyTokenId,
        fromStorage,
      } = order;
      let type,
        mainColor,
        pDecimals,
        infoStr,
        amountStr,
        priceStr,
        sellStr,
        buyStr,
        rateStr,
        buyToken,
        sellToken,
        sellTokenData,
        buyTokenData;
      const sellTokenBalance = new BigNumber(order?.sellTokenBalance);
      const buyTokenBalance = new BigNumber(order?.buyTokenBalance);
      const sellTokenWithdrawed = new BigNumber(order?.sellTokenWithdrawed);
      let statusStr = status;
      let visibleBtnCancel = false;
      let visibleBtnClaim = false;
      const isWithdrawing = statusCode === 3 || status === 'withdrawing';
      if (isCompleted) {
        if (sellTokenWithdrawed.isGreaterThan(0)) {
          statusStr = 'Canceled';
        } else {
          statusStr = 'Claimed';
        }
      } else {
        if (sellTokenBalance.isEqualTo(0) && buyTokenBalance.isGreaterThan(0)) {
          if (isWithdrawing) {
            statusStr = 'Claiming';
          } else {
            statusStr = 'Claim';
            visibleBtnClaim = true;
          }
        } else if (sellTokenBalance.isGreaterThan(0)) {
          if (isWithdrawing) {
            statusStr = 'Canceling';
          } else {
            statusStr = 'Cancel';
            visibleBtnCancel = true;
          }
        }
      }
      const withdrawTx =
        withdrawOrderTxs.find((tx) => isEqual(tx?.requestTx, requestTx)) || {};
      let cancelTx, claimTx;
      if (withdrawTx?.requestTx) {
        switch (withdrawTx?.txType) {
        case ACCOUNT_CONSTANT.TX_TYPE.CANCEL_ORDER_LIMIT:
          cancelTx = withdrawTx;
          break;
        case ACCOUNT_CONSTANT.TX_TYPE.CLAIM_ORDER_LIMIT:
          claimTx = withdrawTx;
          break;
        default:
          break;
        }
      }
      const btnTitleClaim = 'Claim';
      const btnTitleCancel = 'Cancel';
      const { status: cancelTxStatus, withdrawTxId: cancelTxId } =
        cancelTx || {};
      const { status: claimTxStatus, withdrawTxId: claimTxId } = claimTx || {};
      visibleBtnCancel = visibleBtnCancel && !cancelTxId;
      visibleBtnClaim = visibleBtnClaim && !claimTxId;
      let btnCancel = BTN_WITHDRAW_ORDER[cancelTxStatus]
        ? `${btnTitleCancel}${BTN_WITHDRAW_ORDER[cancelTxStatus]}`
        : '';
      let btnClaim = BTN_WITHDRAW_ORDER[claimTxStatus]
        ? `${btnTitleClaim}${BTN_WITHDRAW_ORDER[claimTxStatus]}`
        : '';
      const poolStr = `${token1.symbol} / ${token2.symbol}`;
      if (sellTokenId === token1.tokenId) {
        type = 'sell';
        mainColor = COLORS.red;
        pDecimals = token1.pDecimals;
        amountStr = format.amountFull(amount, pDecimals, false);
        priceStr = format.amountFull(price, token2.pDecimals, false);
        sellStr = `${amountStr} ${token1.symbol}`;
        buyStr = `${priceStr} ${token2.symbol}`;
        infoStr = poolStr;
        sellTokenData = token1;
        buyTokenData = token2;
      } else if (sellTokenId === token2.tokenId) {
        type = 'buy';
        mainColor = COLORS.green;
        pDecimals = token2.pDecimals;
        amountStr = format.amountFull(amount, pDecimals, false);
        priceStr = format.amountFull(price, token1.pDecimals, false);
        buyStr = `${amountStr} ${token2.symbol}`;
        sellStr = `${priceStr} ${token1.symbol}`;
        infoStr = poolStr;
        sellTokenData = token2;
        buyTokenData = token1;
      }
      sellToken = getPrivacyDataByTokenID(sellTokenId);
      buyToken = getPrivacyDataByTokenID(buyTokenId);
      const percent = floor(
        new BigNumber(matched)
          .dividedBy(new BigNumber(amount))
          .multipliedBy(100)
          .toNumber(),
      );
      const percentStr = `Filled ${percent}%`;
      const percentStr1 = `${percent}%`;
      const time = fromStorage ? requestime : requestime * 1000;
      const timeStr = format.formatDateTime(new Date(time).getTime());
      const withdrawing = withdrawingOrderTxs.includes(requestTx);
      const rate = getPairRate({
        token1Value: amount,
        token2Value: minAccept,
        token1: sellToken,
        token2: buyToken,
      });
      rateStr = getExchangeRate(sellToken, buyToken, amount, minAccept);
      const result = {
        ...order,
        type,
        mainColor,
        timeStr,
        percent,
        percentStr,
        infoStr,
        visibleBtnCancel,
        btnClaim,
        visibleBtnClaim,
        btnTitleCancel,
        btnTitleClaim,
        btnCancel,
        withdrawing,
        statusStr,
        nftTokenAvailable,
        poolId: pool?.poolId,
        percentStr1,
        buyStr,
        sellStr,
        rate,
        rateStr,
        networkfeeAmountStr: `${format.amountFull(1, PRV.pDecimals, false)} ${
          PRV.symbol
        }`,
        sellTokenData,
        buyTokenData,
        token1,
        token2,
        priceStr,
        amountStr,
      };
      return result;
    } catch (error) {
      console.log('mappingOrderHistorySelector-error', error);
    }
  },
);

export const orderHistorySelector = createSelector(
  orderLimitSelector,
  poolSelectedDataSelector,
  mappingOrderHistorySelector,
  ({ ordersHistory }, pool, mappingOrderHistory) => {
    let history = [];
    const { isFetching, isFetched, data } = ordersHistory;
    if (data.length === 0 || !data || !pool) {
      return history;
    }
    history = data.map((order) => mappingOrderHistory(order));
    return { history, isFetching, isFetched };
  },
);

export const openOrdersSelector = createSelector(
  orderHistorySelector,
  ({ isFetched, isFetching, history }) => ({
    history: history?.filter(({ isCompleted }) => !isCompleted),
    isFetched,
    isFetching,
  }),
);

export const orderCancelingSelector = createSelector(
  orderLimitSelector,
  ({ orderCanceling }) => orderCanceling || [],
);

export const isOrderCancelingSelector = createSelector(
  orderCancelingSelector,
  (orderCanceling) => (id) => id && orderCanceling?.includes(id),
);

export const orderDetailSelector = createSelector(
  orderLimitSelector,
  mappingOrderHistorySelector,
  ({ orderDetail: { fetching, order } }, mappingOrderHistory) => {
    return {
      fetching,
      order: mappingOrderHistory(order),
    };
  },
);

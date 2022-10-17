/* eslint-disable import/no-cycle */
import { getBalance } from '@src/redux/actions/token';
import { actionGetPDexV3Inst, getPDexV3Instance } from '@screens/PDexV3';
import {
  ACCOUNT_CONSTANT,
  PrivacyVersion,
  EXCHANGE_SUPPORTED,
} from 'incognito-chain-web-js/build/wallet';
import serverService from '@src/services/wallet/Server';
import { defaultAccountWalletSelector } from '@src/redux/selectors/account';
import { ExHandler } from '@src/services/exception';
import routeNames from '@src/router/routeNames';
import { change, reset } from 'redux-form';
import isEmpty from 'lodash/isEmpty';
import Util from '@utils/Util';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { batch } from 'react-redux';
import uniq from 'lodash/uniq';
import { PRV, PRV_ID } from '@src/constants/common';
import convert from '@src/utils/convert';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import floor from 'lodash/floor';
import { currentScreenSelector } from '@screens/Navigation';
import difference from 'lodash/difference';
import { isUsePRVToPayFeeSelector } from '@screens/Setting';
import flatten from 'lodash/flatten';
import orderBy from 'lodash/orderBy';
import { ANALYTICS, CONSTANT_COMMONS, CONSTANT_CONFIGS } from '@src/constants';
import { requestUpdateMetrics } from '@src/redux/actions/app';
import SwapService from '@src/services/api/swap';
import createLogger from '@utils/logger';
// import TokenService from '@src/services/api/tokenService';
// import { pTokenIdsSelector } from '@src/redux/selectors/token';
import {
  getAllPrivacyDataSelector,
  getPrivacyDataFilterSelector,
} from '@src/redux/selectors/selectedPrivacy';
import {
  isUseTokenFeeParser,
  extractEstimateData,
} from './Swap.estimate.helperMethods';

import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_SELL_TOKEN,
  ACTION_SET_BUY_TOKEN,
  ACTION_SET_FEE_TOKEN,
  ACTION_SET_FOCUS_TOKEN,
  formConfigs,
  ACTION_SET_SELECTING_TOKEN,
  ACTION_SET_SWAPING_TOKEN,
  ACTION_SET_INITIING_SWAP,
  ACTION_RESET,
  ACTION_SET_PERCENT,
  ACTION_FETCH_SWAP,
  ACTION_FETCHED_LIST_PAIRS,
  ACTION_FETCHING_ORDERS_HISTORY,
  ACTION_FETCHED_ORDERS_HISTORY,
  ACTION_FETCH_FAIL_ORDERS_HISTORY,
  ACTION_FETCHING_ORDER_DETAIL,
  ACTION_FETCHED_ORDER_DETAIL,
  ACTION_SET_DEFAULT_PAIR,
  ACTION_TOGGLE_PRO_TAB,
  ACTION_CHANGE_SELECTED_PLATFORM,
  KEYS_PLATFORMS_SUPPORTED,
  ACTION_SAVE_LAST_FIELD,
  ACTION_CHANGE_ESTIMATE_DATA,
  ACTION_SET_DEFAULT_EXCHANGE,
  ACTION_FREE_HISTORY_ORDERS,
  ACTION_SET_ERROR,
  ACTION_REMOVE_ERROR,
  ACTION_CHANGE_SLIPPAGE,
  ACTION_FETCHING_REWARD_HISTORY,
  ACTION_FETCHED_REWARD_HISTORY,
  ACTION_FETCH_FAIL_REWARD_HISTORY,
  ACTION_RESET_DATA,
  NETWORK_IDS_MAPPING,
  ACTION_SET_BEST_RATE_EXCHANGE,
  ACTION_SET_EXCHANGE_SUPPORT_LIST,
} from './Swap.constant';
import {
  buytokenSelector,
  feeSelectedSelector,
  feetokenDataSelector,
  inputAmountSelector,
  selltokenSelector,
  orderDetailSelector,
  swapInfoSelector,
  slippagetoleranceSelector,
  swapSelector,
  defaultPairSelector,
  sellInputTokenSelector,
  findTokenPancakeByIdSelector,
  findTokenCurveByIdSelector,
  findTokenUniByIdSelector,
  hashmapContractIDsSelector,
  platformSelectedSelector,
  isPairSupportedTradeOnPancakeSelector,
  isPairSupportedTradeOnUniSelector,
  isPairSupportedTradeOnCurveSelector,
  defaultExchangeSelector,
  isPrivacyAppSelector,
  isExchangeVisibleSelector,
  errorEstimateTradeSelector,
  listPairsIDVerifiedSelector,
  listPairsIDBuyTokenVerifiedSelector,
  findTokenSpookyByIdSelector,
} from './Swap.selector';
import {
  calMintAmountExpected,
  getBestRateFromPancake,
  findBestRateOfMaxBuyAmount,
  findBestRateOfMinSellAmount,
} from './Swap.utils';
import {
  PANCAKE_SUPPORT_NETWORK,
  UNISWAP_SUPPORT_NETWORK,
  CURVE_SUPPORT_NETWORK,
  SPOOKY_SUPPORT_NETWORK,
} from './Swap.types';

// const logger = createLogger('LOG');

export const actionSetBestRateExchange = (payload) => ({
  type: ACTION_SET_BEST_RATE_EXCHANGE,
  payload,
});

export const actionSetExchangeSupportList = (payload) => ({
  type: ACTION_SET_EXCHANGE_SUPPORT_LIST,
  payload,
});

export const actionChangeSlippage = (payload) => ({
  type: ACTION_CHANGE_SLIPPAGE,
  payload,
});

export const actionSetError = (payload) => ({
  type: ACTION_SET_ERROR,
  payload,
});

export const actionRemoveError = () => ({
  type: ACTION_REMOVE_ERROR,
});

export const actionSetDefaultExchange = ({ isPrivacyApp, exchange }) => ({
  type: ACTION_SET_DEFAULT_EXCHANGE,
  payload: {
    isPrivacyApp,
    exchange,
  },
});

export const actionChangeEstimateData = (payload) => ({
  type: ACTION_CHANGE_ESTIMATE_DATA,
  payload,
});

export const actionSaveLastField = (field) => ({
  type: ACTION_SAVE_LAST_FIELD,
  payload: field,
});

export const actionToggleProTab = (payload) => ({
  type: ACTION_TOGGLE_PRO_TAB,
  payload,
});

export const actionSetPercent = (payload) => ({
  type: ACTION_SET_PERCENT,
  payload,
});

export const actionSetSellTokenFetched = (payload) => ({
  type: ACTION_SET_SELL_TOKEN,
  payload,
});

export const actionSetBuyTokenFetched = (payload) => ({
  type: ACTION_SET_BUY_TOKEN,
  payload,
});

export const actionSetFeeToken = (payload) => ({
  type: ACTION_SET_FEE_TOKEN,
  payload,
});

export const actionSetFocusToken = (payload) => ({
  type: ACTION_SET_FOCUS_TOKEN,
  payload,
});

export const actionFetching = (payload) => ({
  type: ACTION_FETCHING,
  payload,
});

export const actionFetched = (payload) => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionReset = (payload) => ({
  type: ACTION_RESET,
  payload,
});

export const actionResetData = (payload) => ({
  type: ACTION_RESET_DATA,
  payload,
});

export const actionEstimateTradeForMax = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const feeTokenData = feetokenDataSelector(state);
    const {
      payFeeByPRV,
      minFeeOriginalPRV,
      minFeePRVFixed,
      availableFixedSellAmountPRV,
      minFeeTokenFixed,
      availableFixedSellAmountToken,
    } = feeTokenData;
    const { tokenId: selltoken, isMainCrypto: sellTokenIsPRV } =
      sellInputTokenSelector(state);
    if (sellTokenIsPRV) {
      batch(() => {
        dispatch(
          change(
            formConfigs.formName,
            formConfigs.selltoken,
            availableFixedSellAmountPRV,
          ),
        );
        dispatch(
          change(formConfigs.formName, formConfigs.feetoken, minFeePRVFixed),
        );
      });
    } else {
      // sellTokenIsToken
      const prvBalance = await dispatch(getBalance(PRV.id));
      let availableOriginalPRVAmount = new BigNumber(prvBalance).minus(
        minFeeOriginalPRV,
      );
      const canPayFeeByPRV =
        minFeeOriginalPRV && availableOriginalPRVAmount.gt(0);
      if (canPayFeeByPRV && payFeeByPRV) {
        batch(() => {
          dispatch(
            change(
              formConfigs.formName,
              formConfigs.selltoken,
              availableFixedSellAmountPRV,
            ),
          );
          dispatch(
            change(formConfigs.formName, formConfigs.feetoken, minFeePRVFixed),
          );
        });
      } else {
        batch(() => {
          dispatch(
            change(
              formConfigs.formName,
              formConfigs.selltoken,
              availableFixedSellAmountToken,
            ),
          );
          dispatch(
            change(
              formConfigs.formName,
              formConfigs.feetoken,
              minFeeTokenFixed,
            ),
          );
          dispatch(actionSetFeeToken(selltoken));
        });
      }
    }
  } catch (error) {
    throw error;
  }
};

export const actionHandleInjectEstDataForPDex =
  () => async (dispatch, getState) => {
    try {
      const state = getState();
      const inputAmount = inputAmountSelector(state);
      let sellInputToken, buyInputToken, inputToken, inputPDecimals;
      sellInputToken = inputAmount(formConfigs.selltoken);
      buyInputToken = inputAmount(formConfigs.buytoken);
      const { tokenId: selltoken, pDecimals: sellPDecimals } = sellInputToken;
      const { pDecimals: buyPDecimals } = buyInputToken;
      const feeTokenData = feetokenDataSelector(state);
      const {
        minFeeAmountFixed,
        canNotPayFeeByPRV,
        minFeeTokenFixed,
        payFeeByPRV,
        feePrvEst,
        feeTokenEst,
        field,
        useMax,
      } = feeTokenData;
      let maxGet = 0;
      switch (field) {
        case formConfigs.selltoken: {
          if (payFeeByPRV) {
            maxGet = feePrvEst?.maxGet || 0;
          } else {
            maxGet = feeTokenEst?.maxGet || 0;
          }
          inputPDecimals = buyPDecimals;
          inputToken = formConfigs.buytoken;
          break;
        }
        case formConfigs.buytoken: {
          if (payFeeByPRV) {
            maxGet = feePrvEst?.sellAmount || 0;
          } else {
            maxGet = feeTokenEst?.sellAmount || 0;
          }
          inputPDecimals = sellPDecimals;
          inputToken = formConfigs.selltoken;
          break;
        }
        default:
          break;
      }
      const slippagetolerance = slippagetoleranceSelector(state);
      const originalMinAmountExpected =
        field === formConfigs.buytoken
          ? maxGet
          : calMintAmountExpected({
              maxGet,
              slippagetolerance,
            });

      const minAmountExpectedToHumanAmount = convert.toHumanAmount(
        originalMinAmountExpected,
        inputPDecimals,
      );

      const minAmountExpectedToFixed = format.toFixed(
        minAmountExpectedToHumanAmount,
        inputPDecimals,
      );

      // dispatch(
      //   change(formConfigs.formName, inputToken, minAmountExpectedToFixed)
      // );

      dispatch(
        change(
          formConfigs.formName,
          inputToken,
          maxGet ? maxGet.toString() : '',
        ),
      );

      if (useMax) {
        await dispatch(actionEstimateTradeForMax({}));
      } else {
        batch(() => {
          if (canNotPayFeeByPRV) {
            batch(() => {
              dispatch(actionSetFeeToken(selltoken));
              dispatch(
                change(
                  formConfigs.formName,
                  formConfigs.feetoken,
                  minFeeTokenFixed,
                ),
              );
            });
          } else {
            dispatch(
              change(
                formConfigs.formName,
                formConfigs.feetoken,
                minFeeAmountFixed,
              ),
            );
          }
        });
      }
    } catch (error) {
      throw error;
    }
  };

export const actionEstimateTradeForPDex =
  (payload) => async (dispatch, getState) => {
    let minSellOriginalAmount = 0;
    let maxBuyOriginalAmount = 0;
    let state = getState();
    const isExchangeVisible = isExchangeVisibleSelector(state)(
      KEYS_PLATFORMS_SUPPORTED.incognito,
    );

    if (!isExchangeVisible) {
      return {
        minSellOriginalAmount,
        maxBuyOriginalAmount,
      };
    }
    const { payFeeByPRV, field } = feetokenDataSelector(state);
    try {
      const { sellamount, buyamount } = payload;
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      const estPDexData = await pDexV3Inst.getEstimateTrade(payload);
      const { feePrv: feePrvEst, feeToken: feeTokenEst } = estPDexData;
      let maxGet = 0;
      switch (field) {
        case formConfigs.selltoken: {
          if (payFeeByPRV) {
            maxGet = feePrvEst?.maxGet || 0;
          } else {
            maxGet = feeTokenEst?.maxGet || 0;
          }
          minSellOriginalAmount = sellamount;
          maxBuyOriginalAmount = maxGet;
          break;
        }
        case formConfigs.buytoken: {
          if (payFeeByPRV) {
            maxGet = feePrvEst?.sellAmount || 0;
          } else {
            maxGet = feeTokenEst?.sellAmount || 0;
          }
          minSellOriginalAmount = maxGet;
          maxBuyOriginalAmount = buyamount;
          break;
        }
        default:
          break;
      }

      await dispatch(
        actionChangeEstimateData({
          [KEYS_PLATFORMS_SUPPORTED.incognito]: {
            ...estPDexData,
            error: null,
          },
        }),
      );
    } catch (error) {
      console.log('actionEstimateTradeForPDex ERROR', error);
      state = getState();

      dispatch(
        actionSetError({
          error,
          platformId: KEYS_PLATFORMS_SUPPORTED.incognito,
        }),
      );
    }

    return {
      minSellOriginalAmount,
      maxBuyOriginalAmount,
    };
  };

export const setDefaultTradingPlatformOnPdexV3 =
  () => async (dispatch, getState) => {
    const state = getState();
    const isPairSupportedTradeOnPancake =
      isPairSupportedTradeOnPancakeSelector(state);
    const isPairSupportedTradeOnUni = isPairSupportedTradeOnUniSelector(state);
    const isPairSupportedTradeOnCurve =
      isPairSupportedTradeOnCurveSelector(state);
    if (isPairSupportedTradeOnPancake) {
      dispatch(actionChangeSelectedPlatform(KEYS_PLATFORMS_SUPPORTED.pancake));
    } else if (isPairSupportedTradeOnUni) {
      dispatch(actionChangeSelectedPlatform(KEYS_PLATFORMS_SUPPORTED.uni));
    } else if (isPairSupportedTradeOnCurve) {
      dispatch(actionChangeSelectedPlatform(KEYS_PLATFORMS_SUPPORTED.curve));
    } else {
      dispatch(
        actionChangeSelectedPlatform(KEYS_PLATFORMS_SUPPORTED.incognito),
      );
    }
  };

export const actionHandleInjectEstDataForCurve =
  () => async (dispatch, getState) => {
    try {
      // await dispatch(actionSetFeeToken(PRV.id));
      const state = getState();
      let feeData = feetokenDataSelector(state);
      const isUseTokenFee = feeData?.curve?.isUseTokenFee;
      const inputAmount = inputAmountSelector(state);
      let sellInputToken, buyInputToken, inputToken, inputPDecimals;
      sellInputToken = inputAmount(formConfigs.selltoken);
      buyInputToken = inputAmount(formConfigs.buytoken);
      const { tokenId: selltoken } = sellInputToken;
      const { tokenId: buytoken } = buyInputToken;
      const { field, useMax } = feetokenDataSelector(state);
      const getCurveTokenParamReq = findTokenCurveByIdSelector(state);
      const tokenSellCurve = getCurveTokenParamReq(selltoken);
      const tokenBuyCurve = getCurveTokenParamReq(buytoken);
      if (tokenSellCurve == null || tokenBuyCurve == null) {
        throw 'This pair is not existed on curve';
      }

      if (isUseTokenFee) {
        await dispatch(actionSetFeeToken(selltoken));
      } else {
        await dispatch(actionSetFeeToken(PRV.id));
      }

      switch (field) {
        case formConfigs.selltoken: {
          inputPDecimals = tokenBuyCurve.pDecimals;
          inputToken = formConfigs.buytoken;
          break;
        }
        case formConfigs.buytoken: {
          inputPDecimals = tokenSellCurve.pDecimals;
          inputToken = formConfigs.selltoken;
          break;
        }
        default:
          break;
      }
      const {
        maxGet,
        minFeePRVFixed,
        availableFixedSellAmountPRV,
        minFeeTokenFixed,
      } = feetokenDataSelector(state);
      const slippagetolerance = slippagetoleranceSelector(state);
      const originalMinAmountExpected =
        field === formConfigs.buytoken
          ? maxGet
          : calMintAmountExpected({
              maxGet,
              slippagetolerance,
            });
      const minAmountExpectedToHumanAmount = convert.toHumanAmount(
        originalMinAmountExpected,
        inputPDecimals,
      );
      const minAmountExpectedToFixed = format.toFixed(
        minAmountExpectedToHumanAmount,
        inputPDecimals,
      );

      batch(() => {
        if (useMax) {
          dispatch(
            change(
              formConfigs.formName,
              formConfigs.selltoken,
              availableFixedSellAmountPRV,
            ),
          );
        }
        // dispatch(
        //   change(formConfigs.formName, inputToken, minAmountExpectedToFixed)
        // );

        dispatch(
          change(
            formConfigs.formName,
            inputToken,
            maxGet ? maxGet.toString() : '',
          ),
        );

        dispatch(
          change(
            formConfigs.formName,
            formConfigs.feetoken,
            isUseTokenFee ? minFeeTokenFixed : minFeePRVFixed,
          ),
        );
      });
    } catch (error) {
      throw error;
    }
  };

export const actionHandleInjectEstDataForUni =
  () => async (dispatch, getState) => {
    try {
      // await dispatch(actionSetFeeToken(PRV.id));
      const state = getState();
      let feeData = feetokenDataSelector(state);
      const isUseTokenFee = feeData?.uni?.isUseTokenFee;
      const inputAmount = inputAmountSelector(state);
      let sellInputToken, buyInputToken, inputToken, inputPDecimals;
      sellInputToken = inputAmount(formConfigs.selltoken);
      buyInputToken = inputAmount(formConfigs.buytoken);
      const { tokenId: selltoken } = sellInputToken;
      const { tokenId: buytoken } = buyInputToken;
      const { field, useMax } = feeData;
      const getUniTokenParamReq = findTokenUniByIdSelector(state);
      const tokenSellUni = getUniTokenParamReq(selltoken);
      const tokenBuyUni = getUniTokenParamReq(buytoken);

      if (tokenSellUni == null || tokenBuyUni == null) {
        throw 'This pair is not existed on uni';
      }
      if (isUseTokenFee) {
        await dispatch(actionSetFeeToken(selltoken));
      } else {
        await dispatch(actionSetFeeToken(PRV.id));
      }
      switch (field) {
        case formConfigs.selltoken: {
          inputPDecimals = tokenBuyUni.pDecimals;
          inputToken = formConfigs.buytoken;
          break;
        }
        case formConfigs.buytoken: {
          inputPDecimals = tokenSellUni.pDecimals;
          inputToken = formConfigs.selltoken;
          break;
        }
        default:
          break;
      }
      const {
        maxGet,
        minFeePRVFixed,
        availableFixedSellAmountPRV,
        minFeeTokenFixed,
      } = feetokenDataSelector(state);
      const slippagetolerance = slippagetoleranceSelector(state);

      const originalMinAmountExpected =
        field === formConfigs.buytoken
          ? maxGet
          : calMintAmountExpected({
              maxGet,
              slippagetolerance,
            });

      const minAmountExpectedToHumanAmount = convert.toHumanAmount(
        originalMinAmountExpected,
        inputPDecimals,
      );

      const minAmountExpectedToFixed = format.toFixed(
        minAmountExpectedToHumanAmount,
        inputPDecimals,
      );

      batch(() => {
        if (useMax) {
          dispatch(
            change(
              formConfigs.formName,
              formConfigs.selltoken,
              availableFixedSellAmountPRV,
            ),
          );
        }
        // dispatch(
        //   change(formConfigs.formName, inputToken, minAmountExpectedToFixed)
        // );
        dispatch(
          change(
            formConfigs.formName,
            inputToken,
            maxGet ? maxGet.toString() : '',
          ),
        );
        dispatch(
          change(
            formConfigs.formName,
            formConfigs.feetoken,
            isUseTokenFee ? minFeeTokenFixed : minFeePRVFixed,
          ),
        );
      });
    } catch (error) {
      throw error;
    }
  };

export const actionHandleInjectEstDataForPancake =
  () => async (dispatch, getState) => {
    try {
      const state = getState();
      let feeData = feetokenDataSelector(state);
      const isUseTokenFee = feeData?.pancake?.isUseTokenFee;
      const inputAmount = inputAmountSelector(state);
      let sellInputToken, buyInputToken, inputToken, inputPDecimals;
      sellInputToken = inputAmount(formConfigs.selltoken);
      buyInputToken = inputAmount(formConfigs.buytoken);
      const { tokenId: selltoken } = sellInputToken;
      const { tokenId: buytoken } = buyInputToken;
      if (isUseTokenFee) {
        await dispatch(actionSetFeeToken(selltoken));
      } else {
        await dispatch(actionSetFeeToken(PRV.id));
      }
      const { field, useMax } = feeData;
      const getPancakeTokenParamReq = findTokenPancakeByIdSelector(state);
      const tokenSellPancake = getPancakeTokenParamReq(selltoken);
      const tokenBuyPancake = getPancakeTokenParamReq(buytoken);
      if (tokenSellPancake == null || tokenBuyPancake == null) {
        throw 'This pair is not existed on pancake';
      }
      switch (field) {
        case formConfigs.selltoken: {
          inputPDecimals = tokenBuyPancake.pDecimals;
          inputToken = formConfigs.buytoken;
          break;
        }
        case formConfigs.buytoken: {
          inputPDecimals = tokenSellPancake.pDecimals;
          inputToken = formConfigs.selltoken;
          break;
        }
        default:
          break;
      }
      const {
        maxGet,
        minFeePRVFixed,
        availableFixedSellAmountPRV,
        minFeeTokenFixed,
      } = feetokenDataSelector(state);
      const slippagetolerance = slippagetoleranceSelector(state);

      const originalMinAmountExpected =
        field === formConfigs.buytoken
          ? maxGet
          : calMintAmountExpected({
              maxGet,
              slippagetolerance,
            });

      const minAmountExpectedToHumanAmount = convert.toHumanAmount(
        originalMinAmountExpected,
        inputPDecimals,
      );

      const minAmountExpectedToFixed = format.toFixed(
        minAmountExpectedToHumanAmount,
        inputPDecimals,
      );

      batch(() => {
        if (useMax) {
          dispatch(
            change(
              formConfigs.formName,
              formConfigs.selltoken,
              availableFixedSellAmountPRV,
            ),
          );
        }
        // dispatch(
        //   change(formConfigs.formName, inputToken, minAmountExpectedToFixed)
        // );
        dispatch(
          change(
            formConfigs.formName,
            inputToken,
            maxGet ? maxGet.toString() : '',
          ),
        );
        dispatch(
          change(
            formConfigs.formName,
            formConfigs.feetoken,
            isUseTokenFee ? minFeeTokenFixed : minFeePRVFixed,
          ),
        );
      });
    } catch (error) {
      throw error;
    }
  };

export const actionHandleInjectEstDataForSpooky =
  () => async (dispatch, getState) => {
    try {
      const state = getState();
      let feeData = feetokenDataSelector(state);
      const isUseTokenFee = feeData?.spooky?.isUseTokenFee;
      const inputAmount = inputAmountSelector(state);
      let sellInputToken, buyInputToken, inputToken, inputPDecimals;
      sellInputToken = inputAmount(formConfigs.selltoken);
      buyInputToken = inputAmount(formConfigs.buytoken);
      const { tokenId: selltoken } = sellInputToken;
      const { tokenId: buytoken } = buyInputToken;
      if (isUseTokenFee) {
        await dispatch(actionSetFeeToken(selltoken));
      } else {
        await dispatch(actionSetFeeToken(PRV.id));
      }
      const { field, useMax } = feeData;
      const getSpookyTokenParamReq = findTokenSpookyByIdSelector(state);
      const tokenSellSpooky = getSpookyTokenParamReq(selltoken);
      const tokenBuySpooky = getSpookyTokenParamReq(buytoken);
      if (tokenSellSpooky == null || tokenBuySpooky == null) {
        throw 'This pair is not existed on spooky';
      }
      switch (field) {
        case formConfigs.selltoken: {
          inputPDecimals = tokenBuySpooky.pDecimals;
          inputToken = formConfigs.buytoken;
          break;
        }
        case formConfigs.buytoken: {
          inputPDecimals = tokenSellSpooky.pDecimals;
          inputToken = formConfigs.selltoken;
          break;
        }
        default:
          break;
      }
      const {
        maxGet,
        minFeePRVFixed,
        availableFixedSellAmountPRV,
        minFeeTokenFixed,
      } = feetokenDataSelector(state);
      const slippagetolerance = slippagetoleranceSelector(state);

      const originalMinAmountExpected =
        field === formConfigs.buytoken
          ? maxGet
          : calMintAmountExpected({
              maxGet,
              slippagetolerance,
            });

      const minAmountExpectedToHumanAmount = convert.toHumanAmount(
        originalMinAmountExpected,
        inputPDecimals,
      );

      const minAmountExpectedToFixed = format.toFixed(
        minAmountExpectedToHumanAmount,
        inputPDecimals,
      );

      batch(() => {
        if (useMax) {
          dispatch(
            change(
              formConfigs.formName,
              formConfigs.selltoken,
              availableFixedSellAmountPRV,
            ),
          );
        }
        // dispatch(
        //   change(formConfigs.formName, inputToken, minAmountExpectedToFixed)
        // );
        dispatch(
          change(
            formConfigs.formName,
            inputToken,
            maxGet ? maxGet.toString() : '',
          ),
        );
        dispatch(
          change(
            formConfigs.formName,
            formConfigs.feetoken,
            isUseTokenFee ? minFeeTokenFixed : minFeePRVFixed,
          ),
        );
      });
    } catch (error) {
      throw error;
    }
  };

export const actionEstimateTradeForCurve =
  (payload) => async (dispatch, getState) => {
    let minSellOriginalAmount = 0;
    let maxBuyOriginalAmount = 0;
    let state = getState();
    const isExchangeVisible = isExchangeVisibleSelector(state)(
      KEYS_PLATFORMS_SUPPORTED.curve,
    );
    if (!isExchangeVisible) {
      return {
        minSellOriginalAmount,
        maxBuyOriginalAmount,
      };
    }
    try {
      const { selltoken, buytoken, sellamount } = payload;
      const isPairSup = isPairSupportedTradeOnCurveSelector(state);
      const getCurveTokenParamReq = findTokenCurveByIdSelector(state);
      const tokenSellCurve = getCurveTokenParamReq(selltoken);
      const tokenBuyCurve = getCurveTokenParamReq(buytoken);
      if (!isPairSup) {
        throw 'This pair is not existed on curve';
      }

      // human amount in chain
      const humanAmountInChain = convert.toHumanAmount(
        sellamount,
        tokenSellCurve.pDecimals,
      );

      const originalAmountOutChain = convert.toOriginalAmount(
        humanAmountInChain,
        tokenSellCurve.decimals,
      );

      let payloadCurve = {
        sourceToken: tokenSellCurve,
        destToken: tokenBuyCurve,
        amount: convert.toHumanAmount(
          originalAmountOutChain,
          tokenSellCurve.decimals,
        ),
      };

      const { sourceToken, destToken, amount } = payloadCurve;
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      const quote = await pDexV3Inst.getQuoteCurve({
        tokenInContractId: sourceToken.contractId,
        tokenOutContractId: destToken.contractId,
        amount,
      });
      if (
        !quote ||
        !quote?.amountOutRaw ||
        !parseInt(quote?.amountOutRaw || 0)
      ) {
        throw 'Can not found best route for this pair';
      }
      const paths = [sourceToken.contractId, destToken.contractId];

      let originalMaxGet = quote?.amountOutRaw;

      const tokenDecimals = tokenBuyCurve.decimals;
      const tokenPDecimals = tokenBuyCurve.pDecimals;
      const maxGetHuman = convert.toHumanAmount(originalMaxGet, tokenDecimals);
      const maxGet = convert.toOriginalAmount(maxGetHuman, tokenPDecimals);
      // only PRV
      const tradingFee = await pDexV3Inst.estimateCurveTradingFee({
        srcTokens: selltoken,
        destTokens: buytoken,
        srcQties: sellamount,
      });
      if (!tradingFee) {
        throw 'Can not estimate trading fee';
      }
      const {
        feeAddress,
        tradeID,
        signAddress,
        originalTradeFee,
        unifiedTokenId,
        tokenId,
        isUseTokenFee,
      } = tradingFee;

      minSellOriginalAmount = sellamount;
      maxBuyOriginalAmount = maxGet;

      await dispatch(
        actionChangeEstimateData({
          [KEYS_PLATFORMS_SUPPORTED.curve]: {
            feePrv: {
              fee: isUseTokenFee ? 0 : originalTradeFee,
              isSignificant: false,
              maxGet,
              route: paths,
              sellAmount: sellamount,
              buyAmount: maxGet,
              tokenRoute: paths,
            },
            feeToken: {
              sellAmount: sellamount,
              buyAmount: maxGet,
              fee: isUseTokenFee ? originalTradeFee : 0,
              isSignificant: false,
              maxGet,
              route: paths,
              tokenRoute: paths,
            },
            tradeID,
            feeAddress,
            signAddress,
            unifiedTokenId,
            tokenId,
            isUseTokenFee,
            ...quote,
            error: null,
          },
        }),
      );
    } catch (error) {
      console.log('ERROR-actionEstimateTradeForCurve', error);
      dispatch(
        actionSetError({ platformId: KEYS_PLATFORMS_SUPPORTED.curve, error }),
      );
    }
    return {
      minSellOriginalAmount,
      maxBuyOriginalAmount,
    };
  };

export const actionEstimateTradeForUni =
  (payload) => async (dispatch, getState) => {
    let minSellOriginalAmount = 0;
    let maxBuyOriginalAmount = 0;
    let state = getState();
    const isExchangeVisible = isExchangeVisibleSelector(state)(
      KEYS_PLATFORMS_SUPPORTED.uni,
    );
    if (!isExchangeVisible) {
      return {
        minSellOriginalAmount,
        maxBuyOriginalAmount,
      };
    }
    try {
      const { selltoken, buytoken, sellamount, buyamount } = payload;
      const isPairSup = isPairSupportedTradeOnUniSelector(state);
      const { field } = feetokenDataSelector(state);
      const getUniTokenParamReq = findTokenUniByIdSelector(state);
      const tokenSellUni = getUniTokenParamReq(selltoken);
      const tokenBuyUni = getUniTokenParamReq(buytoken);
      if (!isPairSup) {
        throw 'This pair is not existed on uni';
      }
      const server = await serverService.getDefault();
      const { uniConfigs } = server;
      let tokenDecimals, tokenPDecimals;
      let payloadUni = {
        sourceToken: tokenSellUni,
        destToken: tokenBuyUni,
        chainID: uniConfigs.chainID,
      };
      switch (field) {
        case formConfigs.selltoken: {
          // human amount in chain
          const humanAmountInChain = convert.toHumanAmount(
            sellamount,
            tokenSellUni.pDecimals,
          );
          const originalAmountOutChain = convert.toOriginalAmount(
            humanAmountInChain,
            tokenSellUni.decimals,
          );
          payloadUni.amount = convert.toHumanAmount(
            originalAmountOutChain,
            tokenSellUni.decimals,
          );
          payloadUni.isSwapFromBuyToSell = false;
          tokenDecimals = tokenBuyUni.decimals;
          tokenPDecimals = tokenBuyUni.pDecimals;
          break;
        }
        case formConfigs.buytoken: {
          // human amount in chain
          const humanAmountInChain = convert.toHumanAmount(
            buyamount,
            tokenBuyUni.pDecimals,
          );
          const originalAmountOutChain = convert.toOriginalAmount(
            humanAmountInChain,
            tokenBuyUni.decimals,
          );
          payloadUni.amount = convert.toHumanAmount(
            originalAmountOutChain,
            tokenBuyUni.decimals,
          );
          payloadUni.isSwapFromBuyToSell = true; // convert from buy -> sell
          tokenDecimals = tokenSellUni.decimals;
          tokenPDecimals = tokenSellUni.pDecimals;
          break;
        }
        default:
          break;
      }
      const { sourceToken, destToken, amount, isSwapFromBuyToSell } =
        payloadUni;
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      const quoteDataResponse = await pDexV3Inst.getQuote({
        tokenInContractId: sourceToken.contractId,
        tokenOutContractId: destToken.contractId,
        amount,
        exactIn: isSwapFromBuyToSell ? false : true,
        chainId: payloadUni.chainID,
      });
      const quote = quoteDataResponse?.data;
      const paths = quote?.paths;
      if (!quote || !paths || paths.length === 0) {
        throw 'Can not found best route for this pair';
      }
      let originalMaxGet = quote?.amountOutRaw;
      const maxGetHuman = convert.toHumanAmount(originalMaxGet, tokenDecimals);
      const maxGet = convert.toOriginalAmount(maxGetHuman, tokenPDecimals);
      // only PRV
      const tradingFee = await pDexV3Inst.estimateUniTradingFee({
        srcTokens: selltoken,
        destTokens: buytoken,
        srcQties: String(isSwapFromBuyToSell ? maxGet : sellamount),
      });
      if (!tradingFee) {
        throw 'Can not estimate trading fee';
      }
      const {
        feeAddress,
        tradeID,
        signAddress,
        originalTradeFee,
        unifiedTokenId,
        tokenId,
        isUseTokenFee,
      } = tradingFee;
      let sellAmount = 0;
      let buyAmount = 0;
      switch (field) {
        case formConfigs.selltoken: {
          minSellOriginalAmount = sellamount;
          maxBuyOriginalAmount = maxGet;
          sellAmount = sellamount;
          buyAmount = maxGet;
          break;
        }
        case formConfigs.buytoken: {
          minSellOriginalAmount = maxGet;
          maxBuyOriginalAmount = buyamount;
          sellAmount = maxGet;
          buyAmount = buyamount;
          break;
        }
        default:
          break;
      }
      await dispatch(
        actionChangeEstimateData({
          [KEYS_PLATFORMS_SUPPORTED.uni]: {
            feePrv: {
              fee: isUseTokenFee ? 0 : originalTradeFee,
              isSignificant: false,
              maxGet,
              route: paths,
              sellAmount,
              buyAmount,
              tokenRoute: paths,
            },
            feeToken: {
              sellAmount,
              buyAmount,
              fee: isUseTokenFee ? originalTradeFee : 0,
              isSignificant: false,
              maxGet,
              route: paths,
              tokenRoute: paths,
            },
            tradeID,
            feeAddress,
            signAddress,
            unifiedTokenId,
            tokenId,
            isUseTokenFee,
            ...quote,
            error: null,
          },
        }),
      );
    } catch (error) {
      console.log('ERROR-actionEstimateTradeForUni', error);
      dispatch(
        actionSetError({ platformId: KEYS_PLATFORMS_SUPPORTED.uni, error }),
      );
    }
    return {
      minSellOriginalAmount,
      maxBuyOriginalAmount,
    };
  };

export const actionEstimateTradeForPancake =
  (payload) => async (dispatch, getState) => {
    let minSellOriginalAmount = 0;
    let maxBuyOriginalAmount = 0;
    let state = getState();
    const isExchangeVisible = isExchangeVisibleSelector(state)(
      KEYS_PLATFORMS_SUPPORTED.pancake,
    );
    if (!isExchangeVisible) {
      return {
        minSellOriginalAmount,
        maxBuyOriginalAmount,
      };
    }
    try {
      const { selltoken, buytoken, sellamount, buyamount } = payload;
      const isPairSup = isPairSupportedTradeOnPancakeSelector(state);
      const { field } = feetokenDataSelector(state);
      const getPancakeTokenParamReq = findTokenPancakeByIdSelector(state);
      const tokenSellPancake = getPancakeTokenParamReq(selltoken);
      const tokenBuyPancake = getPancakeTokenParamReq(buytoken);
      if (!isPairSup) {
        throw 'This pair is not existed on pancake';
      }
      let tokenDecimals, tokenPDecimals;
      const server = await serverService.getDefault();
      const { pancakeConfigs, bscConfigs } = server;
      let payloadPancake = {
        sourceToken: tokenSellPancake,
        destToken: tokenBuyPancake,
        chainID: pancakeConfigs.chainID,
      };
      switch (field) {
        case formConfigs.selltoken: {
          // human amount in chain
          const humanAmountInChain = convert.toHumanAmount(
            sellamount,
            tokenSellPancake.pDecimals,
          );
          const originalAmountOutChain = convert.toOriginalAmount(
            humanAmountInChain,
            tokenSellPancake.decimals,
          );
          payloadPancake.amount = convert.toHumanAmount(
            originalAmountOutChain,
            tokenSellPancake.decimals,
          );
          payloadPancake.isSwapFromBuyToSell = false;
          tokenDecimals = tokenBuyPancake.decimals;
          tokenPDecimals = tokenBuyPancake.pDecimals;
          break;
        }
        case formConfigs.buytoken: {
          // human amount in chain
          const humanAmountInChain = convert.toHumanAmount(
            buyamount,
            tokenBuyPancake.pDecimals,
          );
          const originalAmountOutChain = convert.toOriginalAmount(
            humanAmountInChain,
            tokenBuyPancake.decimals,
          );
          payloadPancake.amount = convert.toHumanAmount(
            originalAmountOutChain,
            tokenBuyPancake.decimals,
          );
          payloadPancake.isSwapFromBuyToSell = true; // convert from buy -> sell
          tokenDecimals = tokenSellPancake.decimals;
          tokenPDecimals = tokenSellPancake.pDecimals;
          break;
        }
        default:
          break;
      }
      const { sourceToken, destToken, amount, isSwapFromBuyToSell } =
        payloadPancake;
      const hashmapContractIDs = hashmapContractIDsSelector(state);
      const { paths, outputs, impactAmount } = await getBestRateFromPancake({
        sourceToken,
        destToken,
        amount,
        isSwapFromBuyToSell,
        bscConfigs,
        pancakeConfigs,
        listDecimals: hashmapContractIDs,
      });
      if (!paths || paths.length === 0) {
        throw 'Can not found best route for this pair';
      }
      // convert maxGet amount from decimals to pDecimals
      let originalMaxGet = isSwapFromBuyToSell
        ? outputs[0]
        : outputs[outputs.length - 1];
      const maxGetHuman = convert.toHumanAmount(originalMaxGet, tokenDecimals);
      const maxGet = convert.toOriginalAmount(maxGetHuman, tokenPDecimals);
      // only PRV
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      const tradingFee = await pDexV3Inst.estimatePancakeTradingFee({
        srcTokens: selltoken,
        destTokens: buytoken,
        srcQties: String(isSwapFromBuyToSell ? maxGet : sellamount),
      });
      if (!tradingFee) {
        throw 'Can not estimate trading fee';
      }
      const {
        feeAddress,
        tradeID,
        signAddress,
        originalTradeFee,
        unifiedTokenId,
        tokenId,
        isUseTokenFee,
      } = tradingFee;
      let sellAmount = 0;
      let buyAmount = 0;
      switch (field) {
        case formConfigs.selltoken: {
          minSellOriginalAmount = sellamount;
          maxBuyOriginalAmount = maxGet;
          sellAmount = sellamount;
          buyAmount = maxGet;
          break;
        }
        case formConfigs.buytoken: {
          minSellOriginalAmount = maxGet;
          maxBuyOriginalAmount = buyamount;
          sellAmount = maxGet;
          buyAmount = buyamount;
          break;
        }
        default:
          break;
      }

      const pancakeData = {
        feePrv: {
          fee: isUseTokenFee ? 0 : originalTradeFee,
          isSignificant: false,
          maxGet,
          route: paths,
          sellAmount,
          buyAmount,
          impactAmount,
          tokenRoute: paths,
        },
        feeToken: {
          sellAmount,
          buyAmount,
          fee: isUseTokenFee ? originalTradeFee : 0,
          isSignificant: false,
          maxGet,
          route: paths,
          impactAmount,
          tokenRoute: paths,
        },
        tradeID,
        feeAddress,
        signAddress,
        unifiedTokenId,
        tokenId,
        isUseTokenFee,
        error: null,
      };

      await dispatch(
        actionChangeEstimateData({
          [KEYS_PLATFORMS_SUPPORTED.pancake]: pancakeData,
        }),
      );
    } catch (error) {
      console.log('ERROR-actionEstimateTradeForPancake', error);
      dispatch(
        actionSetError({ platformId: KEYS_PLATFORMS_SUPPORTED.pancake, error }),
      );
    }
    return {
      minSellOriginalAmount,
      maxBuyOriginalAmount,
    };
  };

export const actionFindBestRateBetweenPlatforms =
  ({ pDexData, pancakeData, uniData, curveData, params }) =>
  async (dispatch, getState) => {
    const { field } = params;
    const state = getState();
    const {
      minSellOriginalAmount: sellPDexAmount,
      maxBuyOriginalAmount: buyPDexAmount,
    } = pDexData;
    const {
      minSellOriginalAmount: sellPancakeAmount,
      maxBuyOriginalAmount: buyPancakeAmount,
    } = pancakeData;
    const {
      minSellOriginalAmount: sellUniAmount,
      maxBuyOriginalAmount: buyUniAmount,
    } = uniData;
    const {
      minSellOriginalAmount: sellCurveAmount,
      maxBuyOriginalAmount: buyCurveAmount,
    } = curveData;
    let platformIdHasBestRate;
    const isPairSupportedTradeOnPancake =
      isPairSupportedTradeOnPancakeSelector(state);
    const isPairSupportedTradeOnUni = isPairSupportedTradeOnUniSelector(state);
    const isPairSupportedTradeOnCurve =
      isPairSupportedTradeOnCurveSelector(state);
    console.log('pdexData', pDexData);
    console.log('pancakeData', pancakeData);
    console.log('uniData', uniData);
    console.log('curveData', curveData);
    try {
      switch (field) {
        case formConfigs.selltoken: {
          let arrMaxBuyAmount = [];
          if (new BigNumber(buyPDexAmount).isGreaterThan(0)) {
            arrMaxBuyAmount.push({
              id: KEYS_PLATFORMS_SUPPORTED.incognito,
              amount: buyPDexAmount,
            });
          }
          if (
            isPairSupportedTradeOnPancake &&
            new BigNumber(buyPancakeAmount).isGreaterThan(0)
          ) {
            arrMaxBuyAmount.push({
              id: KEYS_PLATFORMS_SUPPORTED.pancake,
              amount: buyPancakeAmount,
            });
          }
          if (
            isPairSupportedTradeOnUni &&
            new BigNumber(buyUniAmount).isGreaterThan(0)
          ) {
            arrMaxBuyAmount.push({
              id: KEYS_PLATFORMS_SUPPORTED.uni,
              amount: buyUniAmount,
            });
          }
          if (
            isPairSupportedTradeOnCurve &&
            new BigNumber(buyCurveAmount).isGreaterThan(0)
          ) {
            arrMaxBuyAmount.push({
              id: KEYS_PLATFORMS_SUPPORTED.curve,
              amount: buyCurveAmount,
            });
          }
          if (arrMaxBuyAmount.length > 0) {
            const bestRate = findBestRateOfMaxBuyAmount(arrMaxBuyAmount);
            platformIdHasBestRate = bestRate?.id;
          }
          break;
        }
        case formConfigs.buytoken: {
          const arrMinSellAmount = [];
          if (new BigNumber(sellPDexAmount).isGreaterThan(0)) {
            arrMinSellAmount.push({
              id: KEYS_PLATFORMS_SUPPORTED.incognito,
              amount: sellPDexAmount,
            });
          }
          if (
            isPairSupportedTradeOnPancake &&
            new BigNumber(sellPancakeAmount).isGreaterThan(0)
          ) {
            arrMinSellAmount.push({
              id: KEYS_PLATFORMS_SUPPORTED.pancake,
              amount: sellPancakeAmount,
            });
          }
          if (
            isPairSupportedTradeOnUni &&
            new BigNumber(sellUniAmount).isGreaterThan(0)
          ) {
            arrMinSellAmount.push({
              id: KEYS_PLATFORMS_SUPPORTED.uni,
              amount: sellUniAmount,
            });
          }
          if (
            isPairSupportedTradeOnCurve &&
            new BigNumber(sellCurveAmount).isGreaterThan(0)
          ) {
            arrMinSellAmount.push({
              id: KEYS_PLATFORMS_SUPPORTED.curve,
              amount: sellCurveAmount,
            });
          }
          if (arrMinSellAmount.length > 0) {
            const bestRate = findBestRateOfMinSellAmount(arrMinSellAmount);
            platformIdHasBestRate = bestRate?.id;
          }
          break;
        }
        default:
          break;
      }

      // Set default platformIdBestRate if can not find platformIdBestRate
      if (!platformIdHasBestRate) {
        if (isPairSupportedTradeOnPancake) {
          platformIdHasBestRate = KEYS_PLATFORMS_SUPPORTED.pancake;
        } else if (isPairSupportedTradeOnUni) {
          platformIdHasBestRate = KEYS_PLATFORMS_SUPPORTED.uni;
        } else if (isPairSupportedTradeOnCurve) {
          platformIdHasBestRate = KEYS_PLATFORMS_SUPPORTED.curve;
        } else {
          platformIdHasBestRate = KEYS_PLATFORMS_SUPPORTED.incognito;
        }
      }

      if (platformIdHasBestRate) {
        await dispatch(actionSwitchPlatform(platformIdHasBestRate));
      }
    } catch (error) {
      throw error;
    }
  };

export const actionEstimateTrade =
  ({ field = formConfigs.selltoken, useMax = false } = {}) =>
  async (dispatch, getState) => {
    let isFetched = false;
    let state = getState();
    const defaultExchange = defaultExchangeSelector(state);
    try {
      const params = { field, useMax };
      // Show loading estimate trade and reset fee data
      dispatch(actionFetching(true));
      // dispatch(change(formConfigs.formName, formConfigs.feetoken, ''));

      const inputAmount = inputAmountSelector(state);
      let sellInputToken, buyInputToken, inputToken, inputPDecimals;
      sellInputToken = inputAmount(formConfigs.selltoken);
      buyInputToken = inputAmount(formConfigs.buytoken);

      const {
        tokenId: selltoken,
        originalAmount: sellOriginalAmount,
        pDecimals: sellPDecimals,
        availableOriginalAmount: availableSellOriginalAmount,
      } = sellInputToken;

      let maxAmount = availableSellOriginalAmount;

      if (useMax) {
        maxAmount = await dispatch(actionGetMaxAmount());
      }

      let sellAmount = useMax ? maxAmount : sellOriginalAmount;
      // if (new BigNumber(availableSellOriginalAmount).eq(sellOriginalAmount)) {
      //   sellAmount = availableSellOriginalAmount;
      //   useMax = true;
      // }

      // change sell token input when press max
      if (useMax && sellAmount) {
        dispatch(
          change(
            formConfigs.formName,
            formConfigs.selltoken,
            convert.toHumanAmount(sellAmount, sellPDecimals)?.toString(),
          ),
        );
      }

      const {
        tokenId: buytoken,
        originalAmount: buyAmount,
        pDecimals: buyPDecimals,
      } = buyInputToken;

      let payload = {
        selltoken,
        buytoken,
        ismax: useMax,
      };

      const slippagetolerance = slippagetoleranceSelector(state);

      await dispatch(actionChangeEstimateData({ field, useMax }));
      switch (field) {
        case formConfigs.selltoken: {
          inputToken = formConfigs.buytoken;
          payload.sellamount = sellAmount;
          if (!payload.sellamount) {
            return;
          }
          payload.sellamount = String(payload.sellamount);
          inputPDecimals = buyPDecimals;
          break;
        }
        case formConfigs.buytoken: {
          inputToken = formConfigs.selltoken;
          payload.buyamount = floor(
            new BigNumber(buyAmount)
              .multipliedBy(100 / (100 - slippagetolerance))
              .toNumber(),
          );
          if (!payload.buyamount) {
            return;
          }
          payload.buyamount = String(payload.buyamount);
          inputPDecimals = sellPDecimals;
          break;
        }
        default:
          break;
      }

      const feetoken = feeSelectedSelector(state);

      payload.feetoken = feetoken;
      payload.inputPDecimals = inputPDecimals;
      payload.inputToken = inputToken;

      if (
        isEmpty(sellInputToken) ||
        isEmpty(buyInputToken) ||
        isEmpty(feetoken)
      ) {
        return;
      }

      const estimateRawData = await SwapService.getEstiamteTradingFee({
        amount: convert
          .toHumanAmount(payload.sellamount, inputPDecimals)
          ?.toString(),
        fromToken: payload.selltoken,
        toToken: payload.buytoken,
        slippage: slippagetolerance.toString(),
      });

      if (!estimateRawData) {
        throw new Error('Can not estimate trade');
      }

      //NEW FLOW, combine all esimate fee API in one with new Back-End (from Lam)

      const { bestRateExchange, exchangeSupports } = await extractEstimateData(
        estimateRawData,
        sellInputToken.tokenData,
        defaultExchange,
      );

      //convert new data to data old structror (BIND UI)
      exchangeSupports.map(async (exchange) => {
        const {
          amountOut,
          feeAddress,
          fees,
          routes,
          impactAmount,
          incTokenID,
          appName,
        } = exchange;
        const [isUseTokenFee, originalTradeFee] = isUseTokenFeeParser(fees);
        const platformData = {
          feePrv: {
            fee: isUseTokenFee ? 0 : originalTradeFee,
            isSignificant: false,
            maxGet: amountOut.toString(),
            route: routes,
            sellAmount: payload.sellamount,
            buyAmount: amountOut,
            impactAmount,
            tokenRoute: routes,
          },
          feeToken: {
            sellAmount: payload.sellamount,
            buyAmount: amountOut,
            fee: isUseTokenFee ? originalTradeFee : 0,
            isSignificant: false,
            maxGet: amountOut.toString(),
            route: routes,
            impactAmount,
            tokenRoute: routes,
          },
          tradeID: '',
          feeAddress,
          signAddress: '',
          unifiedTokenId: selltoken,
          tokenId: incTokenID,
          isUseTokenFee,
          error: null,
        };

        console.log('platformData ', platformData);
        console.log('appName ', appName);

        switch (appName) {
          case 'pancake':
            {
              await dispatch(
                actionChangeEstimateData({
                  [KEYS_PLATFORMS_SUPPORTED.pancake]: platformData,
                }),
              );
            }
            break;
          case 'uniswap':
            {
              await dispatch(
                actionChangeEstimateData({
                  [KEYS_PLATFORMS_SUPPORTED.uni]: platformData,
                }),
              );
            }
            break;
          case 'curve':
            {
              await dispatch(
                actionChangeEstimateData({
                  [KEYS_PLATFORMS_SUPPORTED.curve]: platformData,
                }),
              );
            }
            break;
          case 'spooky':
            {
              await dispatch(
                actionChangeEstimateData({
                  [KEYS_PLATFORMS_SUPPORTED.spooky]: platformData,
                }),
              );
            }
            break;
          default:
            {
              await dispatch(
                actionChangeEstimateData({
                  [KEYS_PLATFORMS_SUPPORTED.incognito]: platformData,
                }),
              );
            }
            break;
        }
      });

      // Save best rate and exchange support list to Redux Store
      await dispatch(actionSetBestRateExchange(bestRateExchange));
      await dispatch(actionSetExchangeSupportList(exchangeSupports));

      let platformIdHasBestRate;

      if (bestRateExchange.appName === 'uniswap') {
        platformIdHasBestRate = 'uni';
      } else if (bestRateExchange.appName === 'pdex')
        platformIdHasBestRate = 'incognito';
      else platformIdHasBestRate = bestRateExchange.appName;

      await dispatch(actionSwitchPlatform(platformIdHasBestRate));

      // estimateAllPlatformLegacy()

      isFetched = true;
      state = getState();
      const { availableAmountText, availableOriginalAmount } =
        sellInputTokenSelector(state);

      const errorEstTrade = errorEstimateTradeSelector(state);

      if (errorEstTrade) {
        new ExHandler(errorEstTrade).showErrorToast();
        if (useMax && availableOriginalAmount) {
          dispatch(
            change(
              formConfigs.formName,
              formConfigs.selltoken,
              availableAmountText,
            ),
          );
        }
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      dispatch(actionSetFocusToken(''));
      dispatch(actionFetched({ isFetched }));
    }
  };

export const actionInitingSwapForm = (payload) => ({
  type: ACTION_SET_INITIING_SWAP,
  payload,
});

export const actionFetchedPairs = (payload) => ({
  payload,
  type: ACTION_FETCHED_LIST_PAIRS,
});

export const actionFetchPairs = (refresh) => async (dispatch, getState) => {
  return await dispatch(actionFetchPairs1(refresh));
  // let pairs = [];
  // let pDEXPairs = [];
  // let pancakeTokens = [];
  // let uniTokens = [];
  // let curveTokens = [];

  // const state = getState();
  // try {
  //   const pDexV3Inst = await getPDexV3Instance();
  //   const { pairs: listPairs } = swapSelector(state);

  //   // const privacyDataFilterList = getPrivacyDataFilterSelector(state);
  //   if (!refresh && listPairs.length > 0) {
  //     return listPairs;
  //   }

  //   const defaultExchange = defaultExchangeSelector(state);
  //   const isPrivacyApp = isPrivacyAppSelector(state);
  //   if (!isPrivacyApp) {
  //     const tasks = [
  //       pDexV3Inst.getListPair(),
  //       pDexV3Inst.getPancakeTokens(),
  //       pDexV3Inst.getUniTokens(),
  //     ];
  //     if (CONSTANT_CONFIGS.isMainnet) {
  //       tasks.push(pDexV3Inst.getCurveTokens());
  //       [pDEXPairs, pancakeTokens, uniTokens, curveTokens] = await Promise.all(
  //         tasks
  //       );
  //     } else {
  //       [pDEXPairs, pancakeTokens, uniTokens] = await Promise.all(tasks);
  //     }
  //     pairs = pDEXPairs.reduce(
  //       (prev, current) =>
  //         (prev = prev.concat([current.tokenId1, current.tokenId2])),
  //       []
  //     );

  //     pairs = [
  //       ...pairs,
  //       ...pancakeTokens.map((t) => t?.tokenID),
  //       ...uniTokens.map((t) => t?.tokenID),
  //       ...curveTokens.map((t) => t?.tokenID),
  //     ];
  //     pairs = uniq(pairs);
  //   } else {
  //     switch (defaultExchange) {
  //       case KEYS_PLATFORMS_SUPPORTED.pancake:
  //         pancakeTokens = await pDexV3Inst.getPancakeTokens();
  //         pairs = [...pancakeTokens.map((t) => t?.tokenID)];
  //         break;
  //       case KEYS_PLATFORMS_SUPPORTED.uni:
  //         uniTokens = await pDexV3Inst.getUniTokens();
  //         pairs = [...uniTokens.map((t) => t?.tokenID)];
  //         break;
  //       case KEYS_PLATFORMS_SUPPORTED.curve:
  //         curveTokens = await pDexV3Inst.getCurveTokens();
  //         pairs = [...curveTokens.map((t) => t?.tokenID)];
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // } catch (error) {
  //   new ExHandler(error).showErrorToast();
  // }
  // dispatch(
  //   actionFetchedPairs({
  //     pairs,
  //     pDEXPairs,
  //     pancakeTokens,
  //     uniTokens,
  //     curveTokens,
  //   })
  // );
  // return pairs;
};

export const actionFetchPairs1 = (refresh) => async (dispatch, getState) => {
  let pairs = [];
  let pDEXPairs = [];
  let pancakeTokens = [];
  let uniTokens = [];
  let curveTokens = [];
  let spookyTokens = [];

  const state = getState();
  // const selectedTokenList: SelectedPrivacy[] =
  //   getAllPrivacyDataSelector(state)() || [];

  try {
    // const pDexV3Inst = await getPDexV3Instance();
    const { pairs: listPairs } = swapSelector(state);

    const privacyDataFilterList = getPrivacyDataFilterSelector(state);
    if (!refresh && listPairs.length > 0) {
      return listPairs;
    }

    const defaultExchange = defaultExchangeSelector(state);
    const isPrivacyApp = isPrivacyAppSelector(state);
    if (!isPrivacyApp) {
      // const tasks = [
      //   pDexV3Inst.getListPair(),
      //   pDexV3Inst.getPancakeTokens(),
      //   pDexV3Inst.getUniTokens(),
      // ];
      // if (CONSTANT_CONFIGS.isMainnet) {
      //   tasks.push(pDexV3Inst.getCurveTokens());
      //   [pDEXPairs, pancakeTokens, uniTokens, curveTokens] = await Promise.all(
      //     tasks
      //   );
      // } else {
      //   [pDEXPairs, pancakeTokens, uniTokens] = await Promise.all(tasks);
      // }
      // pairs = pDEXPairs.reduce(
      //   (prev, current) =>
      //     (prev = prev.concat([current.tokenId1, current.tokenId2])),
      //   []
      // );

      // pairs = [
      //   ...pairs,
      //   ...pancakeTokens.map((t) => t?.tokenID),
      //   ...uniTokens.map((t) => t?.tokenID),
      //   ...curveTokens.map((t) => t?.tokenID),
      // ];
      // pairs = uniq(pairs);
      const pairsIdsList = privacyDataFilterList.map((token) => token.tokenId);
      pancakeTokens = pancakeFilterToken(privacyDataFilterList);
      uniTokens = uniswapFilterToken(privacyDataFilterList);
      spookyTokens = spoonkyFilterToken(privacyDataFilterList);
      pairs = [...pairsIdsList];
    } else {
      switch (defaultExchange) {
        case KEYS_PLATFORMS_SUPPORTED.pancake:
          {
            pancakeTokens = pancakeFilterToken(privacyDataFilterList);
            pairs = [...pancakeTokens.map((token) => token.tokenId)];
          }
          break;
        case KEYS_PLATFORMS_SUPPORTED.uni:
          {
            // uniTokens = await pDexV3Inst.getUniTokens();
            // pairs = [...uniTokens.map((t) => t?.tokenID)];
            uniTokens = uniswapFilterToken(privacyDataFilterList);
            pairs = [...uniTokens.map((token) => token.tokenId)];
          }
          break;
        case KEYS_PLATFORMS_SUPPORTED.curve:
          {
            // curveTokens = await pDexV3Inst.getCurveTokens();
            // pairs = [...curveTokens.map((t) => t?.tokenID)];
            curveTokens = privacyDataFilterList.filter((token) =>
              CURVE_SUPPORT_NETWORK.includes(token.currencyType),
            );
            pairs = [...curveTokens.map((token) => token.tokenId)];
          }
          break;

        case KEYS_PLATFORMS_SUPPORTED.spooky:
          {
            // curveTokens = await pDexV3Inst.getCurveTokens();
            // pairs = [...curveTokens.map((t) => t?.tokenID)];
            spookyTokens = spoonkyFilterToken(privacyDataFilterList);
            pairs = [...spookyTokens.map((token) => token.tokenId)];
          }
          break;

        default:
          break;
      }
    }
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }

  dispatch(
    actionFetchedPairs({
      pairs,
      pDEXPairs,
      pancakeTokens,
      uniTokens,
      curveTokens,
      spookyTokens,
    }),
  );
  return pairs;
};

const pancakeFilterToken = (privacyDataFilterList) => {
  let pancakeTokens = privacyDataFilterList.filter((token) => {
    let isSupport = PANCAKE_SUPPORT_NETWORK.includes(token.currencyType);
    let isSupportUnified = PANCAKE_SUPPORT_NETWORK.some((currencyType) =>
      token.listUnifiedTokenCurrencyType.includes(currencyType),
    );
    return isSupport || isSupportUnified;
  });

  pancakeTokens = pancakeTokens.map((token) => {
    return {
      ...token,
      //Old structrures from SDK
      id: token.tokenId,
      tokenId: token.tokenId,
      tokenID: token.tokenId,
      contractId: token.contractId,
      contractIdGetRate: token.contractId,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      pDecimals: token.pDecimals,
      protocol: 'pancake',
      pricePrv: token.pricePrv,
      verify: token.verify || true,
      isPopular: token.isPopular || true,
      priority: token.priority || -1,
      dappId: token.dappId || 48,
      currencyType: token.currencyType,
      networkName: token.networkName,
      networkId: token.networkId,
      movedUnifiedToken: token.movedUnifiedToken,
    };
  });
  return pancakeTokens;
};

const uniswapFilterToken = (privacyDataFilterList) => {
  let uniswapTokens = privacyDataFilterList.filter((token) => {
    let isSupport = UNISWAP_SUPPORT_NETWORK.includes(token.currencyType);
    let isSupportUnified = UNISWAP_SUPPORT_NETWORK.some((currencyType) =>
      token.listUnifiedTokenCurrencyType.includes(currencyType),
    );
    return isSupport || isSupportUnified;
  });

  uniswapTokens = uniswapTokens.map((token) => {
    return {
      ...token,
      //Old structrures from SDK
      id: token.tokenId,
      tokenId: token.tokenId,
      tokenID: token.tokenId,
      contractId: token.contractId,
      contractIdGetRate: token.contractId,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      pDecimals: token.pDecimals,
      protocol: 'uniswap',
      pricePrv: token.pricePrv,
      verify: token.verify || true,
      isPopular: token.isPopular || true,
      priority: token.priority || -1,
      dappId: token.dappId || 23,
      currencyType: token.currencyType,
      networkName: token.networkName,
      networkId: token.networkId,
      movedUnifiedToken: token.movedUnifiedToken,
    };
  });
  return uniswapTokens;
};

const spoonkyFilterToken = (privacyDataFilterList) => {
  let spookyTokens = privacyDataFilterList.filter((token) => {
    let isSupport = SPOOKY_SUPPORT_NETWORK.includes(token.currencyType);
    let isSupportUnified = SPOOKY_SUPPORT_NETWORK.some((currencyType) =>
      token.listUnifiedTokenCurrencyType.includes(currencyType),
    );
    return isSupport || isSupportUnified;
  });

  spookyTokens = spookyTokens.map((token) => {
    return {
      ...token,
      //Old structrures from SDK
      id: token.tokenId,
      tokenId: token.tokenId,
      tokenID: token.tokenId,
      contractId: token.contractId,
      contractIdGetRate: token.contractId,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      pDecimals: token.pDecimals,
      protocol: 'spoonky',
      pricePrv: token.pricePrv,
      verify: token.verify || true,
      isPopular: token.isPopular || true,
      priority: token.priority || -1,
      dappId: token.dappId || 0,
      currencyType: token.currencyType,
      networkName: token.networkName,
      networkId: token.networkId,
      movedUnifiedToken: token.movedUnifiedToken,
    };
  });
  return spookyTokens;
};

export const actionFreeHistoryOrders = () => ({
  type: ACTION_FREE_HISTORY_ORDERS,
});

export const actionInitSwapForm =
  ({ refresh = true, defaultPair = {}, shouldFetchHistory = false } = {}) =>
  async (dispatch, getState) => {
    try {
      let state = getState();
      const feetoken = feeSelectedSelector(state);
      const defaultExchange = defaultExchangeSelector(state);
      const isUsePRVToPayFee = feetoken === PRV.id;
      let pair = defaultPair || defaultPairSelector(state);
      batch(() => {
        dispatch(actionInitingSwapForm(true));
        dispatch(reset(formConfigs.formName));
        dispatch(actionResetData());
        dispatch(change(formConfigs.formName, formConfigs.feetoken, ''));
        dispatch(actionSetSellTokenFetched(pair?.selltoken));
        dispatch(actionSetBuyTokenFetched(pair?.buytoken));
        if (refresh && shouldFetchHistory) {
          dispatch(actionFreeHistoryOrders());
        }
      });
      const pairs = await dispatch(actionFetchPairs(refresh));
      const isDefaultPairExisted =
        difference([pair?.selltoken, pair?.buytoken], pairs).length === 0;
      if (!pair?.selltoken || !pair?.buytoken || !isDefaultPairExisted) {
        state = getState();
        const listPairsSellToken = listPairsIDVerifiedSelector(state);
        const listPairsBuyToken = listPairsIDBuyTokenVerifiedSelector(state);
        pair = {
          selltoken: listPairsSellToken[0],
          buytoken: listPairsBuyToken[1],
        };
        batch(() => {
          dispatch(actionSetSellTokenFetched(pair.selltoken));
          dispatch(actionSetBuyTokenFetched(pair.buytoken));
        });
      }
      const { selltoken } = pair;
      state = getState();
      const { slippage: defautSlippage } = swapSelector(state);
      console.log('defautSlippage', defautSlippage);
      batch(() => {
        dispatch(
          change(
            formConfigs.formName,
            formConfigs.slippagetolerance,
            defautSlippage,
          ),
        );
        const useFeeByToken = selltoken !== PRV_ID && !isUsePRVToPayFee;
        if (useFeeByToken) {
          dispatch(actionSetFeeToken(selltoken));
        } else {
          dispatch(actionSetFeeToken(PRV.id));
        }
        dispatch(getBalance(selltoken));
        if (selltoken !== PRV_ID && refresh) {
          dispatch(getBalance(PRV_ID));
        }
        if (shouldFetchHistory) {
          dispatch(actionFetchHistory());
          const currentScreen = currentScreenSelector(state);
          if (currentScreen !== routeNames.Trade) {
            dispatch(actionFetchRewardHistories());
          }
        }
      });
      const currentScreen = currentScreenSelector(state);
      if (currentScreen === routeNames.Trade) {
        dispatch(setDefaultTradingPlatformOnPdexV3());
      } else {
        dispatch(actionChangeSelectedPlatform(defaultExchange));
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      dispatch(actionInitingSwapForm(false));
    }
  };

export const actionSetSwapingToken = (payload) => ({
  type: ACTION_SET_SWAPING_TOKEN,
  payload,
});

export const actionSwapToken = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { tokenId: selltoken }: SelectedPrivacy = selltokenSelector(state);
    const { tokenId: buytoken }: SelectedPrivacy = buytokenSelector(state);
    if (!selltoken | !buytoken) {
      return;
    }
    await dispatch(actionSetSwapingToken(true));
    await dispatch(
      actionInitSwapForm({
        defaultPair: {
          selltoken: buytoken,
          buytoken: selltoken,
        },
        refresh: false,
      }),
    );
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    await dispatch(actionSetSwapingToken(false));
  }
};

export const actionSetSelectingToken = (payload) => ({
  type: ACTION_SET_SELECTING_TOKEN,
  payload,
});

export const actionSelectToken =
  (token: SelectedPrivacy, field) => async (dispatch, getState) => {
    if (!token.tokenId || !field) {
      return;
    }
    try {
      await dispatch(actionSetSelectingToken(true));
      const state = getState();
      const selltoken: SelectedPrivacy = selltokenSelector(state);
      const buytoken: SelectedPrivacy = buytokenSelector(state);
      switch (field) {
        case formConfigs.selltoken: {
          if (selltoken.tokenId === token.tokenId) {
            return;
          }
          if (buytoken.tokenId === token.tokenId) {
            await dispatch(actionSwapToken());
          } else {
            await dispatch(
              actionInitSwapForm({
                refresh: true,
                defaultPair: {
                  selltoken: token.tokenId,
                  buytoken: buytoken.tokenId,
                },
              }),
            );
          }
          break;
        }
        case formConfigs.buytoken: {
          if (buytoken.tokenId === token.tokenId) {
            return;
          }
          if (selltoken.tokenId === token.tokenId) {
            await dispatch(actionSwapToken());
          } else {
            await dispatch(
              actionInitSwapForm({
                refresh: true,
                defaultPair: {
                  selltoken: selltoken.tokenId,
                  buytoken: token.tokenId,
                },
              }),
            );
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      await dispatch(actionSetSelectingToken(false));
    }
  };

export const actionFetchingSwap = (payload) => ({
  type: ACTION_FETCH_SWAP,
  payload,
});

export const actionFetchSwap = () => async (dispatch, getState) => {
  let tx;
  const state = getState();
  const currentScreen = currentScreenSelector(state);
  try {
    const { disabledBtnSwap } = swapInfoSelector(state);
    if (disabledBtnSwap) {
      return;
    }
    setTimeout(() => {
      let analytic = '';
      let params = {
        sell_token: tokenIDToSell,
        buy_token: tokenIDToBuy,
        sell_amount: String(sellAmount),
      };
      switch (platform.id) {
        case KEYS_PLATFORMS_SUPPORTED.incognito:
          analytic = ANALYTICS.ANALYTIC_DATA_TYPE.TRADE;
          break;
        case KEYS_PLATFORMS_SUPPORTED.pancake:
          analytic = ANALYTICS.ANALYTIC_DATA_TYPE.TRADE_PANCAKE;
          break;
        case KEYS_PLATFORMS_SUPPORTED.uni:
          analytic = ANALYTICS.ANALYTIC_DATA_TYPE.TRADE_UNISWAP;
          break;
        case KEYS_PLATFORMS_SUPPORTED.curve:
          analytic = ANALYTICS.ANALYTIC_DATA_TYPE.TRADE_CURVE;
          break;
      }
      dispatch(requestUpdateMetrics(analytic, params));
    }, 300);
    await dispatch(actionFetchingSwap(true));
    const account = defaultAccountWalletSelector(state);
    const sellInputAmount = inputAmountSelector(state)(formConfigs.selltoken);
    const buyInputAmount = inputAmountSelector(state)(formConfigs.buytoken);
    const feetokenData = feetokenDataSelector(state);
    if (!sellInputAmount || !buyInputAmount || !feetokenData) {
      return;
    }
    const { tokenId: tokenIDToSell, originalAmount: sellAmount } =
      sellInputAmount;
    const { tokenId: tokenIDToBuy, originalAmount: minAcceptableAmount } =
      buyInputAmount;
    const {
      origininalFeeAmount: tradingFee,
      feetoken,
      feeDataByPlatform,
      tradePath,
    } = feetokenData;
    const pDexV3Inst = await getPDexV3Instance({ account });
    const platform = platformSelectedSelector(state);
    switch (platform.id) {
      case KEYS_PLATFORMS_SUPPORTED.incognito:
        {
          const params = {
            transfer: { fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX, info: '' },
            extra: {
              tokenIDToSell,
              sellAmount: String(sellAmount),
              tokenIDToBuy,
              tradingFee,
              tradePath,
              feetoken,
              version: PrivacyVersion.ver2,
              minAcceptableAmount: String(minAcceptableAmount),
            },
          };
          tx = await pDexV3Inst.createAndSendSwapRequestTx(params);
          if (!tx) {
            console.log('error');
          }
        }
        break;
      case KEYS_PLATFORMS_SUPPORTED.pancake: {
        const { tradeID, feeAddress, signAddress, unifiedTokenId, tokenId } =
          feeDataByPlatform;
        const getPancakeTokenParamReq = findTokenPancakeByIdSelector(state);
        const tokenSellPancake = getPancakeTokenParamReq(tokenIDToSell);
        const tokenBuyPancake = getPancakeTokenParamReq(tokenIDToBuy);
        let response;
        if (
          tokenSellPancake?.currencyType ===
          CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.UNIFIED_TOKEN
        ) {
          response =
            await pDexV3Inst.createAndSendTradeRequestPancakeTxForUnifiedToken({
              burningPayload: {
                originalBurnAmount: sellAmount,
                tokenID: unifiedTokenId,
                signKey: signAddress,
                feeAddress,
                tradeFee: tradingFee,
                info: String(tradeID),
                feeToken: feetoken,
                incTokenID: tokenId,
                expectedAmt: sellAmount,
              },
              tradePayload: {
                tradeID,
                srcTokenID: tokenSellPancake?.tokenID,
                destTokenID: tokenBuyPancake?.tokenID,
                paths: tradePath.join(','),
                srcQties: String(sellAmount),
                expectedDestAmt: String(minAcceptableAmount),
                userFeeSelection: feetoken === PRV.id ? 2 : 1,
                isNative:
                  tokenBuyPancake?.contractId ===
                  '0x0000000000000000000000000000000000000000',
              },
            });
        } else {
          response = await pDexV3Inst.createAndSendTradeRequestPancakeTx({
            burningPayload: {
              originalBurnAmount: sellAmount,
              tokenID: tokenIDToSell,
              signKey: signAddress,
              feeAddress,
              tradeFee: tradingFee,
              info: String(tradeID),
              feeToken: feetoken,
              incTokenID: tokenId,
            },
            tradePayload: {
              tradeID,
              srcTokenID: tokenSellPancake?.tokenID,
              destTokenID: tokenBuyPancake?.tokenID,
              paths: tradePath.join(','),
              userFeeSelection: feetoken === PRV.id ? 2 : 1,
              srcQties: String(sellAmount),
              expectedDestAmt: String(minAcceptableAmount),
              isNative:
                tokenBuyPancake?.contractId ===
                '0x0000000000000000000000000000000000000000',
            },
          });
        }
        tx = response;
        break;
      }
      case KEYS_PLATFORMS_SUPPORTED.uni: {
        const { tradeID, feeAddress, signAddress, tokenId } = feeDataByPlatform;
        const getUniTokenParamReq = findTokenUniByIdSelector(state);
        const tokenSellUni = getUniTokenParamReq(tokenIDToSell);
        const tokenBuyUni = getUniTokenParamReq(tokenIDToBuy);
        let response;
        if (
          tokenSellUni?.currencyType ===
          CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.UNIFIED_TOKEN
        ) {
          response =
            await pDexV3Inst.createAndSendTradeRequestUniTxForUnifiedToken({
              burningPayload: {
                originalBurnAmount: sellAmount,
                tokenID: tokenIDToSell,
                signKey: signAddress,
                feeAddress,
                tradeFee: tradingFee,
                info: String(tradeID),
                feeToken: feetoken,
                incTokenID: tokenId,
                expectedAmt: sellAmount,
              },
              tradePayload: {
                fees: JSON.stringify(feetokenData?.uni?.fees),
                tradeID,
                srcTokenID: tokenSellUni?.tokenID,
                destTokenID: tokenBuyUni?.tokenID,
                paths: JSON.stringify(tradePath),
                srcQties: String(sellAmount),
                expectedDestAmt: String(minAcceptableAmount),
                percents: JSON.stringify(feetokenData?.uni?.percents),
                isMulti: feetokenData?.uni?.multiRouter,
                userFeeSelection: feetoken === PRV.id ? 2 : 1,
              },
            });
        } else {
          response = await pDexV3Inst.createAndSendTradeRequestUniTx({
            burningPayload: {
              originalBurnAmount: sellAmount,
              tokenID: tokenIDToSell,
              signKey: signAddress,
              feeAddress,
              tradeFee: tradingFee,
              info: String(tradeID),
              feeToken: feetoken,
            },
            tradePayload: {
              fees: JSON.stringify(feetokenData?.uni?.fees),
              tradeID,
              srcTokenID: tokenSellUni?.tokenID,
              destTokenID: tokenBuyUni?.tokenID,
              paths: JSON.stringify(tradePath),
              srcQties: String(sellAmount),
              expectedDestAmt: String(minAcceptableAmount),
              percents: JSON.stringify(feetokenData?.uni?.percents),
              isMulti: feetokenData?.uni?.multiRouter,
              userFeeSelection: feetoken === PRV.id ? 2 : 1,
            },
          });
        }

        tx = response;
        break;
      }
      case KEYS_PLATFORMS_SUPPORTED.curve: {
        const { tradeID, feeAddress, signAddress, tokenId } = feeDataByPlatform;
        const getCurveTokenParamReq = findTokenCurveByIdSelector(state);
        const tokenSellCurve = getCurveTokenParamReq(tokenIDToSell);
        const tokenBuyCurve = getCurveTokenParamReq(tokenIDToBuy);
        let response;
        if (
          tokenSellCurve?.currencyType ===
          CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.UNIFIED_TOKEN
        ) {
          response =
            await pDexV3Inst.createAndSendTradeRequestCurveTxForUnifiedToken({
              burningPayload: {
                originalBurnAmount: sellAmount,
                tokenID: tokenIDToSell,
                signKey: signAddress,
                feeAddress,
                tradeFee: tradingFee,
                info: String(tradeID),
                feeToken: feetoken,
                incTokenID: tokenId,
                expectedAmt: sellAmount,
              },
              tradePayload: {
                tradeID,
                srcTokenID: tokenSellCurve?.tokenID,
                destTokenID: tokenBuyCurve?.tokenID,
                srcQties: String(sellAmount),
                expectedDestAmt: String(minAcceptableAmount),
                userFeeSelection: feetoken === PRV.id ? 2 : 1,
              },
            });
        } else {
          response = await pDexV3Inst.createAndSendTradeRequestCurveTx({
            burningPayload: {
              originalBurnAmount: sellAmount,
              tokenID: tokenIDToSell,
              signKey: signAddress,
              feeAddress,
              tradeFee: tradingFee,
              info: String(tradeID),
              feeToken: feetoken,
            },
            tradePayload: {
              tradeID,
              srcTokenID: tokenSellCurve?.tokenID,
              destTokenID: tokenBuyCurve?.tokenID,
              srcQties: String(sellAmount),
              expectedDestAmt: String(minAcceptableAmount),
              userFeeSelection: feetoken === PRV.id ? 2 : 1,
            },
          });
        }

        tx = response;
        break;
      }
      default:
        break;
    }
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    batch(() => {
      dispatch(actionFetchingSwap(false));
      dispatch(actionFetchHistory());
      if (currentScreen !== routeNames.Trade) {
        dispatch(actionFetchRewardHistories());
      }
      // Reset data after swap
      dispatch(actionResetData());
      dispatch(change(formConfigs.formName, formConfigs.feetoken, ''));
    });
  }
  return tx;
};

export const actionFetchingOrdersHistory = () => ({
  type: ACTION_FETCHING_ORDERS_HISTORY,
});

export const actionFetchedOrdersHistory = (payload) => ({
  type: ACTION_FETCHED_ORDERS_HISTORY,
  payload,
});

export const actionFetchFailOrderHistory = () => ({
  type: ACTION_FETCH_FAIL_ORDERS_HISTORY,
});

export const actionFetchHistory = () => async (dispatch, getState) => {
  let history = [];
  try {
    await dispatch(actionFetchingOrdersHistory());
    const state = getState();
    const pDexV3 = await dispatch(actionGetPDexV3Inst());
    // get trading platform incognito | pancake | uni | curve
    const defaultExchange = defaultExchangeSelector(state);
    const isPrivacyApp = isPrivacyAppSelector(state);
    if (!isPrivacyApp) {
      // Fetch history of all platform when current screen is pDexV3
      let swapHistory = [];
      let pancakeHistory = [];
      let uniHistory = [];
      let curveHistory = [];
      const tasks = [
        pDexV3.getSwapHistory({ version: PrivacyVersion.ver2 }),
        pDexV3.getSwapPancakeHistory(),
        pDexV3.getSwapUniHistoryFromApi(),
      ];
      if (CONSTANT_CONFIGS.isMainnet) {
        tasks.push(pDexV3.getSwapCurveHistoryFromApi());
        [swapHistory, pancakeHistory, uniHistory, curveHistory] =
          await Promise.all(tasks);
      } else {
        [swapHistory, pancakeHistory, uniHistory] = await Promise.all(tasks);
      }
      history = flatten([
        swapHistory,
        pancakeHistory,
        uniHistory,
        curveHistory,
      ]);
    } else {
      switch (defaultExchange) {
        // Fetch PancakeSwap history when current screen is pPancakeSwap
        case KEYS_PLATFORMS_SUPPORTED.pancake: {
          history = await pDexV3.getSwapPancakeHistory();
          break;
        }
        // Fetch Uniswap history when current screen is pUniswap
        case KEYS_PLATFORMS_SUPPORTED.uni: {
          history = await pDexV3.getSwapUniHistoryFromApi();
          break;
        }
        // Fetch Curve history when current screen is pCurve
        case KEYS_PLATFORMS_SUPPORTED.curve: {
          history = await pDexV3.getSwapCurveHistoryFromApi();
          break;
        }
        default:
          break;
      }
    }
    history = orderBy(history, 'requestime', 'desc');
    await dispatch(actionFetchedOrdersHistory(history));
  } catch (error) {
    console.log('actionFetchHistory-error', error);
    new ExHandler(error).showErrorToast();
    await dispatch(actionFetchFailOrderHistory());
  }
};

// Reward history
export const actionFetchingRewardHistories = () => ({
  type: ACTION_FETCHING_REWARD_HISTORY,
});

export const actionFetchedRewardHistories = (payload) => ({
  type: ACTION_FETCHED_REWARD_HISTORY,
  payload,
});

export const actionFetchFailRewardHistories = () => ({
  type: ACTION_FETCH_FAIL_REWARD_HISTORY,
});

export const actionFetchRewardHistories = () => async (dispatch, getState) => {
  try {
    await dispatch(actionFetchingRewardHistories());
    let state = getState();
    const pDexV3 = await dispatch(actionGetPDexV3Inst());
    const platform = platformSelectedSelector(state);
    let rewardHistoriesApiResponse;
    if (platform?.id === KEYS_PLATFORMS_SUPPORTED.pancake) {
      rewardHistoriesApiResponse = await pDexV3.getSwapPancakeRewardHistory({
        page: 0,
        limit: 1000,
      });
    }

    if (platform.id === KEYS_PLATFORMS_SUPPORTED.uni) {
      rewardHistoriesApiResponse = await pDexV3.getSwapUniRewardHistory({
        page: 0,
        limit: 1000,
      });
    }

    if (platform.id === KEYS_PLATFORMS_SUPPORTED.curve) {
      rewardHistoriesApiResponse = await pDexV3.getSwapCurveRewardHistory({
        page: 0,
        limit: 1000,
      });
    }
    console.log('rewardHistoriesApiResponse', rewardHistoriesApiResponse);
    dispatch(actionFetchedRewardHistories(rewardHistoriesApiResponse));
  } catch (error) {
    console.log('actionFetchHistory-error', error);
    await dispatch(actionFetchFailRewardHistories());
  }
};

export const actionFetchingOrderDetail = () => ({
  type: ACTION_FETCHING_ORDER_DETAIL,
});

export const actionFetchedOrderDetail = (payload) => ({
  type: ACTION_FETCHED_ORDER_DETAIL,
  payload,
});

export const actionFetchDataOrderDetail = () => async (dispatch, getState) => {
  let _order = {};
  const state = getState();
  const { order } = orderDetailSelector(state);
  if (!order?.requestTx) {
    return;
  }
  try {
    await dispatch(actionFetchingOrderDetail());
    const pDexV3 = await dispatch(actionGetPDexV3Inst());
    switch (order?.exchange) {
      case EXCHANGE_SUPPORTED.incognito: {
        _order = await pDexV3.getOrderSwapDetail({
          requestTx: order?.requestTx,
          version: PrivacyVersion.ver2,
          fromStorage: !!order?.fromStorage,
        });
        break;
      }
      case EXCHANGE_SUPPORTED.pancake: {
        _order = await pDexV3.getOrderSwapPancakeDetail({
          requestTx: order?.requestTx,
          version: PrivacyVersion.ver2,
          fromStorage: !!order?.fromStorage,
          tradeID: order?.tradeID,
        });
        break;
      }
      case EXCHANGE_SUPPORTED.uni: {
        _order = await pDexV3.getOrderSwapUniDetail({
          requestTx: order?.requestTx,
          version: PrivacyVersion.ver2,
          fromStorage: !!order?.fromStorage,
          tradeID: order?.tradeID,
        });
        break;
      }
      case EXCHANGE_SUPPORTED.curve: {
        _order = await pDexV3.getOrderSwapCurveDetail({
          requestTx: order?.requestTx,
          version: PrivacyVersion.ver2,
          fromStorage: !!order?.fromStorage,
          tradeID: order?.tradeID,
        });
        break;
      }
      default:
        break;
    }
  } catch (error) {
    _order = { ...order };
    new ExHandler(error).showErrorToast();
  } finally {
    _order = _order || order;
    await dispatch(actionFetchedOrderDetail(_order));
  }
};

export const actionSetDefaultPair = (payload) => ({
  type: ACTION_SET_DEFAULT_PAIR,
  payload,
});

export const actionChangeSelectedPlatform = (payload) => ({
  type: ACTION_CHANGE_SELECTED_PLATFORM,
  payload,
});

export const actionSwitchPlatform =
  (platformId) => async (dispatch, getState) => {
    try {
      console.log('actionSwitchPlatform platformId ', platformId);

      await dispatch(actionChangeSelectedPlatform(platformId));
      const state = getState();
      const { field } = feetokenDataSelector(state);
      const errorEstTrade = errorEstimateTradeSelector(state);
      if (!field || errorEstTrade) {
        return;
      }

      switch (platformId) {
        case KEYS_PLATFORMS_SUPPORTED.incognito:
          await dispatch(actionHandleInjectEstDataForPDex());
          break;
        case KEYS_PLATFORMS_SUPPORTED.pancake:
          await dispatch(actionHandleInjectEstDataForPancake());
          break;
        case KEYS_PLATFORMS_SUPPORTED.uni:
          await dispatch(actionHandleInjectEstDataForUni());
          break;
        case KEYS_PLATFORMS_SUPPORTED.curve:
          await dispatch(actionHandleInjectEstDataForCurve());
          break;
        case KEYS_PLATFORMS_SUPPORTED.spooky:
          await dispatch(actionHandleInjectEstDataForSpooky());
          break;
        default:
          break;
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
      throw error;
    }
  };

export const actionGetMaxAmount = () => async (dispatch, getState) => {
  const state = getState();
  let feeData = feetokenDataSelector(state);
  let isUseTokenFee = false;
  let platform = platformSelectedSelector(state);

  const inputAmount = inputAmountSelector(state);
  const sellInputToken = inputAmount(formConfigs.selltoken);

  if (platform.id === KEYS_PLATFORMS_SUPPORTED.pancake) {
    isUseTokenFee = feeData?.pancake?.isUseTokenFee;
  } else if (platform.id === KEYS_PLATFORMS_SUPPORTED.uni) {
    isUseTokenFee = feeData?.uni?.isUseTokenFee;
  } else if (platform.id === KEYS_PLATFORMS_SUPPORTED.curve) {
    isUseTokenFee = feeData?.uni?.isUseTokenFee;
  }

  const availableOriginalAmount = sellInputToken?.availableOriginalAmount;
  if (!isUseTokenFee) return availableOriginalAmount;
  const fee = feeData?.minFeeOriginal;
  let maxAmount = availableOriginalAmount - fee;
  if (maxAmount < 0) {
    maxAmount = availableOriginalAmount;
  }

  return maxAmount;
};

const estimateAllPlatformLegacy = () => {
  // let task = [
  //   dispatch(actionEstimateTradeForPDex(payload)),
  //   dispatch(actionEstimateTradeForPancake(payload)),
  //   dispatch(actionEstimateTradeForUni(payload)),
  // ];
  // let pDexData = [];
  // let pancakeData = [];
  // let uniData = [];
  // let curveData = [];
  // if (CONSTANT_CONFIGS.isMainnet) {
  //   task.push(dispatch(actionEstimateTradeForCurve(payload)));
  //   [pDexData, pancakeData, uniData, curveData] = await Promise.all(task);
  // } else {
  //   [pDexData, pancakeData, uniData] = await Promise.all(task);
  // }
  // await dispatch(
  //   actionFindBestRateBetweenPlatforms({
  //     pDexData,
  //     pancakeData,
  //     uniData,
  //     curveData,
  //     params,
  //     payload,
  //   })
  // );
};

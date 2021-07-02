import { ACTION_NAMES } from '@screens/Dex/Liquidity.actionsName';
import { accountSelector } from '@src/redux/selectors';
import { accountServices } from '@services/wallet';
import { mergeInputSelector } from '@screens/Dex/Liquidity.selector';
import { Validator, PRVIDSTR } from 'incognito-chain-web-js/build/wallet';
import dexUtils from '@utils/dex';
import { mergeInput, parseInputWithText } from '@screens/Dex/Liquidity.utlis';
import { HEADER_TABS, INPUT_FIELDS } from '@screens/Dex/Liquidity.constants';
import { uniqBy, isEmpty } from 'lodash';
import { batch } from 'react-redux';
import { LIMIT } from '@screens/DexV2/constants';
import BigNumber from 'bignumber.js';

/**
 * @param {string} tabName
 */
export const actionChangeTab = ({ tabName }) => ({
  type: ACTION_NAMES.CHANGE_TAB,
  tabName
});

/**
 * @param {boolean} isLoading
 */
export const actionChangeLoading = ({ isLoading = true }) => ({
  type: ACTION_NAMES.CHANGE_LOADING,
  isLoading
});

/**
 * @param {boolean} isFilter
 */
export const actionChangeFiltering = ({ isFiltering }) => ({
  type: ACTION_NAMES.CHANGE_FILTERING,
  isFiltering,
});


/**
 * @param {array} pairs
 * @param {array} pairTokens
 * @param {array} feePairs
 * @param {array} userPairs
 */
export const actionUpdatePDEState = ({ pairs, tokens, feePairs, userPairs }) => ({
  type: ACTION_NAMES.UPDATE_PDE_STATE,
  pdeState: {
    pairs,
    tokens,
    feePairs,
    userPairs
  }
});

export const actionClearHistories = ({ clearTab = undefined } = {}) => ({
  type: ACTION_NAMES.CLEAR_HISTORY,
  clearTab
});

export const actionFetchData = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const account = accountSelector.defaultAccount(state);
    const { wallet, liquidity } = state;
    if (liquidity.isLoading) return;
    dispatch(actionChangeLoading({ isLoading: true }));
    const { pairs, tokens, feePairs, userPairs } = await accountServices.getPairs({ account, wallet });
    dispatch(actionUpdatePDEState({ pairs, tokens, feePairs, userPairs }));
  } catch (error) {
    console.log('LIQUIDITY FETCH DATA ERROR: ', error);
    throw error;
  } finally {
    dispatch(actionChangeLoading({ isLoading: false }));
  }
};

export const actionUpdateFieldValue = (payload) => ({
  type: ACTION_NAMES.UPDATE_INPUT_FIELD,
  payload,
});

export const actionFilterWithdrawFeeOutput = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const account = accountSelector.defaultAccount(state);
    const { wallet, liquidity } = state;
    const { pdeState, tabName, addPool, removePool, withDraw } = liquidity;
    const { inputToken: currentInputToken, outputToken: currentOutputToken, name } = mergeInput({
      tabName, addPool, removePool, withDraw
    });
    const { tokens, feePairs, pairs } = pdeState;
    let outputList = [];
    let share;
    let inputToken;
    let outputToken;
    let tasks = [];
    feePairs.forEach((feePair) => {
      const { token1, token2, share: shareFee } = feePair;
      if (currentOutputToken && currentInputToken && (currentInputToken?.id === token1?.id) && (currentOutputToken?.id === token2?.id)) {
        share = shareFee;
      }
      outputList.push({
        inputToken: tokens.find(token => token.id === token1.id),
        outputToken: tokens.find(token => token.id === token2.id),
        shareFee,
      });
    });
    if (!currentOutputToken && !currentInputToken && feePairs.length > 0) {
      const { share: userShare } = feePairs[0];
      share = userShare;
    }

    if (!isEmpty(outputList)) {
      inputToken = currentInputToken && outputList.find(({ inputToken }) => inputToken.id === currentInputToken.id) ? currentInputToken : outputList[0].inputToken;
      outputToken = currentOutputToken && outputList.find(({ outputToken }) => outputToken.id === currentOutputToken.id) ? currentOutputToken : outputList[0]?.outputToken;
      outputList = outputList.filter(({ inputToken: _inputToken, outputToken: _outputToken }) => inputToken.id !== _inputToken.id && outputToken.id !== _outputToken.id);
      tasks = [
        await accountServices.getBalance({
          account,
          wallet,
          tokenID: inputToken?.id,
        }),
        await accountServices.getBalance({
          account, wallet,
          tokenID: outputToken.id,
        })
      ];
    }
    const pair = inputToken && outputToken ?
      pairs.find(i => Object.keys(i).includes(outputToken.id) && Object.keys(i).includes(inputToken.id))
      : null;
    const [inputBalance, outputBalance] = await Promise.all(tasks);
    dispatch(actionUpdateFieldValue({
      name,
      outputList,
      pair,
      inputToken,
      outputToken,
      outputBalance: outputBalance || 0,
      inputBalance: inputBalance || 0,
      share,
    }));
  } catch (error) {
    console.log('LIQUIDITY FILTER ERROR: ', error);
  }
};

export const actionFilterOutput = () => async (dispatch, getState) => {
  try {
    dispatch(actionChangeFiltering({ isFiltering: true }));
    const state = getState();
    const account = accountSelector.defaultAccount(state);
    const { wallet, liquidity } = state;
    const { pdeState, tabName, addPool, removePool, withDraw } = liquidity;

    if (tabName === HEADER_TABS.Withdraw) {
      await dispatch(actionFilterWithdrawFeeOutput());
      return;
    }
    const { inputText, inputToken, outputToken: currentOutputToken, name } = mergeInput({
      tabName, addPool, removePool, withDraw
    });
    const { tokens, pairs, userPairs, feePairs } = pdeState;
    let outputList = [];
    let outputToken;
    let share;
    let totalShare;
    if (tabName === HEADER_TABS.Add) {
      outputList = tokens.filter(item => item.id !== inputToken?.id);
      outputToken = currentOutputToken && outputList.find(item => item.id === currentOutputToken.id) ? currentOutputToken : outputList[0];
    } else {
      const pairsReward = tabName === HEADER_TABS.Remove ? userPairs : feePairs;
      pairsReward.forEach((userPair) => {
        const { token1, token2, totalShare: poolTotalShare, share: userShare } = userPair;
        if (token1.id === PRVIDSTR || token2.id === PRVIDSTR) {
          const tokenId = token1.id === PRVIDSTR ? token2.id : token1.id;
          outputList.push(tokens.find(token => token.id === tokenId));
        }
        if (!!currentOutputToken && (currentOutputToken?.id === token1?.id || currentOutputToken?.id === token2?.id)) {
          share = userShare;
          totalShare = poolTotalShare;
        }
      });
      if (!currentOutputToken && pairsReward.length > 0) {
        const { totalShare: poolTotalShare, share: userShare } = pairsReward[0];
        share = userShare;
        totalShare = poolTotalShare;
      }
      outputToken = currentOutputToken && outputList.find(item => item.id === currentOutputToken.id) ? currentOutputToken : outputList[0];
    }

    const pair = inputToken && outputToken ?
      pairs.find(i => Object.keys(i).includes(outputToken.id) && Object.keys(i).includes(inputToken.id))
      : null;

    let maxInputShare = 0;
    let maxOutputShare = 0;
    let sharePercent = 0;
    if (pair && outputToken) {
      const poolInputValue = pair[inputToken.id];
      const poolOutputValue = pair[outputToken.id];
      sharePercent = new BigNumber(share).dividedBy(totalShare).toNumber();
      maxInputShare = Math.ceil(new BigNumber(sharePercent).multipliedBy(poolInputValue).toNumber()) || 0;
      maxOutputShare = Math.ceil(new BigNumber(sharePercent).multipliedBy(poolOutputValue).toNumber()) || 0;
    }

    const tasks = [await accountServices.getBalance({
      account,
      wallet,
      tokenID: PRVIDSTR,
    })];

    if (outputToken) {
      tasks.push(await accountServices.getBalance({
        account, wallet,
        tokenID: outputToken.tokenId || outputToken.id,
      }));
    }

    const [inputBalance, outputBalance] = await Promise.all(tasks);

    dispatch(actionUpdateFieldValue({
      name,
      outputList,
      pair,
      outputToken,
      outputBalance,
      inputBalance,
      share,
      totalShare,
      maxInputShare,
      maxOutputShare,
      sharePercent,
    }));
    dispatch(actionChangeInputText({ newInputText: inputText }));
  } catch (error) {
    console.log('LIQUIDITY FILTER ERROR: ', error);
  } finally {
    dispatch(actionChangeFiltering({ isFiltering: false }));
  }
};

export const actionChangeInputText = ({ newInputText }) => async (dispatch, getState) => {
  try {
    new Validator('newInputText', newInputText).required().string();
    const state = getState();
    const { inputToken, outputToken, name, pair } = mergeInputSelector(state);
    const inputValue = parseInputWithText({ text: newInputText, token: inputToken });
    if (!pair) {
      return dispatch(actionUpdateFieldValue({
        name,
        inputText: newInputText,
        inputValue,
      }));
    }
    const { outputValue, outputText } = dexUtils.calculateValue(inputToken, inputValue, outputToken, pair, true);
    dispatch(actionUpdateFieldValue({
      name,
      inputText: newInputText,
      inputValue,
      outputValue,
      outputText,
    }));
  } catch (e) {
    throw e;
  }
};

export const actionChangeOutputToken = ({ newOutputToken, newInputToken }) => async (dispatch, getState) => {
  try {
    new Validator('newOutputToken', newOutputToken).required().object();
    const state = getState();
    const { name, inputToken } = mergeInputSelector(state);
    dispatch(actionUpdateFieldValue({
      name,
      outputToken: newOutputToken,
      inputToken: newInputToken || inputToken
    }));
    dispatch(actionFilterOutput());
  } catch (e) {
    throw e;
  }
};

export const actionChangeOutputText = ({ newOutputText }) => async (dispatch, getState) => {
  try {
    new Validator('newInputText', newOutputText).required().string();
    const state = getState();
    const { outputToken, name, pair, inputToken } = mergeInputSelector(state);
    const outputValue = parseInputWithText({ text: newOutputText, token: outputToken });
    if (!pair) {
      return dispatch(actionUpdateFieldValue({
        name,
        outputText: newOutputText,
        outputValue,
      }));
    }
    const { outputValue: inputValue, outputText: inputText } = dexUtils.calculateValue(outputToken, outputValue, inputToken, pair, false);
    dispatch(actionUpdateFieldValue({
      name,
      inputText,
      inputValue,
      outputValue,
      outputText: newOutputText,
    }));
  } catch (e) {
    throw e;
  }
};

export const actionChangeWithdrawFeeValue = ({ newWithdrawFeeValue }) => async (dispatch, getState) => {
  try {
    new Validator('newWithdrawFeeValue', newWithdrawFeeValue).required().string();
    const state = getState();
    const { name } = mergeInputSelector(state);
    dispatch(actionUpdateFieldValue({
      name,
      withdrawFeeValue: newWithdrawFeeValue,
    }));
  } catch (e) {
    throw e;
  }
};

/**
 * @param {string} tabName
 */
export const actionChangeHistoryTab = ({ tabName }) => ({
  type: ACTION_NAMES.CHANGE_HISTORY_TAB,
  tabName
});

export const actionFetchContributeHistories = ({ isRefresh = false } = {}) => async (dispatch, getState) => {
  try {
    const state = getState();
    const account = accountSelector.defaultAccount(state);
    const { wallet, liquidity } = state;
    const fieldName = INPUT_FIELDS.ADD_POOL;
    let { storageHistories, originalContributes, offset } = liquidity[fieldName];
    const limit = LIMIT;
    offset = (isRefresh ? 0 : (offset + 1)) * limit;
    let {
      contributeHistories: newHistories,
      storageContributes: newStorageHistories,
      newOriginalContributes,
    } = await accountServices.getContributeHistories({ account, wallet, offset, limit, oldApiHistories: originalContributes });

    dispatch(actionUpdateFieldValue({
      name: fieldName,
      apiHistories: newHistories,
      storageHistories: uniqBy(newStorageHistories.concat(storageHistories), 'pairId'),
      offset,
      isEnd: newHistories.length < limit,
      originalContributes: uniqBy(newOriginalContributes.concat(originalContributes), 'id')
    }));
  } catch (error) {
    console.log('actionFetchContributeHistories error: ', error);
    throw error;
  }
  return true;
};

export const actionFetchWithdrawHistories = ({ isRefresh = false } = {}) => async (dispatch, getState) => {
  try {
    const state = getState();
    const account = accountSelector.defaultAccount(state);
    const { wallet, liquidity } = state;
    const fieldName = INPUT_FIELDS.REMOVE_POOL;
    let { storageHistories, apiHistories, offset } = liquidity[fieldName];
    const limit = LIMIT;
    offset = (isRefresh ? 0 : (offset + 1)) * limit;
    let {
      apiHistories: newHistories,
      spendingStorage: newStorageHistories
    } = await accountServices.getWithdrawLiquidityHistories({ account, wallet, offset, limit });

    dispatch(actionUpdateFieldValue({
      name: fieldName,
      apiHistories: uniqBy(apiHistories.concat(newHistories), 'id'),
      storageHistories: uniqBy(storageHistories.concat(newStorageHistories), 'id'),
      offset,
      isEnd: newHistories.length < limit,
    }));
  } catch (error) {
    console.log('actionFetchWithdrawHistories error: ', error);
    throw error;
  }
  return true;
};

export const actionFetchWithdrawFeeHistories = ({ isRefresh = false } = {}) => async (dispatch, getState) => {
  try {
    const state = getState();
    const account = accountSelector.defaultAccount(state);
    const { wallet, liquidity } = state;
    const field = INPUT_FIELDS.WITHDRAW;
    let { storageHistories, apiHistories, offset } = liquidity[field];
    const limit = LIMIT;
    offset = (isRefresh ? 0 : (offset + 1)) * limit;
    let {
      apiHistories: newHistories,
      spendingStorage: newStorageHistories
    } = await accountServices.getWithdrawLiquidityFeeHistories({ account, wallet, offset, limit });
    dispatch(actionUpdateFieldValue({
      name: field,
      apiHistories: uniqBy(apiHistories.concat(newHistories), 'id'),
      storageHistories: uniqBy(storageHistories.concat(newStorageHistories), 'id'),
      offset,
      isEnd: newHistories.length < limit,
    }));
  } catch (error) {
    console.log('actionFetchWithdrawHistories error: ', error);
    throw error;
  }
  return true;
};

export const actionFetchHistories = () => async (dispatch) => {
  try {
    batch(() => {
      dispatch(actionFetchContributeHistories());
      dispatch(actionFetchWithdrawHistories());
      dispatch(actionFetchWithdrawFeeHistories());
    });
  } catch (error) {
    throw error;
  }
};

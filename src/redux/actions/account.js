/* eslint-disable import/no-cycle */
import { PrivacyVersion, Validator } from 'incognito-chain-web-js/build/wallet';
import type from '@src/redux/types/account';
import walletType from '@src/redux/types/wallet';
import accountService from '@src/services/wallet/accountService';
import { getPassphrase } from '@src/services/wallet/passwordService';
import { reloadAccountList, reloadWallet } from '@src/redux/actions/wallet';
import AccountModel from '@src/models/account';
import {
  currentMasterKeySelector,
  masterlessKeyChainSelector,
  noMasterLessSelector,
} from '@src/redux/selectors/masterKey';
import { switchMasterKey, updateMasterKey } from '@src/redux/actions/masterKey';
import { storeWalletAccountIdsOnAPI } from '@services/wallet/WalletService';
import {
  accountSelector,
} from '@src/redux/selectors';
import { walletSelector } from '@src/redux/selectors/wallet';
import { PRV } from '@src/constants/common';
import { ExHandler } from '@src/services/exception';
import { getDefaultAccountWalletSelector } from '@src/redux/selectors/shared';
import {
  burnerAddressSelector,
  defaultAccountSelector,
} from '@src/redux/selectors/account';
import { defaultPTokensIDsSelector } from '@src/redux/selectors/token';
import { actionGetPDexV3Inst } from '@src/screens/PDexV3';
import { getBalance as getTokenBalance, setListToken } from './token';

/**
 *  return basic account object from its name like its KEY, not including account methods (please use accountWallet instead)
 *
 * @param {object} state redux state
 * @param {string} accountName name of account you wanna get
 */
const getBasicAccountObjectByName = (state) => (accountName) => {
  return accountSelector.getAccountByName(state)(accountName);
};

export const setAccount = (
  account = throw new Error('Account object is required'),
) => ({
  type: type.SET,
  data: account,
});

export const setListAccount = (
  accounts = throw new Error('Account array is required'),
) => {
  if (accounts && accounts.constructor !== Array) {
    throw new TypeError('Accounts must be an array');
  }
  return {
    type: type.SET_LIST,
    data: accounts,
  };
};

export const removeAccount = (account) => async (dispatch, getState) => {
  const state = getState();
  const wallet = walletSelector(state);
  try {
    if (!account) {
      new Error('Account is required');
    }
    if (!wallet) {
      throw new Error(
        'Wallet is not existed, can not remove account right now',
      );
    }
    try {
      await accountService.removeCacheBalance(account, wallet);
    } catch (error) {
      console.log('ERROR REMOVE CACHE STORAGE', error);
    }
    const { PrivateKey } = account;
    const { aesKey } = await getPassphrase();
    const masterKey = currentMasterKeySelector(state);
    const walletAccount = accountService.getAccount(account, wallet);
    const accountInfo = await walletAccount.getDeserializeInformation();
    if (!masterKey.deletedAccountIds) {
      masterKey.deletedAccountIds = [];
    }
    masterKey.deletedAccountIds.push(accountInfo.ID);
    wallet.deletedAccountIds = masterKey.deletedAccountIds;
    await accountService.removeAccount(PrivateKey, aesKey, wallet);
    await dispatch(updateMasterKey(masterKey));
    await dispatch({
      type: type.REMOVE_BY_PRIVATE_KEY,
      data: PrivateKey,
    });
    await dispatch(reloadWallet());
    return true;
  } catch (e) {
    console.log('REMOVE ACCOUNT ERROR', e);
    throw e;
  }
};

export const getBalanceStart = (accountName) => ({
  type: type.GET_BALANCE,
  data: accountName,
});

export const getBalanceFinish = (accountName) => ({
  type: type.GET_BALANCE_FINISH,
  data: accountName,
});

const setSignPublicKeyEncode = (signPublicKeyEncode) => {
  return {
    type: type.SET_SIGN_PUBLIC_KEY_ENCODE,
    signPublicKeyEncode,
  };
};

const updateDefaultAccount = (account) => {
  accountService.saveDefaultAccountToStorage(
    accountService.getAccountName(account),
  );
  return {
    type: type.SET_DEFAULT_ACCOUNT,
    data: account,
  };
};

export const actionSetSignPublicKeyEncode = (defaultAccount) => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const wallet = walletSelector(state);
    const account = defaultAccount || defaultAccountSelector(state);
    const signPublicKeyEncode = await accountService.getSignPublicKeyEncode({
      wallet,
      account,
    });
    console.log('signPublicKeyEncode', signPublicKeyEncode);
    if (signPublicKeyEncode) {
      dispatch(setSignPublicKeyEncode(signPublicKeyEncode));
    }
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionSetFetchingNFT = () => ({
  type: type.ACTION_FETCHING_NFT,
  data: { isFetching: true },
});

export const actionSetNFTTokenData = () => async (dispatch) => {
  try {
    dispatch(actionSetFetchingNFT());
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const nftPayload = await pDexV3Inst.getNFTTokenData({
      version: PrivacyVersion.ver2,
    });
    dispatch(actionFetchedNFT(nftPayload));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const setDefaultAccount = (account) => async (dispatch) => {
  try {
    await dispatch(updateDefaultAccount(account));
    let task = [
      dispatch(actionSetSignPublicKeyEncode(account)),
      dispatch(actionSetNFTTokenData(account)),
    ];
    await Promise.all(task);
  } catch (e) {
    new ExHandler(e).showErrorToast();
  }
};

export const getBalance = (account) => async (dispatch, getState) => {
  let balance = 0;
  try {
    if (!account) throw new Error('Account object is required');
    const state = getState();
    await dispatch(getBalanceStart(account?.name));
    const wallet = walletSelector(state);
    if (!wallet) {
      throw new Error('Wallet is not exist');
    }
    balance = await accountService.getBalance({
      account,
      wallet,
      tokenID: PRV.id,
      version: PrivacyVersion.ver2,
    });
    const accountMerge = {
      ...account,
      value: balance,
    };
    await dispatch(setAccount(accountMerge));
  } catch (e) {
    account &&
      dispatch(
        setAccount({
          ...account,
          value: null,
        }),
      );
    throw e;
  } finally {
    dispatch(getBalanceFinish(account?.name));
  }
  return balance ?? 0;
};

export const reloadBalance = () => async (dispatch, getState) => {
  const state = getState();
  const account = accountSelector.defaultAccountSelector(state);
  await dispatch(getBalance(account));
};

export const followDefaultTokens = (account) => async (dispatch, getState) => {
  try {
    const state = getState();
    const wallet = walletSelector(state);
    if (!account) {
      throw new Error('Account object is required');
    }
    if (!wallet) {
      throw new Error('Wallet is not exist');
    }
    const defaultTokens = defaultPTokensIDsSelector(state);
    await accountService.addFollowingTokens(defaultTokens, account, wallet);
    // update wallet object to store
    await dispatch({
      type: walletType.SET,
      data: wallet,
    });
    return defaultTokens;
  } catch (error) {
    console.log('ACCOUNT-followDefaultTokens error', error);
    throw error;
  }
};

export const actionSwitchAccountFetching = () => ({
  type: type.ACTION_SWITCH_ACCOUNT_FETCHING,
});

export const actionSwitchAccountFetched = () => ({
  type: type.ACTION_SWITCH_ACCOUNT_FETCHED,
});

export const actionSwitchAccountFetchFail = () => ({
  type: type.ACTION_SWITCH_ACCOUNT_FETCH_FAIL,
});

export const actionSwitchAccount = (
  accountName,
  shouldLoadBalance = true,
) => async (dispatch, getState) => {
  try {
    new Validator('actionSwitchAccount-accountName', accountName)
      .required()
      .string();
    new Validator(
      'actionSwitchAccount-shouldLoadBalance',
      shouldLoadBalance,
    ).boolean();
    const state = getState();
    const account = accountSelector.getAccountByName(state)(accountName);
    const defaultAccountName = accountSelector.defaultAccountNameSelector(
      state,
    );
    if (defaultAccountName !== account?.name) {
      await dispatch(setDefaultAccount(account));
    }
    await dispatch(actionReloadFollowingToken(shouldLoadBalance));
    return account;
  } catch (error) {
    throw error;
  }
};

export const actionReloadFollowingToken = (shouldLoadBalance = true) => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const wallet = walletSelector(state);
    const account = accountSelector.defaultAccountSelector(state);
    const accountWallet = getDefaultAccountWalletSelector(state);
    let followed = await accountService.getFollowingTokens(account, wallet);
    await accountWallet.submitOTAKey();
    dispatch(actionFetchBurnerAddress());
    if (shouldLoadBalance) {
      const keyInfo = await accountWallet.getKeyInfo({
        version: PrivacyVersion.ver2,
      });
      const isFollowedDefaultTokens = await accountWallet.isFollowedDefaultTokens();
      if (!isFollowedDefaultTokens) {
        const coinIDs = keyInfo.coinindex
          ? Object.keys(keyInfo.coinindex).map((tokenID) => tokenID)
          : [];
        const pTokensIDs = defaultPTokensIDsSelector(state);
        let tokenIDs = [...pTokensIDs, ...coinIDs];
        await accountWallet.followingDefaultTokens({
          tokenIDs,
        });
        followed = await accountService.getFollowingTokens(account, wallet);
      }
      dispatch(getBalance(account));
      followed.forEach((token) => {
        try {
          dispatch(getTokenBalance(token?.id));
        } catch (error) {
          console.log('error', token?.id);
        }
      });
    }
    await dispatch(setListToken(followed));
    return followed;
  } catch (error) {
    throw error;
  }
};

export const actionLoadAllBalance = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const accounts = accountSelector.listAccount(state);
    await new Promise.all(
      accounts.map(async (account) => await dispatch(getBalance(account))),
    );
  } catch (error) {
    throw Error(error);
  }
};

export const actionFetchingCreateAccount = () => ({
  type: type.ACTION_FETCHING_CREATE_ACCOUNT,
});

export const actionFetchedCreateAccount = () => ({
  type: type.ACTION_FETCHED_CREATE_ACCOUNT,
});

export const actionFetchFailCreateAccount = () => ({
  type: type.ACTION_FETCH_FAIL_CREATE_ACCOUNT,
});

export const actionFetchCreateAccount = ({ accountName }) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const create = accountSelector.createAccountSelector(state);
  let wallet = walletSelector(state);
  if (!!create || !accountName || !wallet) {
    return;
  }
  try {
    await dispatch(actionFetchingCreateAccount());
    const account = await accountService.createAccount(accountName, wallet);
    const serializedAccount = new AccountModel(
      accountService.toSerializedAccountObj(account),
    );
    await dispatch(reloadAccountList());
    await dispatch(followDefaultTokens(serializedAccount));
    await dispatch(actionFetchedCreateAccount());
    await dispatch(actionSwitchAccount(serializedAccount?.name, true));
    await storeWalletAccountIdsOnAPI(wallet);
    return serializedAccount;
  } catch (error) {
    console.log('CREATE ACCOUNT ERROR', error);
    await dispatch(actionFetchFailCreateAccount());
    throw error;
  }
};

export const actionFetchingImportAccount = () => ({
  type: type.ACTION_FETCHING_IMPORT_ACCOUNT,
});

export const actionFetchedImportAccount = () => ({
  type: type.ACTION_FETCHED_IMPORT_ACCOUNT,
});

export const actionFetchFailImportAccount = () => ({
  type: type.ACTION_FETCH_FAIL_IMPORT_ACCOUNT,
});

export const actionFetchImportAccount = ({ accountName, privateKey }) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const importAccount = accountSelector.importAccountSelector(state);
  const masterless = masterlessKeyChainSelector(state);
  const masterKeys = noMasterLessSelector(state);
  let selectedMasterKey = masterless;
  if (!!importAccount || !accountName || !privateKey) {
    return;
  }
  try {
    await dispatch(actionFetchingImportAccount());
    const { aesKey } = await getPassphrase();
    for (const masterKey of masterKeys) {
      try {
        const isCreated = await masterKey.wallet.hasCreatedAccount(privateKey);
        if (isCreated) {
          selectedMasterKey = masterKey;
          break;
        }
      } catch (e) {
        console.debug('CHECK CREATED ERROR', e);
      }
    }
    let wallet = await selectedMasterKey.wallet;
    const isImported = await accountService.importAccount(
      privateKey,
      accountName,
      aesKey,
      wallet,
    );
    if (isImported) {
      await dispatch(switchMasterKey(selectedMasterKey.name));
      const accountList = await dispatch(reloadAccountList());
      const account = accountList.find(
        (acc) => acc?.name === accountName || acc?.AccountName === accountName,
      );
      if (account) {
        await dispatch(followDefaultTokens(account));
        await dispatch(actionSwitchAccount(account?.name, true));
        await dispatch(actionFetchedImportAccount());
      }
      if (selectedMasterKey !== masterless) {
        await storeWalletAccountIdsOnAPI(wallet);
      }
    } else {
      throw new Error('Import keychain error');
    }
    return isImported;
  } catch (error) {
    await dispatch(actionFetchFailImportAccount());
    throw error;
  }
};

export const actionFetchBurnerAddress = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const burnerAddress = burnerAddressSelector(state);
    if (burnerAddress) {
      return;
    }
    const account = getDefaultAccountWalletSelector(state);
    const payload = await account.getBurnerAddress();
    await dispatch({
      type: type.ACTION_GET_BURNER_ADDRESS,
      payload,
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionFetchedNFT = (payload) => ({
  type: type.ACTION_FETCHED_NFT,
  payload,
});

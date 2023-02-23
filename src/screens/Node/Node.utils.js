/* eslint-disable no-empty */
// eslint-disable-next-line import/no-cycle
import LocalDatabase from '@utils/LocalDatabase';
// eslint-disable-next-line import/no-cycle
import Device, {MAX_ERROR_COUNT, VALIDATOR_STATUS} from '@models/device';
// eslint-disable-next-line import/no-cycle
import NodeService from '@services/NodeService';
// eslint-disable-next-line import/no-cycle
import APIService from '@src/services/api/miner/APIService';
import LogManager from '@src/services/LogManager';
import { map, isEmpty, isNumber, forEach, uniq, some } from 'lodash';
import { getTransactionByHash } from '@services/wallet/RpcClientService';
// eslint-disable-next-line import/no-cycle
import tokenService, { PRV } from '@services/wallet/tokenService';
// eslint-disable-next-line import/no-cycle
import { PRV_ID } from '@screens/Dex/constants';
import { getTokenList } from '@services/api/token';
// eslint-disable-next-line import/no-cycle
import { parseNodeRewardsToArray } from '@screens/Node/utils';
import DeviceInfo from 'react-native-device-info';
import Util from '@utils/Util';
import { CONSTANT_CONFIGS } from '@src/constants';
import storage from '@services/storage';
import { listAllMasterKeyAccounts } from '@src/redux/selectors/masterKey';
import { getPNodeBackLog } from '@services/api/device';
// eslint-disable-next-line import/no-cycle
import VirtualNodeService from '@services/VirtualNodeService';
import convert from '@src/utils/convert';
import BigNumber from 'bignumber.js';
import { MAX_FEE_PER_TX } from '@src/components/EstimateFee/EstimateFee.utils';

export const ERROR_MESSAGE_PRV_BALANCE = 'Insufficient PRV balance to cover network fee.';
export const checkIfVerifyCodeIsExisting = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if the current list is existing
      // Check next qrcode === current qrcode with verifyProductCode
      // No need to show
      let list = (await LocalDatabase.getListDevices()) || [];
      let verifyProductCode = await LocalDatabase.getVerifyCode();
      const deviceList = [];
      //did remove verifyCodeList dont use
      list.forEach(element => {
        deviceList.push(element?.product_name);
      });
      console.log('Verify code in Home node ' + verifyProductCode);
      if (verifyProductCode && verifyProductCode !== '') {
        console.log('Verify code in Home node ' + verifyProductCode);
        let result = await NodeService.verifyProductCode(verifyProductCode);
        console.log('Verifing process check code in Home node to API: ' + LogManager.parseJsonObjectToJsonString(result));
        // We also add tracking log
        await APIService.trackLog({
          action: 'tracking_node_devices', message: 'Tracking node devices info for better supportable', rawData: JSON.stringify({
            deviceList: deviceList || [],
            verifyProductCode: verifyProductCode || 'Empty',
            result: result || {}
          }), status: 1
        });
        if (result && result?.verify_code && result?.verify_code === verifyProductCode) { // VerifyCode the same and product_name in list
          resolve({ showModal: true, verifyProductCode });
          return;
        }
      } else {
        // Force eventhough the same
        await LocalDatabase.saveVerifyCode('');
      }
      resolve({ showModal: false, verifyProductCode: '' });
    } catch (e) {
      reject(e);
    }
  });
};

// Func support for VNode
// Get Total VNode dont have BLSKey | PublicKey
export const getTotalVNodeNotHaveBlsKey = async () => {
  let listDevice = await LocalDatabase.getListDevices();
  listDevice = map(listDevice, item => Device.getInstance(item));
  let hasVNode        = false;
  let vNodeNotHaveBLS = 0;
  listDevice.forEach(item => {
    if (item.IsVNode) {
      hasVNode = true;
      if (isEmpty(item.PublicKeyMining) || isEmpty(item.PublicKey)) {
        vNodeNotHaveBLS++;
      }
    }
  });
  return {
    hasVNode,
    vNodeNotHaveBLS,
    hasNode: listDevice.length > 0,
  };
};

// Update Node Info
// support for VNode and VNode
export const combineNode = async (device, listAccount, newBLSKey) => {
  device.Account = listAccount.find(item => item.BLSPublicKey === newBLSKey);
  if (device.Account) {
    device.ValidatorKey = device.Account.ValidatorKey;
    if (device?.Account?.PublicKeyCheckEncode && !device.PublicKey) {
      device.PublicKey = device.Account.PublicKeyCheckEncode;
    }
  }
  if (device.SelfUnstakeTx) {
    console.debug('CHECK UNSTAKE TX STATUS', device.SelfUnstakeTx, device.Name);
    try {
      const res = await getTransactionByHash(device.SelfUnstakeTx);
      console.debug('CHECK UNSTAKE TX STATUS RESPONSE', res, device.Name);

      if (res.isInBlock && !device.IsAutoStake) {
        device.SelfUnstakeTx = null;
      } else if (res.err) {
        if (!isNumber(device.SelfUnstakeTxErrorCount)) {
          device.SelfUnstakeTxErrorCount = MAX_ERROR_COUNT;
        }

        if (device.SelfUnstakeTxErrorCount <= 0) {
          device.SelfUnstakeTx = null;
        } else {
          device.SelfUnstakeTxErrorCount = device.SelfUnstakeTxErrorCount - 1;
        }
      }
    } catch {
      device.SelfUnstakeTx = null;
    }
  }

  if (device.SelfStakeTx) {
    console.debug('CHECK STAKE TX STATUS', device.SelfStakeTx, device.Name);
    try {
      const res = await getTransactionByHash(device.SelfStakeTx);
      if (res.isInBlock && device.IsAutoStake) {
        device.SelfStakeTx = null;
      } else if (res.err) {
        if (!isNumber(device.SelfStakeTxErrorCount)) {
          device.SelfStakeTxErrorCount = MAX_ERROR_COUNT;
        }

        if (device.SelfStakeTxErrorCount <= 0) {
          device.SelfStakeTx = null;
        } else {
          device.SelfStakeTxErrorCount = device.SelfStakeTxErrorCount - 1;
        }
      }
    } catch {
      device.SelfStakeTx = null;
    }
  }
  return device;
};

// Old Node stuck in last round, should not show rewards on app
const checkOldNodeStuckReward = (nodeInfo) => {
  const IsInAutoStaking = nodeInfo?.IsInAutoStaking;
  const IsAutoStake     = nodeInfo?.IsAutoStake;
  const IsUnstaked      = nodeInfo?.IsUnstaked;
  const IsStaked        = nodeInfo?.IsStaked;
  return !IsInAutoStaking && !IsAutoStake && IsUnstaked && IsStaked;
};

/*
* Return value
// *All tokens in all rewards
// @allTokens = [{ displayName, hasIcon, id, isVerified, isVerified, name, pDecimals, symbol }]
*
// *All Nodes rewards
// Exp: { 0000000000004: 150 }
// @allRewards = { tokenId: tokenReward }
*
// *Check have rewards
// @noRewards = { boolean }
*
// *PRV rewards from Node
// Exp: { 0000000000004: 150 }
// @prvRewards = { PRV_ID: PRV_REWARD }
* */
export const parseRewards = async (nodesInfo, skipAllTokens = false) => {
  let tokenIds    = [];
  let rewardsList = [];
  let allTokens   = [PRV];
  let allRewards  = { [PRV_ID]: 0 };

  forEach(nodesInfo, item => {
    // Old Node stuck in last round, should not show rewards on app
    const isStuckLastRound = checkOldNodeStuckReward(item);
    if (!isStuckLastRound) {
      rewardsList = rewardsList.concat(item?.Rewards || []);
    }
  });

  forEach(rewardsList, (reward) => {
    const tokenId     = reward?.TokenID;
    const rewardValue = reward?.Amount || 0;
    tokenIds.push(tokenId);
    if (allRewards.hasOwnProperty(tokenId)) {
      allRewards[tokenId] += rewardValue || 0;
    } else {
      // Remove another tokens are not PRV have reward = 0
      if (rewardValue && rewardValue > 0) {
        allRewards[tokenId] = rewardValue;
      }
    }
  });

  const prvRewards = { [PRV_ID]: allRewards[PRV_ID] };
  // Need get AllTokens in get Nodes Info from API, skipAllTokens = false
  if (!skipAllTokens) {
    tokenIds = uniq(tokenIds);
    let tokenDict = tokenService.flatTokens(allTokens);
    if (tokenIds.some(id => !tokenDict[id])) {
      const pTokens = await getTokenList();
      allTokens = tokenService.mergeTokens(allTokens, pTokens);
      tokenDict = tokenService.flatTokens(allTokens);
      if (tokenIds.some(id => !tokenDict[id])) {
        const chainTokens = await tokenService.getPrivacyTokens();
        allTokens = tokenService.mergeTokens(chainTokens, allTokens);
      }
    }
  }
  return {
    allTokens,
    allRewards,
    prvRewards
  };
};

const checkValidNodeWithdraw = (device) => {
  // PNode check can withdraw when PRV > 0, another rewards > 0 cant withdraw
  if (!device?.IsFundedUnstaked && device?.IsPNode) {
    return some(device.Rewards, rewards => rewards > 100);
  }
  return some(device.AllRewards, rewards => rewards?.balance > 0);
};

export const checkValidNode = (device) => (
  device.AccountName
  && !isEmpty(device.AllRewards)
  && checkValidNodeWithdraw(device)
);

export const getValidNodes = (listDevice) => {
  if (!listDevice || listDevice.length <= 0) return [];
  return listDevice.filter(checkValidNode);
};


export const checkNoRewards = (nodeRewards, listDevice) => {
  let noRewards = true;
  if (nodeRewards && nodeRewards.length > 0) {
    forEach(nodeRewards, (reward) => {
      // Just need 1 rewards > 0, open flag noRewards = false
      // help enable button withdraw
      if (reward?.balance > 0) {
        noRewards = false;
      }
    });
  }
  const validNodes = getValidNodes(listDevice);
  noRewards = noRewards || validNodes.length === 0;
  return noRewards;
};

export const combineNodesInfoToObject = (nodesInfo) => {
  let object = {};
  nodesInfo.forEach(item => {
    object[isEmpty(item?.BLS) ? item?.QRCode : item?.BLS] = item;
  });
  return object;
};

// Format Node Info get from API
export const formatNodeItemFromApi = async (device, listNodeObject, allTokens, listAccount) => {
  const nodeItem = listNodeObject[
    device.IsVNode ? device.PublicKeyMining : device.QRCode
  ];
  if (!nodeItem) return device;
  const {
    IsInCommittee,
    IsInAutoStaking,
    IsAutoStake,
    PendingUnstake,
    IsUnstaked,
    PendingWithdrawal,
    IsSlash,
    Description
  } = nodeItem;

  if (IsInCommittee) {
    // Node is in Committee
    device.Status = VALIDATOR_STATUS.WORKING;
  } else if ( IsInAutoStaking ) {
    // Node is waiting to join Committee
    device.Status = VALIDATOR_STATUS.WAITING;
  } else {
    // Nothing to show status => gray
    device.Status = null;
  }

  device.Slashing = {
    isSlash: IsSlash,
    desc: Description,
  };

  device.IsAutoStake = IsAutoStake;

  if (device.IsPNode) {

    // PNode unstaked => IsUnstaked = true
    device.IsFundedUnstakedRequestProcessed = IsUnstaked;

    // PNode waiting unstake => PendingUnstake = true
    device.IsFundedUnstaking                = PendingUnstake;

    // PendingWithdrawal === true
    // PNode is requesting Withdraw => cant withdraw, disable button withdraw
    // PendingWithdrawal === false
    // PNode is not request withdraw => can withdraw
    // It's mean IsFundedStakeWithdrawable === true => can withdraw, opposite
    device.IsFundedStakeWithdrawable = !PendingWithdrawal;

    // PNode has been Unstaked
    if (device.IsFundedUnstakedRequestProcessed) {
      // always allow withdraw
      device.IsFundedStakeWithdrawable = true;
      device.StakerAddress = null;
      let blsKey = device.PublicKeyMining;

      // IsFundedUnstakedRequestProcessed = true => PNode unstaked
      // IsFundedAutoStake = false =>
      if (device.IsFundedUnstaked && blsKey) {
        device = await combineNode(device, listAccount, blsKey);
      }
    }
  }

  const {
    allRewards,
    prvRewards
  } = await parseRewards([nodeItem], true);
  device.Rewards    = prvRewards;
  device.AllRewards = parseNodeRewardsToArray(allRewards, allTokens);

  return device;
};

export const findNodeIndexByProductId = (listDevice, productId) => {
  return listDevice.findIndex(item => item.ProductId === productId);
};

export const getNodeUserParams = async () => {
  const deviceId = DeviceInfo.getUniqueId();
  const params = {
    email: deviceId + '@minerX.com',
    password: Util.hashCode(deviceId)
  };
  let response = await APIService.signUp(params);
  if (response?.status !== 1) {
    response = await APIService.signIn(params);
  }
  return response;
};

export const getNodeToken = async () => {
  const { data } = await getNodeUserParams();
  const {
    access_token,
    refresh_token
  } = data || {};
  return {
    accessToken: access_token,
    refreshToken: refresh_token
  };
};

export const SSHCommandUpdateNode = (accessToken, refreshToken) => {
  const url_amzn      = 'https://incognito-org.s3.amazonaws.com/ssh/lan_setup.py';
  const url_service   = CONSTANT_CONFIGS.URL_SERVICE_UPDATE_FIRMWARE;
  const wget          = `wget -q ${url_amzn} -O lan_setup.py && python lan_setup.py -u 25484 -t ${accessToken} -r ${refreshToken} -l ${url_service}`;
  return `tmux split-window -v -t brain:brain.0 && tmux send-keys -t brain:brain.1 '${wget}' C-m`;
};

export const SSHCommandClearTrashDataNode = () => {
  const wget = 'rm /home/nuc/aos/data/product_id.json';
  return `tmux split-window -v -t brain:brain.0 && tmux send-keys -t brain:brain.1 '${wget}' C-m`;
};

/** 208 KB ~= 212992 byte */
export const checkSpaceSaveNode = async () => {
  try {
    let str = Date.now().toString();
    const maxLoop = 14;
    let index = 0;
    while (index < maxLoop) {
      str += str;
      index++;
    }
    await storage.setItem('TEST_STORAGE', str);
    await storage.removeItem('TEST_STORAGE');
  } catch (e) {
    console.debug('checkSpaceSaveNode error: ', e);
    throw e;
  }
};

export const findAccountFromListAccounts = ({ accounts, address }) => {
  return accounts.find(item => address && (item.PaymentAddress === address || item.PaymentAddressV1 === address));
};

const isPRVEnoughByDevice = async (device, accountWallet, wallet) => {
  const PRVBalance = await device.balance(accountWallet, wallet);
  const prvBalanceOriginal = convert.toNumber(PRVBalance) || 0;
  if (new BigNumber(prvBalanceOriginal).isLessThan(MAX_FEE_PER_TX)) {
    return false;
  } else {
    return true;
  }
};

export const getNodeBLSKey = async (device, listAccount) => {
  let blsKey = '';
  let account = null;
  try {
    // account = listAccount.find(item => device?.PaymentAddress && item.PaymentAddress === device?.PaymentAddress);
    account = findAccountFromListAccounts({
      accounts: listAccount,
      address: device?.PaymentAddress,
    });
    /** case VNode: first call RPC get blsKey */
    if (!device?.IsPNode) {
      blsKey = await VirtualNodeService.getPublicKeyMining(device);
      return { blsKey, account };
    }
    if (account) {
      return { blsKey: device.Account.BLSPublicKey, account };
    }
    if (device?.IsPNode) {
      const result = await getPNodeBackLog(device);
      blsKey = result?.description?.getmininginfo?.Result?.MiningPublickey || '';
    }
  } catch (error) {
    console.log(error);
  }

  return { blsKey, account };
};

export const checkAccountBalanceForNode = async (device, listAccount) => {
  let isValid = true;
  let errorMessage = undefined;
  try {
    // account = listAccount.find(item => device?.PaymentAddress && item.PaymentAddress === device?.PaymentAddress);
    const accountWallet = findAccountFromListAccounts({
      accounts: listAccount,
      address: device?.PaymentAddress,
    });
    const wallet =  accountWallet.Wallet;

    //Vnode case
    if (device.IsVNode) {
      if (device.IsFundedUnstaked) {
        if (!isPRVEnoughByDevice(device, accountWallet, wallet)) {
          isValid = false;
          errorMessage = ERROR_MESSAGE_PRV_BALANCE;
        }
      } else {
        isValid = false;
        errorMessage = 'vNode IsFundedUnstaked';
      }
    } else if (device.IsPNode ) {
      //Pnode case
      if (device?.IsFundedStakeWithdrawable) {
        if (!isPRVEnoughByDevice(device, accountWallet, wallet)) {
          isValid = false;
          errorMessage = ERROR_MESSAGE_PRV_BALANCE;
        } 
      } else {
        isValid = false;
        errorMessage = 'pNode IsFundedStakeWithdrawable';
      }
    } else {
      isValid = false;
      errorMessage = 'node invalid';
    } 
  } catch (error) {
    console.log(error);
    isValid = false;
    errorMessage = error.message || 'Something went wrong';
  } finally {
  }

  return {
    device,
    isValid,
    errorMessage,
    accountName: device.AccountName || device.Name || ''
  };
};

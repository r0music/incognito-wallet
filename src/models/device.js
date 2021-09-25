import { DEVICES } from '@src/constants/miner';
// eslint-disable-next-line import/no-cycle
import accountService from '@src/services/wallet/accountService';
import { isEmpty } from 'lodash';
import { COLORS } from '@src/styles';
// eslint-disable-next-line import/no-cycle
import { PRV_ID } from '@screens/Dex/constants';
// eslint-disable-next-line import/no-cycle
import { parseNodeRewardsToArray } from '@screens/Node/utils';
// eslint-disable-next-line import/no-cycle
import { PRV } from '@services/wallet/tokenService';

export const DEVICE_STATUS = {
  CODE_UNKNOWN : -1,
  CODE_STOP : 4,
  CODE_PENDING : 5,
  CODE_START : 2,
  CODE_MINING : 3,
  CODE_SYNCING : 1,
  CODE_OFFLINE : -2
};
export const DATA_INFO = [{'status':'ready', 'message':'online','code':DEVICE_STATUS.CODE_START},
  {'status':'syncing',  'message':__DEV__?'syncing_queueing':'queueing','code':DEVICE_STATUS.CODE_SYNCING},
  {'status':'mining', 'message':'earning','code':DEVICE_STATUS.CODE_MINING},
  {'status':'offline', 'message':__DEV__?'offline_online':'online','code':DEVICE_STATUS.CODE_START},
  {'status':'pending','message':__DEV__?'pending_queueing':'queueing','code':DEVICE_STATUS.CODE_PENDING},
  {'status':'notmining', 'message':__DEV__?'notmining_online':'online','code':DEVICE_STATUS.CODE_START},
  {'status':'waiting', 'message':__DEV__?'waiting_queueing':'queueing','code':DEVICE_STATUS.CODE_MINING}];
export const template = {
  minerInfo:{
    account:{},
    isCallStaked:false,
    qrCodeDeviceId: '',
    PaymentAddress: '',
    StakerAddress: '',
    validatorKey: '',
    Commission:1,
    isUpdating:false,
    publicKey: '',
    rewards: {},
    allRewards: parseNodeRewardsToArray({ [PRV_ID]: 0 }, [PRV]),
    isOnline: 0,
    accountName: '',
    stakeTx: '',
    latestFirmware: '',
    slashing: {
      isSlash: false,
      desc: ''
    }
  },
  keyInfo:{
    publicKeyMining:'',
    publicKeyRole:''
  },
  status:{
    code: -1,
    message:'Waiting'
  },
  is_checkin: 0,
  linked: false,
  platform: 'MINER',
  product_id: '',
  product_name: 'Miner',
  verify_code:'',
  user_id:-1,
  deleted:false,
  product_type:DEVICES.MINER_TYPE
};
export const VALIDATOR_STATUS = {
  WAITING: 'waiting',
  WORKING: 'committee'
};
export const MAX_ERROR_COUNT = 5;

export default class Device {
  static CODE_STOP    = DEVICE_STATUS.CODE_STOP;
  static CODE_PENDING = DEVICE_STATUS.CODE_PENDING;
  static CODE_START   = DEVICE_STATUS.CODE_START;
  static CODE_MINING  = DEVICE_STATUS.CODE_MINING;
  static CODE_SYNCING = DEVICE_STATUS.CODE_SYNCING;

  constructor(data){
    this.data = {...template, ...data,status:template.status};
  }

  isUpdatingFirmware =()=>{
    return this.data.minerInfo?.isUpdating??false;
  };

  get PublicKeyMining(){
    return this.data.keyInfo?.publicKeyMining;
  }

  set PublicKeyMining(publicKeyMining:String){
    this.data['keyInfo'] = {
      ...this.data.keyInfo,
      publicKeyMining: publicKeyMining
    };
  }

  set PublicKey(publicKey) {
    this.data.minerInfo.publicKey = publicKey;
  }

  get PublicKey() {
    return this.data.minerInfo.publicKey;
  }

  setIsOnline(result) {
    this.data.minerInfo.isOnline = result;
  }

  set Rewards(rewards) {
    this.data.minerInfo.rewards = rewards;
  }

  // Rewards PRV
  get Rewards() {
    return this.data.minerInfo.rewards;
  }

  set AllRewards(rewards) {
    this.data.minerInfo.allRewards = rewards;
  }

  // All Node rewards include PRV, BTC, ....
  get AllRewards() {
    return this.data.minerInfo.allRewards || parseNodeRewardsToArray({ [PRV_ID]: 0 }, [PRV]);
  }

  get Account() {
    return this.data?.minerInfo?.account;
  }

  set Account(account) {
    this.data.minerInfo.account = account;
  }

  get AccountName() {
    return this.data.minerInfo.account?.AccountName;
  }

  set SelfStakeTx(tx) {
    this.data.minerInfo.stakeTx = tx;
    this.SelfStakeTxErrorCount = undefined;
  }

  get SelfStakeTx() {
    return this.data.minerInfo.stakeTx;
  }

  set SelfStakeTxErrorCount(newCount) {
    this.data.minerInfo.stakeTxErrorCount = newCount;
  }

  get SelfStakeTxErrorCount() {
    return this.data.minerInfo.stakeTxErrorCount;
  }

  get IsSelfStaked() {
    return !!this.Status || !!this.SelfStakeTx;
  }

  set IsFundedAutoStake(result) {
    this.data.minerInfo.isFundedAutoStake = result;
  }

  get IsFundedAutoStake() {
    return this.data.minerInfo.isFundedAutoStake;
  }

  set IsAutoStake(result) {
    this.data.minerInfo.isAutoStake = result;
  }

  get IsAutoStake() {
    return this.data.minerInfo.isAutoStake;
  }

  set SelfUnstakeTx(txId) {
    this.data.minerInfo.unstakeTx = txId;
    this.SelfUnstakeTxErrorCount = MAX_ERROR_COUNT;
  }

  get SelfUnstakeTx() {
    return this.data.minerInfo.unstakeTx;
  }

  set SelfUnstakeTxErrorCount(newCount) {
    this.data.minerInfo.unstakeTxErrorCount = newCount;
  }

  get SelfUnstakeTxErrorCount() {
    return this.data.minerInfo.unstakeTxErrorCount;
  }

  set ValidatorKey(key) {
    this.data.minerInfo.validatorKey = key;
  }

  get ValidatorKey() {
    return this.data.minerInfo.validatorKey || this.Account?.ValidatorKey;
  }

  get IsInAutoStakingList() {
    return !!this.Status;
  }

  get IsSelfUnstaking() {
    return this.SelfUnstakeTx || (this.IsInAutoStakingList && !this.IsAutoStake);
  }

  set IsFundedStakeWithdrawable(bool) {
    this.data.minerInfo.isDrawable = bool;
  }

  // *PNode requesting withdraw,
  // waiting approve withdraw IsFundedStakeWithdrawable = false, disable button withdraw
  // *PNode has rewards and not requesting withdraw,
  // return IsFundedStakeWithdrawable = true, enable button withdraw
  get IsFundedStakeWithdrawable() {
    return this.data.minerInfo.isDrawable;
  }

  set FundedUnstakeStatus(status) {
    this.data.minerInfo.unstakeStatus = status;
  }

  get FundedUnstakeStatus() {
    return this.data.minerInfo.unstakeStatus;
  }

  get IsFundedUnstaked() {
    return this.IsFundedUnstakedRequestProcessed && !this.IsFundedAutoStake;
  }

  set IsFundedUnstakedRequestProcessed(status) {
    this.data.minerInfo.isUnstaked = status;
  }

  // PNode has been approved Unstaked return true
  get IsFundedUnstakedRequestProcessed() {
    return this.data.minerInfo.isUnstaked;
  }

  set IsFundedUnstaking(status) {
    this.data.minerInfo.pendingUnstake = status;
  }

  // PNode requesting Unstake and waiting approve unstake
  get IsFundedUnstaking() {
    return this.data.minerInfo.pendingUnstake;
  }

  get IsFundedStaked() {
    return this.data.minerInfo.Status === 2;
  }

  get IsFundedStaking() {
    return this.data.minerInfo.Status !== 2;
  }

  get Host(){
    return this.data.minerInfo?.ipAddress||'';
  }
  set Host(ip){
    this.data.minerInfo.ipAddress = ip;
  }
  get Port(){
    return this.data.minerInfo?.port||'';
  }
  set Port(port) {
    this.data.minerInfo.port = port;
  }

  get APIUrl(){
    if (!isEmpty(this.Host) && isEmpty(this.Port)) {
      return this.Host;
    }

    return !isEmpty(this.Host) && !isEmpty(this.Port) ? `${this.Host}:${this.Port}` : '';
  }

  set Status(status) {
    this.data.minerInfo.status = status;
  }

  get Status() {
    return this.data.minerInfo.status;
  }

  get Name(){
    if (this.Account) {
      return this.Account.AccountName;
    }

    return '-';
  }

  get MasterKey(){
    if (this.Account) {
      return this.Account.MasterKeyName;
    }

    return '-';
  }

  get Type(){
    return this.data.product_type || '';
  }

  balance = async(account,wallet)=>{
    return (!isEmpty(account) && !isEmpty(wallet) && await accountService.getBalance({
      account,
      wallet,
      tokenID: PRV_ID
    })) || 0;
  };

  // Not arbitrary use this function
  // This function just be call in @fetchAndSavingInfoNodeStake
  set ProductId(newProductId) {
    if (isEmpty(newProductId)) return;
    this.data.product_id = newProductId;
  }

  get ProductId() {
    return this.data.product_id ?? '';
  }

  get qrCodeDeviceId(){
    return this.data.minerInfo?.qrCodeDeviceId ?? '';
  }

  get QRCode() {
    return this.data.minerInfo?.qrCodeDeviceId ?? '';
  }

  set Firmware(firmware) {
    this.data.minerInfo.firmware = firmware;
  }

  get Firmware() {
    return this.data.minerInfo?.firmware ?? '';
  }

  set LatestFirmware(firmware) {
    this.data.minerInfo.latestFirmware = firmware;
  }

  get LatestFirmware() {
    return this.data.minerInfo?.latestFirmware ?? '';
  }

  /** Update OS config with SSH */
  get IsUpdateFirmware() {
    // Node setup firebase
    const updateFirmwareNodeFirebase =
      !isEmpty(this.LatestFirmware)
      && !isEmpty(this.Firmware)
      && this.Firmware !== this.LatestFirmware;

    return this.AccountName
      && this.IsPNode
      && this.Host
      && (updateFirmwareNodeFirebase || this.IsSetupViaLan);
  }

  get PaymentAddress() {
    return this.data.minerInfo.account?.PaymentAddress || this.data.minerInfo.PaymentAddress;
  }

  get PaymentAddressFromServer(){
    return this.data.minerInfo?.PaymentAddress ?? '';
  }

  set PaymentAddressFromServer(paymentAddress) {
    this.data.minerInfo.PaymentAddress = paymentAddress;
  }

  get CommissionFromServer(){
    return this.data.minerInfo?.Commission ?? 1;
  }

  get IsPNode() {
    return this.Type === DEVICES.MINER_TYPE;
  }

  get IsVNode() {
    return this.Type === DEVICES.VIRTUAL_TYPE;
  }

  get StakerAddress() {
    return this.data.minerInfo.StakerAddress;
  }

  set StakerAddress(stakerAddress) {
    this.data.minerInfo.StakerAddress = stakerAddress;
  }

  get IsLinked() {
    return !!this.data.linked;
  }

  get IsSetupViaLan() {
    return this.ValidatorKey === this.ProductId;
  }

  toJSON(){
    return this.data;
  }

  static getInstance = (data=template):Device =>{
    return new Device(data);
  }


  get IsStaked() {
    if (this.IsPNode) {
      return ((this.IsFundedStaking || this.IsFundedStaked) && !this.IsFundedUnstaked) || this.IsSelfStaked;
    }

    return this.IsSelfStaked;
  }

  get IsUnstaking() {
    if (this.IsPNode) {
      if (this.IsFundedStaking) {
        return false;
      }

      if (this.IsFundedUnstaking) {
        return true;
      }

      if (this.IsFundedStaked && this.IsFundedUnstaked) {
        return this.IsSelfUnstaking;
      }

      return false;
    }

    return this.IsSelfUnstaking;
  }

  get IsUnstaked() {
    return !this.IsStaked;
  }

  get IsOnline() {
    return this.data.minerInfo.isOnline;
  }

  get IsOffline() {
    return this.IsOnline <= 0;
  }

  get IsWorking() {
    return this.Status === VALIDATOR_STATUS.WORKING;
  }

  get IsWaiting() {
    return this.Status === VALIDATOR_STATUS.WAITING;
  }

  get StatusColor() {
    if (this.IsOffline) {
      return COLORS.lightGrey1;
    }

    if (this.IsUnstaking) {
      return COLORS.orange;
    }

    if (this.IsWorking) {
      return COLORS.blue;
    }

    if (this.IsWaiting || this.IsStaked) {
      return COLORS.green2;
    }

    return COLORS.lightGrey1;
  }

  get IsStaking() {
    return !!this.SelfStakeTx;
  }

  get IsUnstakable() {
    if (this.IsPNode) {
      return !!this.Account && this.IsFundedStaked && !this.IsStaking && this.IsStaked && !this.IsUnstaking;
    }

    return !!this.Account && !this.IsStaking && this.IsStaked && !this.IsUnstaking;
  }

  get Slashing() {
    let slashing = this.data.minerInfo.slashing;
    if (!slashing) {
      slashing = { isSlash: false, desc: '' };
    }
    return slashing;
  }

  set Slashing({ isSlash, desc }) {
    this.data.minerInfo.slashing = {
      isSlash,
      desc
    };
  }

  get IsSlashing() {
    let slashing = this.data.minerInfo.slashing;
    if (!slashing) {
      slashing = { isSlash: false, desc: '' };
    }
    return slashing.isSlash;
  }
}

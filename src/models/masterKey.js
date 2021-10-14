import { Wallet } from 'incognito-chain-web-js/build/wallet';
import { initWallet, loadWallet } from '@services/wallet/WalletService';
import storage from '@services/storage';
import { getPassphrase } from '@services/wallet/passwordService';

class MasterKeyModel {
  static network = 'mainnet';

  constructor(data = {}) {
    this.name = data?.name;
    this.mnemonic = data?.passphrase;
    this.isActive = !!data?.isActive;
    this.deletedAccountIds = data?.deletedAccountIds || [];
  }

  static getStorageName(name) {
    return `$${MasterKeyModel.network}-master-${name.toLowerCase()}`;
  }

  getStorageName() {
    return MasterKeyModel.getStorageName(this.name);
  }

  /**
   * Load wallet from storage
   * @returns {Promise<Wallet>}
   */
  async loadWallet() {
    const rootName = this.name;
    const storageName = this.getStorageName();
    const rawData = await storage.getItem(storageName);
    const passphrase = await getPassphrase();
    let wallet;
    if (rawData) {
      wallet = await loadWallet(passphrase, storageName, rootName);
    }
    if (!wallet) {
      wallet = await initWallet(storageName, rootName);
    }
    this.mnemonic = wallet.Mnemonic;
    this.wallet = wallet;
    wallet.deletedAccountIds = this.deletedAccountIds || [];
    if (this.name.toLowerCase() === 'unlinked') {
      this.name = 'Masterless';
      wallet.Name = this.getStorageName();
      wallet.save();
    }
    wallet.Name = this.getStorageName();
    return wallet;
  }

  get noOfKeychains() {
    return this.wallet?.MasterAccount?.child.length || 0;
  }

  async getAccounts(deserialize = true) {
    if (!deserialize) {
      return this.wallet.MasterAccount.child;
    }

    const accountInfos = [];

    for (const account of this.wallet.MasterAccount.child) {
      const accountInfo = await account.getDeserializeInformation();
      accountInfo.Wallet = this.wallet;
      accountInfo.MasterKey = this;
      accountInfo.FullName = `${this.name}-${accountInfo.AccountName}`;
      accountInfos.push(accountInfo);
      accountInfo.MasterKeyName = this.name;
    }

    return accountInfos;
  }
}

export default MasterKeyModel;

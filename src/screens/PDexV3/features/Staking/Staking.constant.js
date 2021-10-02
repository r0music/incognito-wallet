const TYPES = {
  ACTION_FETCHING: '[pDexV3][staking] Fetching data',
  ACTION_FETCH_FAIL: '[pDexV3][staking] Fetch fail data',
  ACTION_UPDATE_DATA: '[pDexV3][staking] Action update data',
  ACTION_SET_INVEST_COIN: '[pDexV3][staking] Action set invest coin',
  ACTION_SET_WITHDRAW_INVEST_COIN: '[pDexV3][staking] Action set withdraw invest coin',
  ACTION_SET_WITHDRAW_REWARD_COIN: '[pDexV3][staking] Action set withdraw reward coin',
  ACTION_CHANGE_ACCOUNT: '[pDexV3][staking] Action change account',
  ACTION_FETCHING_HISTORIES: '[pDexV3][staking] Action update fetching histories',
  ACTION_FETCHED_HISTORIES: '[pDexV3][staking] Action update fetched histories',
  ACTION_UPDATE_HISTORIES: '[pDexV3][staking] Action update histories',
  ACTION_SET_HISTORIES_KEY: '[pDexV3][staking] Action set histories key',
  ACTION_UPDATE_FETCHING_POOL: '[pDexV3][staking] Action update fetching pool',
  ACTION_SET_POOL: '[pDexV3][staking] Action set pool',
};

export const STAKING_MESSAGES = {
  staking: 'Staking',
  stakingMore: 'Stake more',
  stakingNow: 'Stake now',
  withdraw: 'Withdraw',
  buyCrypto: 'Buy crypto',
  selectCoin: 'Select coin',
  stakeSymbol: symbol => `Stake ${symbol}`,
  withdrawSymbol: symbol => `Withdraw ${symbol}`,
  orderReview: 'Order preview',
  reward: 'Reward',
  histories: 'Histories',
  history: 'History',
  portfolio: 'Your portfolio',
  listCoins: 'List coins',
  stakeMore: 'Stake more',
  stakeNow: 'Stake now',
};

export const formConfigsInvest = {
  formName: 'FORM_INVEST',
  input: 'input'
};

export const formConfigsWithdrawInvest = {
  formName: 'FORM_WITHDRAW_INVEST',
  input: 'input'
};

export const formConfigsWithdrawReward = {
  formName: 'FORM_WITHDRAW_REWARD',
  input: 'input'
};

export const TABS = {
  ROOT_ID: 'staking-home',
  TAB_COINS: 'staking-coins',
  TAB_PORTFOLIO: 'staking-portfolio',
};

export default TYPES;

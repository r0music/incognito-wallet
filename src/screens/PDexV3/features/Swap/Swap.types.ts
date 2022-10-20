import { CONSTANT_COMMONS } from '@src/constants';

export interface IGroupNetwork {
  [key: string]: number[];
}

export type ExchangeData = {
  amountIn: number;
  amountInRaw: number;
  amountOut: number;
  amountOutRaw: number;
  appName: ExchangePlatformSupported | string;
  exchangeName: string;
  amountOutPreSlippage: string;
  fees: {
    amount: number;
    tokenid: string;
    amountInBuyToken: string;
  }[];
  routes: string[];
  incTokenID: string;
  feeAddress: string;
  callContract: string;
  callData: string;
  poolPairs?: string;
  impactAmount: string | number;
  networkID: number;
  networkName: string;
  feeAddressShardID: number;
};

export type ExchangeRawDetail = {
  AmountIn: string;
  AmountInRaw: string;
  AmountOut: string;
  AmountOutRaw: string;
  AppName: ExchangePlatformSupported | string;
  AmountOutPreSlippage: string;
  Fee: {
    amount: number;
    tokenid: string;
    amountInBuyToken: string;
  }[];
  FeeAddress: string;
  FeeAddressShardID: number;
  Paths: string[];
  CallContract: string;
  Calldata: string;
  PoolPairs?: string;
  ImpactAmount: string;
  RouteDebug: string[];
};

export type EstimateRawData = {
  [network: string]: ExchangeRawDetail[];
};

export type ExchangePlatformSupported =
  | 'incognito'
  | 'pancake'
  | 'uniswap'
  | 'curve'
  | 'spooky';

export const NetworkNameShorten = {
  INCOGNITO: 'inc',
  ETHEREUM: 'eth',
  POLYGON: 'plg',
  FANTOM: 'ftm',
  BINANCE_SMART_CHAIN: 'bsc',
};

// export type NetworkNameShorten = 'inc' | 'eth' | 'plg' | 'ftm' | 'bsc';

export const NetworkIdsMapping = {
  [NetworkNameShorten.INCOGNITO]: 0,
  [NetworkNameShorten.ETHEREUM]: 1,
  [NetworkNameShorten.BINANCE_SMART_CHAIN]: 2,
  [NetworkNameShorten.POLYGON]: 3,
  [NetworkNameShorten.FANTOM]: 4,
};

export const PANCAKE_SUPPORT_NETWORK = [
  CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BNB,
  CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BEP20,
];

export const UNISWAP_SUPPORT_NETWORK = [
  CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ETH,
  CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20,
  CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC,
  CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.POLYGON_ERC20,
];

export const CURVE_SUPPORT_NETWORK = [
  CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC,
  CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.POLYGON_ERC20,
];

export const SPOOKY_SUPPORT_NETWORK = [
  CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.FTM,
  CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.FANTOM_ERC20,
];

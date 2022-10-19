import { PRV_ID } from '@src/constants/common';
import {
  NETWORK_IDS_MAPPING,
  NETWORK_NAME_SUPPORTED,
  KEYS_PLATFORMS_SUPPORTED,
} from './Swap.constant';

import { ExchangeData, EstimateRawData, ExchangeRawDetail } from './Swap.types';

const parseExchangeSupport = (
  estimateData,
  sellToken,
  networkName,
): ExchangeData[] => {
  let exchangeSupport = [];
  let estimateFeeExchanges: ExchangeRawDetail[] = estimateData[networkName];
  if (estimateFeeExchanges) {
    let incTokenId = getIncognitoTokenId(
      sellToken,
      NETWORK_IDS_MAPPING[networkName],
    );
    if (Array.isArray(estimateFeeExchanges)) {
      exchangeSupport = estimateFeeExchanges.map((exchange) => {
        return parseExchangeDataModelResponse(
          exchange,
          networkName,
          NETWORK_IDS_MAPPING[networkName],
          incTokenId,
        );
      });
    }
  }

  return exchangeSupport;
};

const getIncognitoTokenId = (tokenModel, networkId) => {
  if (!tokenModel) return '';

  let incTokenId = tokenModel.tokenId;

  if (!tokenModel.listUnifiedToken) return incTokenId;
  if (tokenModel.isPUnifiedToken) {
    const childToken = tokenModel.listUnifiedToken.find(
      (token) => token.networkId === networkId,
    );
    incTokenId = childToken ? childToken.tokenId : incTokenId;
  }
  return incTokenId;
};

const parseExchangeDataModelResponse = (
  // Data response from api estimate swap fee
  data: ExchangeRawDetail,
  // Swap network name
  networkName: string,
  // Swap networkID
  networkID: number,
  // Child buy tokenId
  incTokenID: string,
): ExchangeData => {
  const exchangeData: ExchangeData = {
    amountIn: parseFloat(data.AmountIn) || 0,
    amountInRaw: parseFloat(data.AmountInRaw) || 0,
    amountOut: parseFloat(data.AmountOut) || 0,
    amountOutRaw: parseFloat(data.AmountOutRaw) || 0,
    appName: data.AppName === 'pdex' ? 'incognito' : data.AppName,
    exchangeName: data.AppName || '',
    fees: data.Fee || [],
    routes: data.Paths || [],
    incTokenID: incTokenID || '',
    feeAddress: data.FeeAddress || '',
    callContract: data.CallContract,
    callData: data.Calldata,
    poolPairs: data.PoolPairs || '',
    impactAmount: data.ImpactAmount || 0,
    networkID,
    networkName,
    feeAddressShardID: data.FeeAddressShardID,
  };
  return exchangeData;
};

const convertNetworkNameFromCurrentPlatformSelected = (
  currentPlatformSelected,
) => {
  switch (currentPlatformSelected) {
    case 'incognito':
      return 'incognito';
    case 'pancake':
      return 'pancake';
    case 'uni':
      return 'uniswap';
    case 'curve':
      return 'curve';
    default:
      return 'incognito';
  }
};

const isUseTokenFeeParser = (fees) => {
  let flag = true;
  if (!Array.isArray(fees)) flag = false;
  if (fees[0].tokenId === PRV_ID || fees[0].tokenid === PRV_ID) flag = false;
  return [flag, fees[0].amount || 0];
};

export const flattenEstimateRawData = (estimateRawData) => {
  let results = [];
  for (const value of Object.entries(estimateRawData)) {
    results = [...results, ...value];
  }
  return results;
};

export const filterExchangeSupportWithDefaultExchange = (
  flattenEstimateData: ExchangeData[],
  currentPlatformSelected = KEYS_PLATFORMS_SUPPORTED.incognito,
): ExchangeData[] => {
  //Trading incognito platform => Get all data (pancake, uniswap, curve, pdex)
  if (currentPlatformSelected === KEYS_PLATFORMS_SUPPORTED.incognito)
    return flattenEstimateData;

  //otherwise, filter only data with currentPlatformSelected (pancake | uniswap | curve)
  return flattenEstimateData.filter(
    (item) =>
      item.appName ===
      convertNetworkNameFromCurrentPlatformSelected(currentPlatformSelected),
  );
};

const parseEstimateDataOnEachNetwork = (
  estimdateRawData,
  sellToken,
): ExchangeData[] => {
  const exchangeSupports = Object.values(NETWORK_NAME_SUPPORTED).reduce(
    (results, networkName) => {
      results = [
        ...results,
        ...parseExchangeSupport(estimdateRawData, sellToken, networkName),
      ];
      return results;
    },
    [],
  );
  return exchangeSupports;
};

export const extractEstimateData = async (
  estimdateRawData: EstimateRawData,
  sellToken,
  defaultExchange,
): Promise<{
  bestRateExchange: ExchangeData;
  exchangeSupports: ExchangeData[];
}> => {
  let exchangeSupports: ExchangeData[] = parseEstimateDataOnEachNetwork(
    estimdateRawData,
    sellToken,
  );

  exchangeSupports =
    filterExchangeSupportWithDefaultExchange(
      exchangeSupports,
      defaultExchange,
    ) || [];

  if (!exchangeSupports.length)
    throw new Error(
      'Can not find any trading platform that supports for this pair token',
    );

  // Find Best Rate
  const bestRateExchange: ExchangeData = exchangeSupports.reduce(
    (prev, current) =>
      prev.amountOut - parseFloat(prev.fees[0].amountInBuyToken || '0') >
      current.amountOut - parseFloat(current.fees[0].amountInBuyToken || '0')
        ? prev
        : current,
  );

  console.log('extractEstimateData : ', { bestRateExchange, exchangeSupports });

  return { bestRateExchange, exchangeSupports };
};

export {
  parseExchangeSupport,
  getIncognitoTokenId,
  parseExchangeDataModelResponse,
  convertNetworkNameFromCurrentPlatformSelected,
  isUseTokenFeeParser,
};

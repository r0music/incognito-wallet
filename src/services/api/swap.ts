import http4 from '@src/services/http4';
import createLogger from '@utils/logger';

const logger = createLogger('API');

type GetEstiamteTradingFeePayload = {
  amount: string;
  fromToken: string;
  network?: string;
  slippage: string;
  toToken: string;
};

/**
 * Get Estiamte Trading Fee
 * @amount {string}
 * @fromToken {string}
 * @network {string}
 * @slippage {string}
 * @toToken {string}
 */

const getEstiamteTradingFee = async (payload: GetEstiamteTradingFeePayload) => {
  try {
    const params = {
      ...payload,
      network: payload.network ?? 'inc', //Default network = inc
    };
    logger('[getEstiamteTradingFee]  params ', params);
    const data: any = await http4.post('papps/estimateswapfee', params);
    logger('[getEstiamteTradingFee]  response ', data);
    const exchangeSupports = data?.Networks;
    return exchangeSupports;
  } catch (error) {
    // logger('[getEstiamteTradingFee]  error ', {
    //   error,
    // });
    throw error;
  }
};

const SwapService = {
  getEstiamteTradingFee,
};

export default SwapService;

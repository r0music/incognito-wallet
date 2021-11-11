import http from '@src/services/http';
import { PanCakeTokenModel } from '@models/pancakeswap';
import { cachePromise, KEYS } from '@services/cache';

export async function getPancakeTokensNoCache() {
  return http.get('trade/tokens')
    .then(tokens => tokens.map(item => new PanCakeTokenModel(item)));
}

export async function getPancakeTokens() {
  return cachePromise(KEYS.PancakeTokens, getPancakeTokensNoCache, 10);
}
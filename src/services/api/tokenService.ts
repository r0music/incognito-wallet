import http4 from '@src/services/http4';
// import createLogger from '@utils/logger';
// import BigNumber from 'bignumber.js';
import PToken from '@src/models/pToken';

const getTokenList = () => {
  return http4
    .get('tokenlist')
    .then((res: any) => res?.map((token) => new PToken(token, res)))
    .catch((error) => {
      return [];
    });
};

const TokenService = {
  getTokenList,
};

export default TokenService;

import {getTokenList} from '@services/api/token';
import tokenService from '@services/wallet/tokenService';
import {getPDEState} from '@services/api/device';
import {getAllTradingTokens} from '@services/trading';
import _ from 'lodash';
import {CustomError, ErrorCode, ExHandler} from '@services/exception';
import {COINS, MESSAGES} from '@src/constants';
import convertUtil from '@utils/convert';
import {PRIORITY_LIST} from '@screens/Dex/constants';

export const getPairsData = async () => {
  try {
    const pTokens     = await getTokenList();
    const chainTokens = await tokenService.getPrivacyTokens();
    const chainPairs  = await getPDEState();
    let tokens        = tokenService.mergeTokens(chainTokens, pTokens);
    const erc20Tokens = await getAllTradingTokens();

    // const erc20Tokens = [];

    if (!_.has(chainPairs, 'PDEPoolPairs')) {
      return new ExHandler(new CustomError(ErrorCode.FULLNODE_DOWN), MESSAGES.CAN_NOT_GET_PDEX_DATA).showErrorToast();
    }

    const pairs = _(chainPairs.PDEPoolPairs)
      .map(pair => ({
        [pair.Token1IDStr]: pair.Token1PoolValue,
        [pair.Token2IDStr]: pair.Token2PoolValue,
        total: convertUtil.toRealTokenValue(tokens, pair.Token1IDStr, pair.Token1PoolValue) + convertUtil.toRealTokenValue(tokens, pair.Token2IDStr, pair.Token2PoolValue),
        keys: [pair.Token1IDStr, pair.Token2IDStr],
      }))
      .filter(pair => pair.keys.includes(COINS.PRV_ID))
      .filter(pair => pair.total)
      .orderBy('total', 'desc')
      .value();

    const shares = chainPairs.PDEShares;
    Object.keys(shares).forEach(key => {
      if (shares[key] === 0) {
        delete shares[key];
      }
    });

    let pairTokens = tokens
      .filter(token => token && pairs.find(pair => pair.keys.includes(token.id)));

    pairTokens = pairTokens.concat(erc20Tokens.filter(token => !pairTokens.find(item => item.id === token.id)));
    pairTokens = _(pairTokens)
      .map(token => {
        const erc20Token = erc20Tokens.find(item => item.id === token.id);
        let priority = PRIORITY_LIST.indexOf(token?.id);
        priority = priority > -1 ? priority : erc20Token ? PRIORITY_LIST.length : PRIORITY_LIST.length + 1;

        return {
          ...token,
          address: erc20Token?.address,
          priority,
          verified: token.verified,
        };
      })
      .orderBy(
        [
          'priority',
          'hasIcon',
          'verified',
        ],
        ['asc', 'desc', 'desc']
      )
      .value();
    return {
      pairs,
      pairTokens,
      tokens,
      shares,
      erc20Tokens
    };
  } catch (error) {
    new ExHandler(error, MESSAGES.CAN_NOT_GET_PDEX_DATA).showErrorToast();
  }
};
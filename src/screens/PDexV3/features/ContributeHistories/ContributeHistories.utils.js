import formatUtil from '@utils/format';
import {uniq} from 'lodash';
import {ACCOUNT_CONSTANT} from 'incognito-chain-web-js/build/wallet';

export const getSubTextContribute = (contributes, getPrivacyDataByTokenID) => {
  const tokenIDs = uniq(contributes.map(item => item.tokenId));
  const orderContributes = tokenIDs.map((tokenId) => {
    const token = getPrivacyDataByTokenID(tokenId);
    const contribute = contributes.find(({ tokenId: contributeTokenId }) => tokenId === contributeTokenId);
    return {
      ...token,
      ...contribute,
    };
  });
  let message = '';
  const contribute1 = orderContributes[0];
  message = `${formatUtil.amountFull(contribute1?.amount, contribute1.pDecimals)} ${contribute1.symbol}`;
  if (orderContributes.length === 2) {
    const contribute2 = orderContributes[1];
    message += ` + ${formatUtil.amountFull(contribute2?.amount, contribute2.pDecimals)} ${contribute2.symbol}`;
  }
  return message;
};

export const mapperContributes = (history) => {
  let { contributes, statusText } = history;
  const matched = contributes.filter(({ status }) => status === ACCOUNT_CONSTANT.CONTRIBUTE_STATUS.MATCHED);
  const waiting = contributes.filter(({ status }) => status === ACCOUNT_CONSTANT.CONTRIBUTE_STATUS.WAITING);
  const isCreatePool = matched.length === 1 && waiting.length === 1;
  if (ACCOUNT_CONSTANT.CONTRIBUTE_STATUS_STR.SUCCESSFUL === statusText && isCreatePool) {
    contributes = [...waiting, ...matched];
  } else if ([ACCOUNT_CONSTANT.CONTRIBUTE_STATUS_STR.SUCCESSFUL, ACCOUNT_CONSTANT.CONTRIBUTE_STATUS_STR.REFUNDED].includes(statusText)) {
    contributes = history?.contributes.filter(({ status }) => status !== ACCOUNT_CONSTANT.CONTRIBUTE_STATUS.WAITING);
  }
  return contributes;
};

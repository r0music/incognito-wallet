import formatUtil from '@utils/format';

export const getSubRemovePool = (history, getPrivacyDataByTokenID) => {
  const { tokenId1, tokenId2, amount1, amount2, amount } = history;
  let token1, token2;
  if (tokenId1) { token1 = getPrivacyDataByTokenID(tokenId1); }
  if (tokenId2) { token2 = getPrivacyDataByTokenID(tokenId2); }
  if (!token1 && !token2) return '';
  let message = '';
  message = `${formatUtil.amountFull(amount1 || amount, token1.pDecimals)} ${token1.symbol}`;
  if (token2 && amount2) {
    message += ` + ${formatUtil.amountFull(amount2, token2.pDecimals)} ${token2.symbol}`;
  }
  return message;
};

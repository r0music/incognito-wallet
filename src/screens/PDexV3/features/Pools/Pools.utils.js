import includes from 'lodash/includes';
import toLower from 'lodash/toLower';

const searchByToken = (token, keySearch) => {
  let _keySearch = toLower(keySearch);
  return (
    includes(toLower(token?.displayName), _keySearch) ||
    includes(toLower(token?.name), _keySearch) ||
    includes(toLower(token?.symbol), _keySearch) ||
    includes(toLower(token?.pSymbol), _keySearch) ||
    includes(toLower(token?.networkName), _keySearch) ||
    includes(toLower(token?.contractId), _keySearch) ||
    includes(toLower(token?.tokenId), _keySearch)
  );
};

export const handleFilterPoolByKeySeach = ({ data, keySearch }) =>
  data.filter(
    (pool) =>
      searchByToken(pool?.token1, keySearch) ||
      searchByToken(pool?.token2, keySearch),
  );

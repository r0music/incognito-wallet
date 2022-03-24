import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { selectedPrivacySelector } from '@src/redux/selectors';
import PropTypes from 'prop-types';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';

export const TokenContext = React.createContext();

const enhance = (WrappedComp) => (props) => {
  const { tokenId, amount } = props;
  const token = useDebounceSelector(selectedPrivacySelector.getPrivacyDataByTokenID)(
    tokenId,
  );

  const tokenProps = React.useMemo(() => ({
    ...props,
    ...token,
    amount,
    symbol: token?.symbol || token?.externalSymbol || '',
  }), [amount, token.name, token.priceUsd]);

  if (!token || !tokenId) {
    return null;
  }
  return (
    <ErrorBoundary>
      <TokenContext.Provider
        value={{
          tokenProps,
        }}
      >
        <WrappedComp {...tokenProps} />
      </TokenContext.Provider>
    </ErrorBoundary>
  );
};

enhance.defaultProps = {};

enhance.propTypes = {
  tokenId: PropTypes.number.isRequired,
};

export default enhance;

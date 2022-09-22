import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { availableTokensSelector } from '@src/redux/selectors/shared';
import { useSearchBox } from '@src/components/Header';
import { handleFilterTokenByKeySearch } from '@src/components/Token';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import { marketTabSelector } from '@screens/Setting';
import { MarketTabs } from '@screens/MainTabBar/features/Market/Market.header';
import { PRVIDSTR } from 'incognito-chain-web-js/build/wallet';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { useTokenList } from './Token.useEffect';

const enhance = (WrappedComp) => (props) => {
  console.log('AAAAA props ', Object.assign({}, props));
  console.log('WrappedComp  ', Object.assign({}, WrappedComp));
  const { filterField, orderField } = props;
  let availableTokens =
    props?.availableTokens || useDebounceSelector(availableTokensSelector);
  const activeTab = useDebounceSelector(marketTabSelector);
  const navigation = useNavigation();
  const { verifiedTokens, unVerifiedTokens } = React.useMemo(() => {
    let verifiedTokens = [];
    let unVerifiedTokens = [];
    // remove tokens has convert to unified token when current screen is Shield
    if (navigation?.state?.routeName === routeNames?.Shield) {
      availableTokens = availableTokens?.filter(
        (token) => token?.movedUnifiedToken === false,
      );
    }
    availableTokens.map((token) =>
      token?.isVerified || token?.verified
        ? verifiedTokens.push(token)
        : unVerifiedTokens.push(token),
    );
    return {
      verifiedTokens,
      unVerifiedTokens,
    };
  }, [availableTokens]);

  const [toggleUnVerified, onToggleUnVerifiedTokens] = useTokenList();
  const [_verifiedTokens, keySearch, handleFilterData] = useSearchBox({
    data: verifiedTokens,
    shouldCleanSearch: false,
    handleFilter: () =>
      handleFilterTokenByKeySearch({ tokens: verifiedTokens, keySearch }),
  });
  const [_unVerifiedTokens, _keySearch, _handleFilterData] = useSearchBox({
    data: unVerifiedTokens,
    shouldCleanSearch: false,
    handleFilter: () =>
      handleFilterTokenByKeySearch({
        tokens: unVerifiedTokens,
        keySearch: _keySearch,
      }),
  });

  React.useEffect(() => {
    const __verifiedTokens = handleFilterTokenByKeySearch({
      tokens: verifiedTokens,
      keySearch,
    });
    handleFilterData(__verifiedTokens);
    if (toggleUnVerified) {
      const __unVerifiedTokens = handleFilterTokenByKeySearch({
        tokens: unVerifiedTokens,
        keySearch: _keySearch,
      });
      _handleFilterData(__unVerifiedTokens);
    }
  }, [availableTokens]);

  const tokensFactories = React.useMemo(() => {
    let marketTokens = [];
    if (activeTab === MarketTabs.ALL) {
      marketTokens = _verifiedTokens
        .concat(_unVerifiedTokens.filter((item) => item.isFollowed))
        .filter((token) => !!token.defaultPoolPair);
    } else {
      marketTokens = _verifiedTokens
        .filter((item) => item.isFollowed || item.tokenId === PRVIDSTR)
        .concat(_unVerifiedTokens.filter((item) => item.isFollowed))
        .filter((token) => !!token.defaultPoolPair);
    }
    marketTokens = orderBy(
      marketTokens,
      (item) => Number(item[filterField] || '0'),
      [orderField],
    );
    const __verifiedTokens = orderBy(
      _verifiedTokens,
      (item) => Number(item[filterField] || '0'),
      [orderField],
    );
    const __unVerifiedTokens = orderBy(
      _unVerifiedTokens,
      (item) => Number(item[filterField] || '0'),
      [orderField],
    );
    return [
      {
        data: __verifiedTokens,
        visible: true,
        styledListToken: { paddingTop: 0 },
      },
      {
        data: __unVerifiedTokens,
        visible: toggleUnVerified,
        styledListToken: { paddingTop: 15 },
      },
      {
        data: marketTokens,
        visible: true,
        styledListToken: { paddingTop: 15 },
      },
    ];
  }, [
    _unVerifiedTokens,
    _verifiedTokens,
    toggleUnVerified,
    filterField,
    orderField,
    activeTab,
  ]);

  React.useEffect(() => {
    if (toggleUnVerified && !keySearch) {
      onToggleUnVerifiedTokens();
    }
  }, [keySearch]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          tokensFactories,
          toggleUnVerified,
          onToggleUnVerifiedTokens,
          keySearch,
        }}
      />
    </ErrorBoundary>
  );
};
enhance.defaultProps = {
  filterField: 'change',
  orderField: 'desc',
};
enhance.propTypes = {
  availableTokens: PropTypes.array.isRequired,
  filterField: PropTypes.string,
  orderField: PropTypes.string,
};

export default enhance;

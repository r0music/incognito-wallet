import { useFuse } from '@components/Hoc/useFuse';
import withLazy from '@components/LazyHoc/LazyHoc';
import { View } from '@src/components/core';
import { View2 } from '@src/components/core/View';
import Header from '@src/components/Header';
// import { withLayout_2 } from '@src/components/Layout';
import { ListAllToken3, TokenTrade1 } from '@src/components/Token';
import { FONT } from '@src/styles';
import React, { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'recompose';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { change } from 'redux-form';
import { delay } from '@src/utils/delay';
import orderBy from 'lodash/orderBy';
import { getSearchTokenListByField } from '../Swap.selector';
import { styled } from './SelectionToken.styled';
import { actionResetData } from '../Swap.actions';
import { formConfigs, RULE_SORT, RULE_SEARCH } from '../Swap.constant';

const SelectTokenList = React.memo(() => {
  const dispatch = useDispatch();
  const data = useNavigationParam('data');
  const onPress = useNavigationParam('onPress');
  const { goBack } = useNavigation();
  const { from, tokenId } = data;

  if (!from || !tokenId) return null;

  let availableTokens = useSelector(getSearchTokenListByField)(from, tokenId);
  const { verifiedTokensDefault, unVerifiedTokensDefault } = useMemo(() => {
    let result = {
      verifiedTokensDefault: [],
      unVerifiedTokensDefault: [],
      availableTokensSorted: [],
    };
    result.availableTokensSorted =
      orderBy(availableTokens, RULE_SORT.key, RULE_SORT.value) || [];
    result.availableTokensSorted.reduce((currentResult, token) => {
      if (token.isVerified) {
        currentResult.verifiedTokensDefault.push(token);
      } else {
        currentResult.unVerifiedTokensDefault.push(token);
      }
      return currentResult;
    }, result);
    return result;
  }, [availableTokens]);

  const [showUnVerifiedTokens, setShowUnVerifiedTokens] = useState(false);

  const onSetShowUnVerifiedTokens = () => {
    setShowUnVerifiedTokens(!showUnVerifiedTokens);
  };

  const [verifiedTokens, onSearchVerifiedTokens] = useFuse(
    verifiedTokensDefault,
    {
      keys: RULE_SEARCH,
      matchAllOnEmptyQuery: true,
      isCaseSensitive: false,
      findAllMatches: true,
      includeMatches: false,
      includeScore: true,
      useExtendedSearch: false,
      threshold: 0,
      location: 0,
      distance: 2,
      maxPatternLength: 32,
    },
  );

  const [unVerifiedTokens, onSearchUnVerifiedTokens] = useFuse(
    unVerifiedTokensDefault,
    {
      keys: RULE_SEARCH,
      matchAllOnEmptyQuery: true,
      isCaseSensitive: false,
      findAllMatches: true,
      includeMatches: false,
      includeScore: true,
      useExtendedSearch: false,
      threshold: 0,
      location: 0,
      distance: 2,
      maxPatternLength: 32,
    },
  );

  let tokens = [verifiedTokens];
  if (showUnVerifiedTokens) {
    tokens = [verifiedTokens, unVerifiedTokens];
  }

  const renderItem = useCallback(
    ({ item }) => (
      <TokenTrade1
        onPress={async () => {
          goBack();
          dispatch(actionResetData());
          dispatch(change(formConfigs.formName, formConfigs.feetoken, ''));
          await delay(0);
          if (typeof onPress === 'function') {
            onPress(item);
          }
        }}
        tokenId={item?.tokenId}
      />
    ),
    [],
  );

  return (
    <View2 style={styled.container}>
      <Header
        title="Select coins"
        canSearch
        titleStyled={FONT.TEXT.incognitoH4}
        isNormalSearch
        onTextSearchChange={(value) => {
          onSearchVerifiedTokens(value);
          onSearchUnVerifiedTokens(value);
        }}
      />
      <View borderTop style={[{ flex: 1 }]}>
        <ListAllToken3
          tokensFactories={tokens}
          isShowUnVerifiedTokens={showUnVerifiedTokens}
          setShowUnVerifiedTokens={onSetShowUnVerifiedTokens}
          renderItem={renderItem}
        />
      </View>
    </View2>
  );
});

export default compose(withLazy)(SelectTokenList);

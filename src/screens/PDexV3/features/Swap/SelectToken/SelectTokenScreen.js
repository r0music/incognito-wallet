import { useFuse } from '@components/Hoc/useFuse';
import withLazy from '@components/LazyHoc/LazyHoc';
import { View } from '@src/components/core';
import { View2 } from '@src/components/core/View';
import Header from '@src/components/Header';
// import { withLayout_2 } from '@src/components/Layout';
import { ListAllToken2, TokenTrade } from '@src/components/Token';
import { FONT } from '@src/styles';
import React, { useMemo, useState } from 'react';
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

  let _availableTokens = useSelector(getSearchTokenListByField)(from, tokenId);

  _availableTokens = useMemo(
    () => orderBy(_availableTokens, RULE_SORT.key, RULE_SORT.value),
    [],
  );

  const _verifiedTokens = _availableTokens?.filter(
    (token) => token?.isVerified,
  );

  const _unVerifiedTokens = _availableTokens?.filter(
    (token) => !token.isVerified,
  );

  const [showUnVerifiedTokens, setShowUnVerifiedTokens] = useState(false);

  const onSetShowUnVerifiedTokens = () => {
    setShowUnVerifiedTokens(!showUnVerifiedTokens);
  };

  const [verifiedTokens, onSearchVerifiedTokens] = useFuse(_verifiedTokens, {
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
  });

  const [unVerifiedTokens, onSearchUnVerifiedTokens] = useFuse(
    _unVerifiedTokens,
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
        <ListAllToken2
          tokensFactories={tokens}
          isShowUnVerifiedTokens={showUnVerifiedTokens}
          setShowUnVerifiedTokens={onSetShowUnVerifiedTokens}
          renderItem={({ item }) => (
            <TokenTrade
              onPress={async () => {
                goBack();
                dispatch(actionResetData());
                dispatch(
                  change(formConfigs.formName, formConfigs.feetoken, ''),
                );
                await delay(0);
                if (typeof onPress === 'function') {
                  onPress(item);
                }
              }}
              tokenId={item?.tokenId}
            />
          )}
        />
      </View>
    </View2>
  );
});

export default compose(withLazy)(SelectTokenList);

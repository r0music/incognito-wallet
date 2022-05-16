import React, { useState } from 'react';
import Header from '@src/components/Header';
import { BtnQuestionDefault } from '@src/components/Button';
import PropTypes from 'prop-types';
import {
  ListAllToken2,
  TokenFollow,
  handleFilterTokenByKeySearch,
} from '@src/components/Token';
import { View } from '@components/core';
import globalStyled from '@src/theme/theme.styled';
import { FONT } from '@src/styles';
import { compose } from 'recompose';
import withLazy from '@components/LazyHoc/LazyHoc';
import { isEmpty } from 'lodash';
import { useFuse } from '@components/Hoc/useFuse';
import { styled } from './Shield.styled';
import withShield from './Shield.enhance';

const Shield = (props) => {
  const { handleShield, handleWhyShield, hideBackButton, availableTokens } =
    props;

  // Get list verifiedToken list unVerifiedTokens from list all token
  const _verifiedTokens = availableTokens?.filter((token) => token?.isVerified);
  const _unVerifiedTokens = availableTokens?.filter(
    (token) => !token.isVerified,
  );

  const [showUnVerifiedTokens, setShowUnVerifiedTokens] = useState(false);

  const onSetShowUnVerifiedTokens = () => {
    setShowUnVerifiedTokens(!showUnVerifiedTokens);
  };

  const [verifiedTokens, onSearchVerifiedTokens] = useFuse(_verifiedTokens, {
    keys: ['displayName', 'name', 'symbol', 'pSymbol'],
    includeMatches: true,
    matchAllOnEmptyQuery: true,
  });

  const [unVerifiedTokens, onSearchUnVerifiedTokens] = useFuse(
    _unVerifiedTokens,
    {
      keys: ['displayName', 'name', 'symbol', 'pSymbol'],
      includeMatches: true,
      matchAllOnEmptyQuery: true,
    },
  );

  let tokens = [verifiedTokens];
  if (showUnVerifiedTokens) {
    tokens = [verifiedTokens, unVerifiedTokens];
  }

  return (
    <>
      <Header
        title="Search coins"
        canSearch
        isNormalSearch
        onTextSearchChange={(value) => {
          onSearchVerifiedTokens(value);
          onSearchUnVerifiedTokens(value);
        }}
        titleStyled={FONT.TEXT.incognitoH4}
        hideBackButton={hideBackButton}
        rightHeader={
          <BtnQuestionDefault
            style={{ marginLeft: 8 }}
            onPress={handleWhyShield}
            customStyle={styled.rightItem}
          />
        }
      />
      <View borderTop style={styled.container}>
        <ListAllToken2
          tokensFactories={tokens}
          styledCheckBox={globalStyled.defaultPaddingHorizontal}
          setShowUnVerifiedTokens={onSetShowUnVerifiedTokens}
          isShowUnVerifiedTokens={showUnVerifiedTokens}
          renderItem={({ item }) => (
            <TokenFollow
              item={item}
              key={item.tokenId}
              hideStar
              externalSymbol
              onPress={() => handleShield(item)}
            />
          )}
        />
      </View>
    </>
  );
};

Shield.defaultProps = {
  hideBackButton: false,
};

Shield.propTypes = {
  handleWhyShield: PropTypes.func.isRequired,
  handleShield: PropTypes.func.isRequired,
  tokensFactories: PropTypes.array.isRequired,
  hideBackButton: PropTypes.bool,
};

export default compose(withLazy, withShield)(Shield);

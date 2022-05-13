import React, { useState } from 'react';
import Header from '@src/components/Header';
import { BtnQuestionDefault } from '@src/components/Button';
import PropTypes from 'prop-types';
import {ListAllToken2, TokenFollow, handleFilterTokenByKeySearch } from '@src/components/Token';
import { View } from '@components/core';
import globalStyled from '@src/theme/theme.styled';
import { FONT } from '@src/styles';
import { compose } from 'recompose';
import withLazy from '@components/LazyHoc/LazyHoc';
import { isEmpty } from 'lodash';

import { styled } from './Shield.styled';
import withShield from './Shield.enhance';

const Shield = (props) => {
  const { handleShield, handleWhyShield, hideBackButton, availableTokens, ...rest } = props;
  
   const _verifiedTokens = availableTokens?.filter(
     (token) => token?.isVerified || token?.verified,
   );

   const _unVerifiedTokens = availableTokens?.filter(
     (token) => !token.isVerified || !token.verified,
   );

   const [verifiedTokens, setVerifiedTokens] = useState(_verifiedTokens);

   const [unverifiedTokens, setUnVerifiedTokens] = useState(_unVerifiedTokens);

   const tokens = [
     {
       data: verifiedTokens,
       visible: true,
       styledListToken: { paddingTop: 0 },
     },
     {
       data: unverifiedTokens,
       visible: true,
       styledListToken: { paddingTop: 15 },
     }];

   const handleFilterToken = (searchValue) => {
     if (!isEmpty(searchValue)) {
       const __verifiedTokens = handleFilterTokenByKeySearch({
         tokens: _verifiedTokens,
         keySearch: searchValue,
       });
       const __unVerifiedTokens = handleFilterTokenByKeySearch({
         tokens: _unVerifiedTokens,
         keySearch: searchValue,
       });
       setVerifiedTokens(__verifiedTokens);
       setUnVerifiedTokens(__unVerifiedTokens);
     } else {
       setVerifiedTokens(_verifiedTokens);
       setUnVerifiedTokens(_unVerifiedTokens);
     }
   };

  return (
    <>
      <Header
        title="Search coins"
        canSearch
        isNormalSearch
        onTextSearchChange={(value) => handleFilterToken(value)}
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
  hideBackButton: false
};

Shield.propTypes = {
  handleWhyShield: PropTypes.func.isRequired,
  handleShield: PropTypes.func.isRequired,
  tokensFactories: PropTypes.array.isRequired,
  hideBackButton: PropTypes.bool
};

export default compose(
  withLazy,
  withShield
)(Shield);

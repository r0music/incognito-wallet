import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Text3 } from '@src/components/core';
import { View2 } from '@src/components/core/View';
import globalStyled from '@src/theme/theme.styled';
import Header from '@src/components/Header';
import {
  TokenBasic as Token,
  ListAllToken2,
  TokenFollow,
  handleFilterTokenByKeySearch,
} from '@src/components/Token';

import PropTypes from 'prop-types';
import routeNames from '@src/router/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import { FONT } from '@src/styles';
import AddSolidIcon from '@components/Icons/icon.addSolid';
import { availableTokensSelector } from '@src/redux/selectors/shared';
import {isEmpty} from 'lodash';
import { useSelector } from 'react-redux';
import { styled } from './FollowToken.styled';

const AddManually = () => {
  const title = 'Don\'t see your coin?';
  const navigation = useNavigation();
  const handleAddTokenManually = () =>
    navigation?.navigate(routeNames.AddManually, { type: 'ERC20' });
  return (
    <View spaceBetween style={styled.addManually}>
      <Text3 style={styled.text}>{title}</Text3>
      <TouchableOpacity style={{ flexDirection: 'row' }} onPress={handleAddTokenManually}>
        <Text style={styled.text}>
          Add manually
        </Text>
        <View style={{ marginLeft: 8 }}>
          <AddSolidIcon />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const Item = ({ item, handleToggleFollowToken }) =>
  React.useMemo(() => {
    return (
      <Token
        onPress={() => handleToggleFollowToken(item)}
        tokenId={item?.tokenId}
        name="displayName"
        symbol="pSymbol"
        shouldShowFollowed
      />
    );
  }, [item?.isFollowed]);

const FollowTokenList = React.memo((props) => {
  console.log(props);
  const { handleToggleFollowToken } = props;

  const availableTokens =
    props?.availableTokens || useSelector(availableTokensSelector);

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
    },
  ];

  const handleFilterToken = (searchValue) => {
    if(!isEmpty(searchValue)) {
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
    <View2 style={styled.container}>
      <Header
        title="Add a coin"
        canSearch
        titleStyled={FONT.TEXT.incognitoH4}
        isNormalSearch
        onTextSearchChange={(value) => handleFilterToken(value)}
      />
      <View borderTop style={[{ flex: 1 }]}>
        <ListAllToken2
          tokensFactories={tokens}
          styledCheckBox={globalStyled.defaultPaddingHorizontal}
          renderItem={({ item }) => (
            <TokenFollow
              item={item}
              handleToggleFollowToken={handleToggleFollowToken}
              onPress={() => handleToggleFollowToken(item)}
            />
          )}
        />
      </View>
      <AddManually />
    </View2>
  );
});

export default FollowTokenList;
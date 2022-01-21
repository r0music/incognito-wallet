import React from 'react';
import { View, Text, TouchableOpacity, Text3 } from '@src/components/core';
import { View2 } from '@src/components/core/View';
import globalStyled from '@src/theme/theme.styled';
import Header from '@src/components/Header';
import {TokenBasic as Token, ListAllToken, TokenFollow} from '@src/components/Token';
import PropTypes from 'prop-types';
import routeNames from '@src/router/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import { FONT } from '@src/styles';
import AddSolidIcon from '@components/Icons/icon.addSolid';
import { styled } from './FollowToken.styled';
import withFollowToken from './FollowToken.enhance';

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
  const { handleToggleFollowToken, ...rest } = props;
  return (
    <View2 style={styled.container}>
      <Header title="Add a coin" canSearch titleStyled={FONT.TEXT.incognitoH4} />
      <View borderTop style={[{ flex : 1 }]}>
        <ListAllToken
          {...rest}
          styledCheckBox={globalStyled.defaultPaddingHorizontal}
          renderItem={({ item }) => (
            <TokenFollow item={item} handleToggleFollowToken={handleToggleFollowToken} onPress={() => handleToggleFollowToken(item)} />
          )}
        />
      </View>
      <AddManually />
    </View2>
  );
});

FollowTokenList.propTypes = {
  handleToggleFollowToken: PropTypes.func.isRequired,
  tokensFactories: PropTypes.array.isRequired,
};

export default withFollowToken(FollowTokenList);

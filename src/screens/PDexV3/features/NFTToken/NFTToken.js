import { Header, Row } from '@src/components';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonBasic } from '@src/components/Button';
import { ScrollView, Text } from '@src/components/core';
import { withLayout_2 } from '@src/components/Layout';
import routeNames from '@src/router/routeNames';
import React from 'react';
import { View } from 'react-native';
import CopiableText from '@src/components/CopiableText';
import { useFocusEffect, useNavigation } from 'react-navigation-hooks';
import { nftTokenDataSelector } from '@src/redux/selectors/account';
import { actionSetNFTTokenData } from '@src/redux/actions/account';
import NFTTokenHook from './NFTToken.hook';
import { styled } from './NFTToken.styled';
import { FormMint } from './NFTToken.mint';

const NFTTokenItem = React.memo((props) => {
  const { nftToken = '', amount = '0' } = props;
  if (!nftToken) {
    return null;
  }
  return (
    <CopiableText
      text={nftToken}
      copiedMessage="Copied"
      style={styled.nftTokenItemContainer}
    >
      <Row style={styled.nftTokenItemWrapper}>
        <Text ellipsizeMode="middle" numberOfLines={1} style={styled.nftToken}>
          {nftToken}
        </Text>
        <Text style={styled.amount}>{amount}</Text>
      </Row>
    </CopiableText>
  );
});

const ListNFTToken = React.memo((props) => {
  const { list } = useSelector(nftTokenDataSelector);
  if (list.length === 0) {
    return null;
  }
  return (
    <View style={styled.list}>
      <Text style={styled.listTitle}>List</Text>
      <Row style={{ ...styled.nftTokenItemWrapper, marginBottom: 15 }}>
        <Text ellipsizeMode="middle" numberOfLines={1} style={styled.nftToken}>
          NFT ID
        </Text>
        <Text style={styled.amount}>Amount</Text>
      </Row>
      {list.map((nft) => (
        <NFTTokenItem {...nft} key={nft?.nftToken} />
      ))}
    </View>
  );
});

const NFTToken = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      dispatch(actionSetNFTTokenData());
    }, []),
  );
  const onMintNFToken = React.useCallback(
    () => navigation.navigate(routeNames.MintNFTToken),
    [],
  );
  const hookFactories = React.useMemo(
    () => [
      {
        label: 'What is Lorem Ipsum?',
        value:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      },
    ],
    [],
  );
  return (
    <View style={styled.container}>
      <Header title="NFT" />
      <ScrollView style={styled.scrollview}>
        {hookFactories.map((hook) => (
          <NFTTokenHook {...hook} key={hook.label} />
        ))}
        <ListNFTToken />
        <FormMint />
      </ScrollView>
    </View>
  );
};

NFTToken.propTypes = {};

export default withLayout_2(React.memo(NFTToken));

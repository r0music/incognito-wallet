import React from 'react';
import { TouchableOpacity } from 'react-native';
import {useNavigation, useNavigationParam} from 'react-navigation-hooks';
import styles from '@components/TokenSelectScreen/style';
import BackButton from '@components/BackButtonV2';
import { BaseTextInput, FlatList, Text3, View } from '@components/core';
import VerifiedText from '@components/VerifiedText';
import { toLower, uniqBy, trim } from 'lodash';
import formatUtil from '@utils/format';
import {PRV} from '@src/constants/common';
import { withLayout_2 } from '@components/Layout';
import globalStyled from '@src/theme/theme.styled';

const TwoTokensSelect = () => {
  const tokens = useNavigationParam('tokens') || [];
  const placeholder = useNavigationParam('placeholder') || 'Search coins';
  const onSelectToken = useNavigationParam('onSelectToken');
  const [displayTokens, setDisplayTokens] = React.useState(tokens);
  const navigation = useNavigation();

  const handleSearch = text => {
    if (text) {
      const searchText = toLower(trim(text));
      const validTokens = uniqBy(tokens, 'id').filter(
        item =>
          toLower(item.name).includes(searchText) ||
          toLower(item.symbol).includes(searchText) ||
          toLower(item?.tokenID).includes(searchText) ||
          toLower(item?.contractId).includes(searchText),
      );

      setDisplayTokens(validTokens);
    } else {
      setDisplayTokens(tokens);
    }
  };

  const handleSelectToken = (token) => {
    if (typeof onSelectToken !== 'function') return;

    onSelectToken(token.outputToken, token.inputToken);
    navigation.goBack();
  };

  const renderItem = (data) => {
    const { item } = data;
    console.log(item);
    const { inputToken: token1, outputToken: token2, shareFee } = item;
    const { symbol: symbol1, displaySymbol: displaySymbol1, isVerified: isVerified1, name: tokenName1 } = token1;
    const { symbol: symbol2, displaySymbol: displaySymbol2, isVerified: isVerified2, name: tokenName2 } = token2;
    return(
      <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => handleSelectToken(item)}>
        <View style={{ flexDirection: 'row' }}>
          <VerifiedText text={tokenName1} isVerified={isVerified1} style={styles.tokenName} />
          <VerifiedText text=" - " style={styles.tokenName} />
          <VerifiedText text={tokenName2} isVerified={isVerified2} style={styles.tokenName} />
        </View>
        <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text3 style={styles.networkName}>
            {`${symbol1 || displaySymbol1}-${symbol2 || displaySymbol2}`}
          </Text3>
          <Text3 style={[styles.networkName, { fontSize: 18, fontWeight: 'bold' }]}>
            {`${formatUtil.amountFull(shareFee, PRV.pDecimals)} ${PRV.symbol}`}
          </Text3>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={[styles.row, globalStyled.defaultPaddingHorizontal]}>
        <BackButton />
        <BaseTextInput
          placeholder={placeholder}
          onChangeText={handleSearch}
          style={styles.input}
        />
      </View>
      <View fullFlex style={[globalStyled.defaultPaddingHorizontal, { paddingTop: 25 }]} borderTop>
        <FlatList
          data={displayTokens}
          renderItem={renderItem}
          keyExtractor={({ inputToken, outputToken }) => `${inputToken.id}-${outputToken.id}`}
        />
      </View>
    </>
  );
};

TwoTokensSelect.propTypes = {

};


export default withLayout_2(React.memo(TwoTokensSelect));

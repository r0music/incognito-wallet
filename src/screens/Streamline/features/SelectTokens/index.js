import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { Header, LoadingContainer } from '@src/components';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';
import {streamlineConsolidateSelector} from '@screens/Streamline';
import BigNumber from 'bignumber.js';
import {ActivityIndicator, TouchableOpacity, View, ScrollViewBorder} from '@components/core';
import { View2 } from '@components/core/View';
import { Text4 } from '@components/core/Text';
import { styled } from '@components/Token/Token.styled';
import { NormalText } from '@components/Token/Token';
import { TokenVerifiedIcon } from '@components/Icons';
import formatUtils from '@utils/format';
import { balanceStyled } from '@screens/Wallet/features/Detail/Detail.styled';
import { FONT } from '@src/styles';
import { MAX_NO_INPUT_DEFRAGMENT } from '@screens/Streamline/Streamline.constant';
import withDetectUTXOS from '@screens/Streamline/Streamline.detectUTXOS';
import globalStyled from '@src/theme/theme.styled';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';

const Item = React.memo(({ item, maxSize, index, loading, onPress }) => {
  const { tokenID, unspentCoins } = item;
  const token = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID)(tokenID);
  const balance = React.useMemo(() => {
    return unspentCoins.reduce((prev, coin) => {
      return prev.plus(coin.Value);
    }, new BigNumber(0));
  }, [token, unspentCoins]);

  const disabled = unspentCoins.length < MAX_NO_INPUT_DEFRAGMENT || loading;

  return (
    <TouchableOpacity
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
      onPress={() => {
        if (typeof onPress !== 'function') return;
        onPress(tokenID);
      }}
    >
      <View style={[styled.container, maxSize === index && { marginBottom : 40 }]}>
        <View style={[styled.extra, styled.extraTop]}>
          <View style={{ flexDirection: 'row' }}>
            <NormalText text={token?.name || 'Incognito Token'} style={styled.boldText} />
            {(!!token?.isVerified) && <TokenVerifiedIcon />}
          </View>
          {loading ?
            (<ActivityIndicator />) :
            (
              <NormalText
                style={[styled.bottomText, styled.boldText]}
                text={`${unspentCoins.length} UTXOS`}
              />
            )}
        </View>
        <View style={styled.extra}>
          <Text4 style={[styled.rightText, balanceStyled.pSymbol, { fontFamily: FONT.NAME.medium }]}>
            {`${formatUtils.amountFull(balance.toString(), token.pDecimals)} ${token.symbol}`}
          </Text4>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const SelectToken = React.memo(({ onSelectItem, onPullRefresh }) => {
  const { UTXOSFiltered: UTXOS, isLoading, isFetching } = useSelector(streamlineConsolidateSelector);
  const renderItem = (data) => <Item item={data?.item} index={data?.index} maxSize={UTXOS.length - 1} loading={isFetching} onPress={onSelectItem} />;
  return (
    <>
      <Header title="Consolidate" accountSelectable />
      {(isLoading) ?
        (
          <View2 fullFlex>
            <LoadingContainer />
          </View2>
        ) : (
          <View fullFlex paddingHorizontal borderTop style={{ paddingTop: 8 }}>
            <FlatList
              data={UTXOS}
              refreshing={isFetching}
              renderItem={renderItem}
              keyExtractor={item => item.tokenID}
              showsVerticalScrollIndicator={false}
              onRefresh={onPullRefresh}
            />
          </View>
        )}
    </>
  );
});

SelectToken.propTypes = {
  onSelectItem: PropTypes.func.isRequired,
  onPullRefresh: PropTypes.func.isRequired,
};

Item.propTypes = {
  item: PropTypes.object.isRequired,
  maxSize: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default compose(
  withDetectUTXOS,
  withLayout_2,
)(SelectToken);

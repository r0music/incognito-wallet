import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedPrivacySelector, tokenSelector } from '@src/redux/selectors';
import { useNavigation } from 'react-navigation-hooks';
import { WalletContext } from '@screens/Wallet/features/Home/Wallet.enhance';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import routeNames from '@routers/routeNames';
import { actionRemoveFollowToken } from '@src/redux/actions/token';
import { RefreshControl, ScrollView, Toast, View } from '@components/core';
import Token from '@screens/Wallet/features/Home/Wallet.token';
import { CONSTANT_COMMONS } from '@src/constants';
import {
  styledFollow,
  styledToken,
} from '@screens/Wallet/features/Home/_Wallet.styled';
import { formatAmount } from '@components/Token';
import convert from '@utils/convert';
import orderBy from 'lodash/orderBy';
import { decimalDigitsSelector } from '@screens/Setting';

const Followed = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const followed = useSelector(tokenSelector.tokensRealFollowedSelector);
  const getPrivacyDataByTokenID = useSelector(
    selectedPrivacySelector.getPrivacyDataByTokenID,
  );
  const decimalDigits = useSelector(decimalDigitsSelector);

  const _followed = React.useMemo(() => {
    const data = followed
      .filter((token) => token?.id !== CONSTANT_COMMONS.PRV.id)
      .map((_token) => {
        const token = getPrivacyDataByTokenID(_token.id);
        const amountUSD = formatAmount(
          token.priceUsd,
          _token.amount,
          token.pDecimals,
          token.pDecimals,
          decimalDigits,
          false,
        );
        const amountUSDNumb = convert.toNumber(amountUSD, true);
        return {
          ..._token,
          amountUSD,
          amountUSDNumb,
        };
      });
    return orderBy(data, 'amountUSDNumb', 'desc');
  }, [followed, getPrivacyDataByTokenID]);

  const { walletProps } = React.useContext(WalletContext);
  const { isReloading, onRefresh } = walletProps;
  const handleSelectToken = async (tokenId) => {
    if (!tokenId) return;
    await dispatch(setSelectedPrivacy(tokenId));
    navigation.navigate(routeNames.WalletDetail);
  };
  const handleRemoveToken = async (tokenId) => {
    await dispatch(actionRemoveFollowToken(tokenId));
    Toast.showSuccess('Add coin again to restore balance.', {
      duration: 500,
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isReloading}
          onRefresh={() => onRefresh(true)}
        />
      }
      style={styledFollow.scrollView}
      nestedScrollEnabled
    >
      <Token
        tokenId={CONSTANT_COMMONS.PRV_TOKEN_ID}
        style={[
          styledFollow.token,
          _followed.length === 0 && styledToken.lastChild,
        ]}
        onPress={() => handleSelectToken(CONSTANT_COMMONS.PRV_TOKEN_ID)}
      />
      {_followed.map((token, index) => (
        <Token
          key={token?.id}
          tokenId={token?.id}
          style={[
            styledFollow.token,
            _followed.length - 1 === index && styledToken.lastChild,
          ]}
          onPress={() => handleSelectToken(token?.id)}
          handleRemoveToken={() => handleRemoveToken(token?.id)}
          swipable
          removable
          showGettingBalance={token?.loading}
        />
      ))}
      <View style={{ height: 70 }} />
    </ScrollView>
  );
};

Followed.propTypes = {};

export default memo(Followed);

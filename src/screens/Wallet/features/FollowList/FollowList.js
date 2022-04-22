import React, { memo } from 'react';
import withFollowList from '@screens/Wallet/features/FollowList/FollowList.enhance';
import { compose } from 'recompose';
import { useDispatch } from 'react-redux';
import { followTokensWalletSelector, isFetchingSelector } from '@screens/Wallet/features/FollowList/FollowList.selector';
import Token from '@screens/Wallet/features/Home/Wallet.token';
import { styledFollow } from '@screens/Wallet/features/Home/_Wallet.styled';
import { FlatList } from '@components/core/FlatList';
import { Toast, View } from '@components/core';
import Extra from '@screens/Wallet/features/Home/Wallet.extra';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import routeNames from '@routers/routeNames';
import { actionRemoveFollowToken, setToken } from '@src/redux/actions/token';
import { useNavigation } from 'react-navigation-hooks';
import { RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { selectedPrivacyTokenID } from '@src/redux/selectors/selectedPrivacy';
import { actionFreeHistory } from '@src/redux/actions/history';

const FollowList = ({ loadBalance }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const data = useDebounceSelector(followTokensWalletSelector);
  const isRefreshing = useDebounceSelector(isFetchingSelector);
  const renderKeyExtractor = React.useCallback((item) => item.tokenID, []);
  const selectPrivacyTokenID = useDebounceSelector(selectedPrivacyTokenID);

  const handleSelectToken = async (tokenId, balance) => {
    if (!tokenId) return;
    if (selectPrivacyTokenID && selectPrivacyTokenID.toLowerCase() !== tokenId.toLowerCase()) {
      dispatch(actionFreeHistory());
    }
    await dispatch(setSelectedPrivacy(tokenId));
    navigation.navigate(routeNames.WalletDetail, { tokenId });
    setTimeout(async() => {
      await dispatch(setToken({
        id: tokenId,
        amount: balance,
        loading: false,
      }),
      );
    }, 1500);
  };
  const handleRemoveToken = async (tokenId) => {
    dispatch(actionRemoveFollowToken(tokenId));
    Toast.showSuccess('Add coin again to restore balance.', {
      duration: 500,
    });
  };

  const renderItem = React.useCallback(({ item }) => {
    const { id, amount, swipable } = item;
    return (
      <Token
        tokenId={id}
        amount={amount}
        swipable={swipable}
        style={[
          styledFollow.token,
        ]}
        onPress={() => handleSelectToken(id, amount)}
        handleRemoveToken={() => handleRemoveToken(id)}
      />
    );
  }, [selectPrivacyTokenID]);

  return (
    <View fullFlex borderTop>
      <Extra />
      <FlatList
        data={data}
        refreshControl={(
          <RefreshControl
            tintColor="white"
            refreshing={isRefreshing}
            onRefresh={loadBalance}
          />
        )}
        renderItem={renderItem}
        keyExtractor={renderKeyExtractor}
      />
    </View>
  );
};

FollowList.propTypes = {
  loadBalance: PropTypes.func.isRequired,
};

export default compose(
  withFollowList,
)(memo(FollowList));

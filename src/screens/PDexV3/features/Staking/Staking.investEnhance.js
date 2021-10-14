import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {batch, useDispatch, useSelector} from 'react-redux';
import {stakingActions, stakingSelector} from '@screens/PDexV3/features/Staking/index';
import {HeaderRow, OneRowCoin} from '@screens/PDexV3/features/Staking/Staking.item';
import {View} from 'react-native';
import {actionSetNFTTokenData} from '@src/redux/actions/account';
import { PRVIDSTR } from 'incognito-chain-web-js/build/wallet';
import debounce from 'lodash/debounce';
import {actionToggleModal} from '@components/Modal';
import ModalBottomSheet from '@components/Modal/features/ModalBottomSheet';

const withInvest = WrappedComp => props => {
  const dispatch = useDispatch();
  const pools = useSelector(stakingSelector.stakingPoolSelector);
  const { tokenID: tokenId } = useSelector(stakingSelector.stakingInvestSelector);

  const onInit = () => (
    batch(() => {
      dispatch(actionSetNFTTokenData());
      dispatch(stakingActions.actionGetBalances([tokenId, PRVIDSTR]));
    })
  );

  const debounceInit = React.useCallback(debounce(onInit, 300), [tokenId]);

  const onSelectToken = (tokenId) => (
    batch(() => {
      dispatch(stakingActions.actionSetInvestCoin({ tokenID: tokenId }));
      dispatch(actionToggleModal());
    })
  );

  const renderModelCell = (data) => (
    <OneRowCoin
      token={data.token}
      valueText={data.userBalanceStr}
      data={data.tokenId}
      disabled={!data.userBalance}
      onPress={onSelectToken}
    />
  );
  const onSymbolPress = () => {
    dispatch(actionToggleModal({
      data: (
        <ModalBottomSheet
          title='Select coins'
          headerView={<HeaderRow array={['Name', 'Amount']} />}
          contentView={<View style={{ marginTop: 24 }}>{pools.map(renderModelCell)}</View>}
        />
      ),
      visible: true,
      shouldCloseModalWhenTapOverlay: true
    }));
  };

  React.useEffect(() => {
    if (!tokenId) return;
    debounceInit();
  }, [tokenId]);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onSymbolPress,
        }}
      />
    </ErrorBoundary>
  );
};

export default withInvest;

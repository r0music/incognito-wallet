import React, {memo} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import styled from '@screens/PDexV3/features/LiquidityHistories/LiquidityHistories.styled';
import { useDispatch, useSelector } from 'react-redux';
import {liquidityHistorySelector} from '@screens/PDexV3/features/LiquidityHistories/index';
import PropTypes from 'prop-types';
import {ArrowDown, EmptyBookIcon} from '@components/Icons';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import withHistories from '@screens/PDexV3/features/LiquidityHistories/LiquidityHistories.enhance';
import {Row} from '@src/components';
import {actionToggleModal} from '@components/Modal';
import ModalBottomSheet from '@components/Modal/features/ModalBottomSheet';
import {HeaderRow, OneRowCoin} from '@screens/PDexV3/features/Staking/Staking.item';
import globalStyled from '@src/theme/theme.styled';
import { colorsSelector } from '@src/theme';
import { RefreshControl, Text, Text3 } from '@components/core';

const Item = React.memo(({ history, isLast }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const colors = useSelector(colorsSelector);
  const onNextPress = () => {
    navigation.navigate(routeNames.WithdrawFeeLPDetail, { history });
  };
  const renderModelCell = (data) => <OneRowCoin token={data.token} valueText={data.amountStr} />;

  const onShowReward = () => {
    if (!history.showRewards) return;
    dispatch(actionToggleModal({
      data: (
        <ModalBottomSheet
          title='Rewards'
          headerView={<HeaderRow array={['Name', 'Amount']} />}
          contentView={<View style={{ marginTop: 24 }}>{history.rewards.map(renderModelCell)}</View>}
        />
      ),
      visible: true,
      shouldCloseModalWhenTapOverlay: true
    }));
  };
  return (
    <TouchableOpacity style={[styled.wrapperItem, isLast && { marginBottom: 20 }, globalStyled.defaultPaddingHorizontal, { borderBottomColor: colors.border4 }]} onPress={onNextPress}>
      <View style={styled.topRow}>
        <Text style={styled.title}>Withdraw</Text>
      </View>
      <Row spaceBetween centerVertical style={styled.bottomRow}>
        <Text3 style={styled.desc}>{history?.timeStr}</Text3>
        <TouchableOpacity style={[styled.bottomRow, { alignItems: 'center' }]} onPress={onShowReward}>
          <Text3 style={[
            styled.status,
            !!history.statusColor && { color: history.statusColor }
          ]}
          >
            {history?.statusStr}
          </Text3>
          {history.showRewards && (
            <View style={{ marginLeft: 10 }}>
              <ArrowDown />
            </View>
          )}
        </TouchableOpacity>
      </Row>
    </TouchableOpacity>
  );
});

const RemoveLP = ({ onRefresh }) => {
  const isFetching = useSelector(liquidityHistorySelector.isFetchingWithdrawFeeLP);
  const histories = useSelector(liquidityHistorySelector.mapWithdrawFeeLPData);
  const renderItem = (data) => <Item history={data.item} isLast={data.index === (histories.length - 1)} />;
  const renderContent = () => {
    return (
      <View style={mainStyle.fullFlex}>
        <FlatList
          refreshControl={(
            <RefreshControl
              refreshing={isFetching}
              onRefresh={onRefresh}
            />
          )}
          data={histories}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <EmptyBookIcon message="Your history is empty" />
          }
        />
      </View>
    );
  };
  return (
    renderContent()
  );
};

Item.propTypes = {
  history: PropTypes.object.isRequired,
  isLast: PropTypes.bool.isRequired
};

export default withHistories(memo(RemoveLP));

import React, {memo} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import styled from '@screens/PDexV3/features/LiquidityHistories/LiquidityHistories.styled';
import {useSelector} from 'react-redux';
import {liquidityHistorySelector} from '@screens/PDexV3/features/LiquidityHistories/index';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { ActivityIndicator, RefreshControl, Text, Text3 } from '@components/core';
import {EmptyBookIcon} from '@components/Icons';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import withHistories from '@screens/PDexV3/features/LiquidityHistories/LiquidityHistories.enhance';
import globalStyled from '@src/theme/theme.styled';
import { colorsSelector } from '@src/theme';

const Item = React.memo(({ history, isLast }) => {
  const navigation = useNavigation();
  const colors = useSelector(colorsSelector);
  const onNextPress = () => {
    navigation.navigate(routeNames.RemoveLPDetail, { history });
  };
  return (
    <TouchableOpacity style={[styled.wrapperItem, isLast && { marginBottom: 20 }, globalStyled.defaultPaddingHorizontal, { borderBottomColor: colors.border4 }]} onPress={onNextPress}>
      <View style={styled.topRow}>
        <Text style={styled.title}>Remove</Text>
      </View>
      <View style={styled.bottomRow}>
        <Text3 style={styled.desc}>{history?.removeLPAmountDesc}</Text3>
        <Text3 style={[
          styled.status,
          !!history.statusColor && { color: history.statusColor }
        ]}
        >
          {history?.statusStr}
        </Text3>
      </View>
    </TouchableOpacity>
  );
});

const RemoveLP = ({ onRefresh }) => {
  const isFetching = useSelector(liquidityHistorySelector.isFetchingRemoveLP);
  const histories = useSelector(liquidityHistorySelector.mapRemoveLPData);
  const renderItem = (data) => <Item history={data.item} isLast={data.index === (histories.length - 1)} />;
  const renderContent = () => {
    if (isEmpty(histories) && isFetching) return <View style={{ marginTop: 25 }}><ActivityIndicator /></View>;
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


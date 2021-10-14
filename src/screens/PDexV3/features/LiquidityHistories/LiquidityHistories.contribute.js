import React, {memo} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {liquidityHistorySelector} from '@screens/PDexV3/features/LiquidityHistories/index';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import styled from '@screens/PDexV3/features/LiquidityHistories/LiquidityHistories.styled';
import {EmptyBookIcon} from '@components/Icons';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import withHistories from '@screens/PDexV3/features/LiquidityHistories/LiquidityHistories.enhance';

const Item = React.memo(({ history, isLast }) => {
  const navigation = useNavigation();
  const onNextPress = () => navigation.navigate(routeNames.ContributeHistoryDetail, { history });
  return (
    <TouchableOpacity style={[styled.wrapperItem, isLast && { marginBottom: 20 }]} onPress={onNextPress}>
      <View style={styled.topRow}>
        <Text style={styled.title}>{`${history.poolId ? 'Contribute' : 'Create pool'}`}</Text>
      </View>
      <View style={styled.bottomRow}>
        <Text style={styled.desc}>{history?.contributeAmountDesc}</Text>
        <Text style={styled.status}>{history?.statusStr}</Text>
      </View>
    </TouchableOpacity>
  );
});

const Contribute = ({ onRefresh }) => {
  const histories = useSelector(liquidityHistorySelector.mapContributeData);
  const isFetching = useSelector(liquidityHistorySelector.isFetchingContribute);
  const renderItem = (data) => <Item history={data.item} isLast={data.index === (histories.length - 1)} />;
  const renderContent = () => {
    return (
      <View style={mainStyle.fullFlex}>
        <FlatList
          refreshing={isFetching}
          onRefresh={onRefresh}
          data={histories}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
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

export default withHistories(memo(Contribute));

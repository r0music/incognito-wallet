import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {historiesSelector, getHistoryByPairID} from '@screens/PDexV3/features/RemovePoolHistories/RemovePoolHistories.selector';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import styled from '@screens/PDexV3/features/RemovePoolHistories/RemovePoolHistories.styled';
import withHistories from './RemovePoolHistories.enhance';

const RemovePoolHook = React.memo(({ pairID }) => {
  const navigation = useNavigation();
  const history = useSelector(getHistoryByPairID)(pairID);
  const onNextPress = () => navigation.navigate(routeNames.RemoveLPDetail, { pairID });
  return (
    <TouchableOpacity style={styled.wrapperItem} onPress={onNextPress}>
      <View style={styled.topRow}>
        <Text style={styled.title}>Remove liquidity</Text>
        <Text style={styled.status}>{history?.statusText}</Text>
      </View>
      <View style={styled.bottomRow}>
        <Text style={styled.desc}>{history?.subTextStr}</Text>
      </View>
    </TouchableOpacity>
  );
});

const RemovePoolHistories = () => {
  const histories = useSelector(historiesSelector);
  const renderItem = (item) => <RemovePoolHook pairID={item?.pairID} />;
  return (
    <View style={styled.wrapper}>
      {histories.map(renderItem)}
    </View>
  );
};

RemovePoolHistories.propTypes = {};


export default withHistories(memo(RemovePoolHistories));

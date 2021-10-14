import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {
  getHistoryByPairID,
  historiesSelector
} from '@screens/PDexV3/features/ContributeHistories/ContributeHistories.selector';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import styled from '@screens/PDexV3/features/ContributeHistories/ContributeHistories.styled';
import withHistories from './ContributeHistories.enhance';

const ContributeHook = React.memo(({ pairID }) => {
  const navigation = useNavigation();
  const history = useSelector(getHistoryByPairID)(pairID);
  const onNextPress = () => navigation.navigate(routeNames.ContributeHistoryDetail, { pairID });
  return (
    <TouchableOpacity style={styled.wrapperItem} onPress={onNextPress}>
      <View style={styled.topRow}>
        <Text style={styled.title}>Add liquidity</Text>
        <Text style={styled.status}>{history?.statusText}</Text>
      </View>
      <View style={styled.bottomRow}>
        <Text style={styled.desc}>{history?.subTextStr}</Text>
      </View>
    </TouchableOpacity>
  );
});

const ContributeHistories = () => {
  const histories = useSelector(historiesSelector);
  const renderItem = (item) => <ContributeHook pairID={item?.pairID} />;
  return (
    <View style={styled.wrapper}>
      {histories.map(renderItem)}
    </View>
  );
};

ContributeHook.propTypes = {
  pairID: PropTypes.string.isRequired
};

export default withHistories(React.memo(ContributeHistories));

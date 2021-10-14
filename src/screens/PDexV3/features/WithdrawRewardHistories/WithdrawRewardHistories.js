import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation} from 'react-navigation-hooks';
import {useSelector} from 'react-redux';
import {getHistoryByPairID, historiesSelector} from '@screens/PDexV3/features/WithdrawRewardHistories/WithdrawRewardHistories.selector';
import routeNames from '@routers/routeNames';
import styled from '@screens/PDexV3/features/WithdrawRewardHistories/WithdrawRewardHistories.styled';
import withHistories from './WithdrawRewardHistories.enhance';


const WithdrawRewardHook = React.memo(({ pairID }) => {
  const navigation = useNavigation();
  const history = useSelector(getHistoryByPairID)(pairID);
  const onNextPress = () => navigation.navigate(routeNames.WithdrawFeeLPDetail, { pairID });
  return (
    <TouchableOpacity style={styled.wrapperItem} onPress={onNextPress}>
      <View style={styled.topRow}>
        <Text style={styled.title}>Withdraw Reward</Text>
        <Text style={styled.status}>{history?.statusText}</Text>
      </View>
      <View style={styled.bottomRow}>
        <Text style={styled.desc}>{history?.subTextStr}</Text>
      </View>
    </TouchableOpacity>
  );
});


const WithdrawRewardHistories = () => {
  const histories = useSelector(historiesSelector);
  const renderItem = (item) => <WithdrawRewardHook pairID={item?.pairID} />;
  return (
    <View style={styled.wrapper}>
      {histories.map(renderItem)}
    </View>
  );
};

WithdrawRewardHistories.propTypes = {};


export default withHistories(memo(WithdrawRewardHistories));

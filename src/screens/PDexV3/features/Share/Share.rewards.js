import React from 'react';
import { HomeTabHeader } from '@screens/PDexV3/features/Home';
import { useSelector } from 'react-redux';
import {
  isFetchingSelector,
} from '@src/screens/PDexV3/features/Pools';
import { totalRewardCollectedSelector } from '@screens/PDexV3/features/Portfolio';
import { useNavigation } from 'react-navigation-hooks';
import { TouchableOpacity } from 'react-native';
import routeNames from '@routers/routeNames';
import PaperIcon from '@components/Icons/icon.paper';

const HistoryIcon = React.memo(() => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate(routeNames.LiquidityHistories)}>
      <PaperIcon />
    </TouchableOpacity>
  );
});

export default React.memo(() => {
  const totalShare = useSelector(totalRewardCollectedSelector);
  const loading = useSelector(isFetchingSelector);
  return <HomeTabHeader title="Total rewards" desc={`$${totalShare}`} loading={loading} rightIcon={<HistoryIcon />} />;
});

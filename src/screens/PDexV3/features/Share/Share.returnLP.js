import React, {memo} from 'react';
import {HomeTabHeader} from '@screens/PDexV3/features/Home';
import {useSelector} from 'react-redux';
import { isFetchingSelector, totalShareUSDSelector } from '@screens/PDexV3/features/Portfolio';
import AddSolidIcon from '@components/Icons/icon.addSolid';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';

const CreatePoolIcon = React.memo(() => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate(routeNames.CreatePool)}>
      <AddSolidIcon />
    </TouchableOpacity>
  );
});

const ReturnLP = () => {
  const totalShare = useSelector(totalShareUSDSelector);
  const loading = useSelector(isFetchingSelector);
  return <HomeTabHeader title="Pool Balance" desc={`$${totalShare}`} loading={loading} rightIcon={<CreatePoolIcon />} />;
};

export default memo(ReturnLP);

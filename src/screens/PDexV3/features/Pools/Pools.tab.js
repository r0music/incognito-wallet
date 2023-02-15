import React from 'react';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';
import { batch, useDispatch, useSelector } from 'react-redux';
import { withLayout_2 } from '@src/components/Layout';
import { liquidityActions } from '@screens/PDexV3/features/Liquidity';
import routeNames from '@routers/routeNames';
import { actionFetchPools } from '@screens/PDexV3/features/Pools/Pools.actions';
import orderBy from 'lodash/orderBy';
import { FlatList, View } from '@components/core';
import Pool from '@screens/PDexV3/features/Pool/Pool';
import debounce from 'lodash/debounce';
import { handleFilterPoolByKeySeach } from '@screens/PDexV3/features/Pools/Pools.utils';
import { Row } from '@src/components';
import globalStyled from '@src/theme/theme.styled';
import { BtnCircleBack } from '@components/Button';
import { BaseTextInputCustom } from '@components/core/BaseTextInput';
import { PoolsListHeader, styled } from '@screens/PDexV3/features/Pools/Pools.list';
import { RefreshControl } from 'react-native';
import { requestUpdateMetrics } from '@src/redux/actions/app';
import { ANALYTICS } from '@src/constants';
import {
  isFetchingSelector,
  listPoolsSelector,
} from './Pools.selector';

const PoolsList = React.memo(({ onPressPool, pools }) => {
  const refreshing = useSelector(isFetchingSelector);
  const dispatch = useDispatch();
  const onRefresh = () => dispatch(actionFetchPools());
  const data = React.useMemo(() => {
    return orderBy(pools, 'isFollowed', 'desc');
  }, [pools]);
  return (
    <FlatList
      data={data}
      refreshControl={(
        <RefreshControl
          tintColor="white"
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
      renderItem={({ item, index }) => (
        <Pool
          poolId={item.poolId}
          onPressPool={() => {
            console.log(item.poolId);
            onPressPool(item.poolId, item);
          }}
          isLast={data && (data.length - 1 === index)}
        />
      )}
      keyExtractor={({ poolId }) => poolId}
      showsVerticalScrollIndicator={false}
    />
  );
});

const PoolsListContainer = (props) => {
  const { onPressPool, listPools, style } = props;
  const navigation = useNavigation();
  const [text, setText] = React.useState(text);
  const [pools, setPools] = React.useState([]);
  const handleGoBack = () => navigation.goBack();
  const _handleGoBack = debounce(handleGoBack, 100);
  const onChange = (text) => {
    setText(text);
    if (!text) {
      return setPools(listPools);
    }
    const tokens = handleFilterPoolByKeySeach({
      data: listPools,
      keySearch: text,
    });
    setPools(tokens);
  };
  React.useEffect(() => {
    setPools(listPools);
    setText('');
  }, [listPools]);
  return (
    <>
      <Row style={[globalStyled.defaultPaddingHorizontal, { marginBottom: 16 }]} centerVertical>
        <BtnCircleBack onPress={_handleGoBack} />
        <BaseTextInputCustom
          value={text}
          inputProps={{
            onChangeText: onChange,
            placeholder: 'Select pools',
            style: styled.input,
            autoFocus: true,
          }}
        />
      </Row>
      <View style={[styled.container, style]} borderTop>
        <PoolsListHeader />
        <PoolsList onPressPool={onPressPool} pools={pools} />
      </View>
    </>
  );
};

const PoolsTab = () => {
  const onPressPoolParam = useNavigationParam('onPressPool');
  const dispatch = useDispatch();
  const listPools = (useSelector(listPoolsSelector) || []);
  console.log('5555 listPools ', listPools);
  const navigation = useNavigation();
  const onPressPool = (poolId) => {
    if (typeof onPressPoolParam === 'function') {
      return onPressPoolParam(poolId);
    }
    batch(() => {
      dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.EARN_NOW));
      dispatch(liquidityActions.actionSetContributeID({ poolId, nftId: '' }));
      navigation.navigate(routeNames.ContributePool);
    });
    // goBack();
  };
  return (
    <PoolsListContainer listPools={listPools} onPressPool={onPressPool} />
  );
};

export default withLayout_2(React.memo(PoolsTab));

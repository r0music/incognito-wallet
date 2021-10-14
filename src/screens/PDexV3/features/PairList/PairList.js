import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { styled as mainStyle } from '@screens/PDexV3/PDexV3.styled';
import { Header, LoadingContainer } from '@src/components';
import withPairs from '@screens/PDexV3/features/PairList/PairList.enhance';
import styled from '@screens/PDexV3/features/PairList/PairList.styled';
import { batch, useDispatch, useSelector } from 'react-redux';
import {
  pairsActions,
  pairsSelector,
} from '@screens/PDexV3/features/PairList/index';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { actionFetchListPools } from '@screens/PDexV3/features/Pools';
import isEmpty from 'lodash/isEmpty';
import { RefreshControl } from '@components/core';

const PairItem = ({ pair, onPressPair }) => {
  return (
    <TouchableOpacity
      style={styled.wrapper}
      onPress={() => onPressPair(pair.pairId)}
    >
      <Text style={styled.title}>{pair.symbolStr}</Text>
      <Text style={styled.poolSize}>{pair.poolSizeStr}</Text>
    </TouchableOpacity>
  );
};

const PairList = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFetching = useSelector(pairsSelector.isFetchingSelector);
  const params = useNavigationParam('params');
  const { onSearch, pairs, onPressPool } = props;
  const _onPressPool = onPressPool || params?.onPressPool;
  const onPressPair = (pairId) => {
    if (typeof _onPressPool !== 'function') return;
    batch(() => {
      dispatch(actionFetchListPools({ pairId }));
      navigation.navigate(routeNames.PoolsList, {
        params: {
          onPressPool: _onPressPool,
        },
      });
    });
  };
  const onRefresh = () => dispatch(pairsActions.actionFetchPairs());
  const renderItem = (pair) => (
    <PairItem pair={pair} key={pair.id} onPressPair={onPressPair} />
  );
  const renderContent = () => {
    if (isFetching && isEmpty(pairs)) return <LoadingContainer />;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        }
      >
        {pairs.map(renderItem)}
      </ScrollView>
    );
  };
  return (
    <View style={mainStyle.container}>
      <Header
        title="Search coins"
        canSearch
        isNormalSearch
        onTextSearchChange={onSearch}
      />
      {renderContent()}
    </View>
  );
};

PairList.defaultProps = {
  onPressPool: null,
};

PairList.propTypes = {
  pairs: PropTypes.array.isRequired,
  onSearch: PropTypes.func.isRequired,
  onPressPool: PropTypes.func,
};

PairItem.propTypes = {
  pair: PropTypes.object.isRequired,
  onPressPair: PropTypes.func.isRequired,
};

export default withPairs(React.memo(PairList));

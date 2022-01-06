import React from 'react';
import {
  FlatList,
  Text,
  RefreshControl,
  View, TouchableOpacity,
} from '@src/components/core';
import { BaseTextInputCustom } from '@src/components/core/BaseTextInput';
import { FONT, COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from '@src/components';
import Pool from '@screens/PDexV3/features/Pool';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import globalStyled from '@src/theme/theme.styled';
import { BtnCircleBack } from '@components/Button';
import debounce from 'lodash/debounce';
import { useNavigation } from 'react-navigation-hooks';
import { InfoIcon } from '@components/Icons';
import routeNames from '@routers/routeNames';
import helperConst from '@src/constants/helper';
import { actionFetchPools } from './Pools.actions';
import { handleFilterPoolByKeySeach } from './Pools.utils';
import { isFetchingSelector } from './Pools.selector';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: FONT.SIZE.small,
    color: COLORS.colorGrey3,
    fontFamily: FONT.NAME.medium,
  },
  input: {
    width: 200,
    height: 40,
  }
});

const HEADER_FACTORIES = [
  {
    text: 'Reward pools',
    style: {
      flex: 1,
      marginRight: 15,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  },
  {
    text: 'APR',
    style: {
      width: 80,
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginRight: 5,
      textAlign: 'right',
    },
  },
];

export const PoolsListHeader = React.memo(() => {
  const navigation = useNavigation();
  return (
    <Row style={{ marginTop: 32, marginBottom: 8, marginHorizontal: 24 }}>
      {HEADER_FACTORIES.map((item) => (
        <Text key={item.text} style={{ ...styled.headerText, ...item.style }}>
          {item.text}
        </Text>
      ))}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(routeNames.Helper, helperConst.HELPER_CONSTANT.LIQUIDITY_APR)
        }
        style={{ width: 30, flexDirection: 'row' ,justifyContent: 'flex-end' }}
      >
        <InfoIcon />
      </TouchableOpacity>
    </Row>
  );
});

export const PoolsList = React.memo(({ onPressPool, pools }) => {
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
  const { onPressPool, listPools, style, canSearch } = props;
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
      {canSearch && (
        <Row style={[globalStyled.defaultPaddingHorizontal, { marginBottom: 16 }]} centerVertical>
          <BtnCircleBack onPress={_handleGoBack} />
          <BaseTextInputCustom
            value={text}
            inputProps={{
              onChangeText: onChange,
              placeholder: 'Search coins',
              style: styled.input,
              autFocus: true,
            }}
          />
        </Row>
      )}
      <View style={[styled.container, style]} borderTop>
        <PoolsList onPressPool={onPressPool} pools={pools} />
      </View>
    </>
  );
};

PoolsList.propTypes = {
  onPressPool: PropTypes.func.isRequired,
  pools: PropTypes.array.isRequired,
};

PoolsListContainer.defaultProps = {
  style: undefined,
  canSearch: true
};

PoolsListContainer.propTypes = {
  onPressPool: PropTypes.func.isRequired,
  listPools: PropTypes.array.isRequired,
  style: PropTypes.any,
  canSearch: PropTypes.bool
};

export default React.memo(PoolsListContainer);

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  ButtonRefresh,
  ButtonChart,
  BtnOrderHistory,
} from '@src/components/Button';
import { Text, TouchableOpacity } from '@src/components/core';
import { Row } from '@src/components';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { COLORS, FONT } from '@src/styles';
import { ArrowGreyDown } from '@src/components/Icons';
import { actionToggleModal } from '@src/components/Modal';
import ModalBottomSheet from '@src/components/Modal/features/ModalBottomSheet';
import { PoolsTab } from '@screens/PDexV3/features/Pools';
import {
  orderLimitDataSelector,
  rateDataSelector,
} from '@screens/PDexV3/features/OrderLimit';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
    marginTop: 24,
  },
  top: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  block1: {
    marginRight: 15,
    flexDirection: 'row',
  },
  pool: {
    fontSize: FONT.SIZE.medium,
    fontFamily: FONT.NAME.medium,
    color: COLORS.black,
  },
  rate: {
    fontSize: FONT.SIZE.avgLarge,
    fontFamily: FONT.NAME.medium,
    color: COLORS.black,
    marginRight: 8,
  },
  priceChange24hWrapper: {
    borderRadius: 4,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 30,
    maxWidth: 50,
  },
  priceChange24h: {
    fontSize: FONT.SIZE.superSmall,
    fontFamily: FONT.NAME.medium,
    color: COLORS.white,
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const GroupActions = ({
  callback,
  onPressRefresh,
  hasChart = false,
}) => {
  const navigation = useNavigation();
  const {
    poolId,
    poolStr,
    priceChange24hStr,
    colorPriceChange24h,
    mainColor,
  } = useSelector(orderLimitDataSelector);
  const { rateStr } = useSelector(rateDataSelector);
  const dispatch = useDispatch();
  const onPressChart = () =>
    navigation.navigate(routeNames.Chart, {
      poolId,
    });
  const handleSelectPool = () => {
    dispatch(
      actionToggleModal({
        visible: true,
        shouldCloseModalWhenTapOverlay: true,
        data: (
          <ModalBottomSheet
            customContent={
              <PoolsTab
                onPressPool={async (poolId) => {
                  dispatch(actionToggleModal());
                  if (typeof callback === 'function') {
                    callback(poolId);
                  }
                }}
              />
            }
          />
        ),
      }),
    );
  };
  return (
    <View style={styled.container}>
      <Row style={styled.top}>
        <TouchableOpacity
          style={styled.block1}
          onPress={() => handleSelectPool()}
        >
          <Text style={styled.pool}>{poolStr}</Text>
          <ArrowGreyDown />
        </TouchableOpacity>
        {hasChart && (
          <Row style={styled.block2}>
            <ButtonRefresh
              style={{ marginRight: 10 }}
              onPress={onPressRefresh}
            />
            <ButtonChart style={{ marginRight: 10 }} onPress={onPressChart} />
            <BtnOrderHistory
              onPress={() => navigation.navigate(routeNames.TradeOrderHistory)}
            />
          </Row>
        )}
      </Row>
      <Row style={styled.bottom}>
        <Text
          style={{ ...styled.rate, color: colorPriceChange24h }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {rateStr}
        </Text>
        <View
          style={{
            ...styled.priceChange24hWrapper,
            backgroundColor: colorPriceChange24h,
          }}
        >
          <Text
            style={{
              ...styled.priceChange24h,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {priceChange24hStr}
          </Text>
        </View>
      </Row>
    </View>
  );
};

GroupActions.propTypes = {
  callback: PropTypes.func.isRequired,
  onPressRefresh: PropTypes.func,
  hasChart: PropTypes.bool,
};

export default React.memo(GroupActions);

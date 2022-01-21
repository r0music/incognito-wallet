import React from 'react';
import isEmpty from 'lodash/isEmpty';
import ButtonBasic from '@src/components/Button/ButtonBasic';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ACCOUNT_CONSTANT } from 'incognito-chain-web-js/build/wallet';
import { Row } from '@src/components';
import { Text, TouchableOpacity } from '@src/components/core';
import { FONT } from '@src/styles';
import LoadingTx from '@src/components/LoadingTx';
import RemoveSuccessDialog from '@src/screens/Setting/features/RemoveStorage/RemoveStorage.Dialog';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { colorsSelector } from '@src/theme';
import { CancelIcon } from '@src/components/Icons';
import {
  actionWithdrawOrder,
  actionFetchedOrderDetail,
} from './OrderLimit.actions';

const styled = StyleSheet.create({
  orderWrapper: {
    flex: 1,
    paddingVertical: 24,
  },
  orderValue: {
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    fontFamily: FONT.NAME.medium,
  },
  dividerStyled: {
    marginVertical: 15,
  },
  orderItem: {
    flex: 1,
  },
  btnWithdraw: {
    width: 60,
    height: 18,
  },
  btnTitleWithdraw: {
    fontSize: FONT.SIZE.small,
    fontFamily: FONT.NAME.medium,
  },
  subText: {
    fontSize: FONT.SIZE.small,
    fontFamily: FONT.NAME.regular,
  },
  mainText: {
    fontSize: FONT.SIZE.regular,
    fontFamily: FONT.NAME.medium,
  },
  block1: {
    textAlign: 'left',
    alignItems: 'flex-start',
    flex: 1.5,
  },
  block2: {
    textAlign: 'left',
    alignItems: 'flex-start',
    flex: 1,
  },
  block3: {
    textAlign: 'right',
    alignItems: 'flex-end',
    flex: 1,
  },
  mv8: {
    marginVertical: 8,
  },
});

const OrderValue = React.memo(({ style, value }) => {
  return <Text style={style}>{value}</Text>;
});

const Order = React.memo(({ data, visibleDivider }) => {
  const navigation = useNavigation();
  const colors = useSelector(colorsSelector);
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const [withdrawData, setWithdrawData] = React.useState({});
  const onPressWithdrawOrder = async (data) => {
    await setWithdrawData(data);
    await setVisible(true);
  };
  const onWithdrawOrder = async (data) => {
    const isCancelOrder = !isEmpty(withdrawData);
    let task = [dispatch(actionWithdrawOrder(data || withdrawData))];
    if (isCancelOrder) {
      task.push(setVisible(false));
    }
    await Promise.all(task);
  };
  if (!data) {
    return null;
  }
  const {
    infoStr,
    timeStr,
    mainColor,
    visibleBtnCancel,
    statusStr,
    btnTitleCancel,
    requestTx,
    btnClaim,
    visibleBtnClaim,
    btnTitleClaim,
    btnCancel,
    withdrawing,
    type,
    priceStr,
    amountStr,
    percentStr1,
    visibleBtnAction,
    nftid,
  } = data;
  const renderHook = () => {
    let comp = null;
    if (visibleBtnCancel) {
      comp = (
        <ButtonBasic
          disabled={!visibleBtnAction}
          btnStyle={styled.btnWithdraw}
          title={btnTitleCancel}
          titleStyle={styled.btnTitleWithdraw}
          onPress={() =>
            !!visibleBtnAction &&
            onPressWithdrawOrder({
              ...data,
              txType: ACCOUNT_CONSTANT.TX_TYPE.CANCEL_ORDER_LIMIT,
              subTitle: 'Are you sure you want to cancel\nthis limit order?',
            })
          }
        />
      );
    } else if (visibleBtnClaim) {
      comp = (
        <ButtonBasic
          disabled={!visibleBtnAction}
          btnStyle={styled.btnWithdraw}
          titleStyle={styled.btnTitleWithdraw}
          title={btnTitleClaim}
          onPress={() => {
            !!visibleBtnAction &&
              onWithdrawOrder({
                requestTx,
                txType: ACCOUNT_CONSTANT.TX_TYPE.CLAIM_ORDER_LIMIT,
                nftid,
              });
          }}
        />
      );
    } else if (btnCancel) {
      comp = <OrderValue style={styled.subText} value={btnCancel} />;
    } else if (btnClaim) {
      comp = <OrderValue style={styled.subText} value={btnClaim} />;
    } else {
      comp = <OrderValue style={styled.subText} value={statusStr} />;
    }
    return comp;
  };
  const handleNavOrderDetail = async () => {
    await dispatch(actionFetchedOrderDetail(data));
    navigation.navigate(routeNames.OrderLimitDetail);
  };
  return (
    <TouchableOpacity onPress={handleNavOrderDetail}>
      <Row style={styled.orderWrapper}>
        <View style={{ ...styled.orderItem, ...styled.block1 }}>
          <Text
            style={{
              textTransform: 'capitalize',
              ...styled.mainText,
              color: mainColor,
            }}
          >
            {`${type} `}
            <Text
              style={{
                ...styled.mainText,
                textTransform: 'uppercase',
              }}
            >
              {infoStr}
            </Text>
          </Text>
          <Text
            style={{ ...styled.subText, color: colors.subText, ...styled.mv8 }}
          >
            Price
          </Text>
          <Text style={{ ...styled.mainText, color: mainColor }}>
            {priceStr}
          </Text>
        </View>
        <View style={{ ...styled.orderItem, ...styled.block2 }}>
          <Text style={{ ...styled.subText, color: colors.subText }}>
            {timeStr}
          </Text>
          <Text
            style={{ ...styled.subText, color: colors.subText, ...styled.mv8 }}
          >
            Amount
          </Text>
          <Text style={styled.mainText}>{amountStr}</Text>
        </View>
        <View style={{ ...styled.orderItem, ...styled.block3 }}>
          {renderHook()}
          <Text
            style={{ ...styled.subText, color: colors.subText, ...styled.mv8 }}
          >
            Fill
          </Text>
          <Text style={styled.mainText}>{percentStr1}</Text>
        </View>
      </Row>
      {withdrawing && <LoadingTx />}
      <RemoveSuccessDialog
        visible={visible}
        onPressCancel={() => setVisible(false)}
        onPressAccept={() => onWithdrawOrder()}
        title="Cancel this order"
        subTitle={withdrawData?.subTitle || ''}
        acceptStr="Yes, cancel"
        canStr="Keep it"
        icon={
          <Row center style={{ marginBottom: 7 }}>
            <CancelIcon />
          </Row>
        }
      />
    </TouchableOpacity>
  );
});

export default Order;

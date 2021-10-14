import React from 'react';
import { View } from 'react-native';
import { ReviewOrder, TradeSuccessModal } from '@screens/PDexV3/features/Trade';
import { useDispatch, useSelector } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { Hook, styled as extraStyled } from '@screens/PDexV3/features/Extra';
import { Text } from '@src/components/core';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { orderLimitDataSelector } from './OrderLimit.selector';
import { actionBookOrder, actionInit } from './OrderLimit.actions';
import { useSubInfo } from './OrderLimit.subInfo';

const Review = () => {
  const dispatch = useDispatch();
  const {
    mainColor,
    ordering,
    rateStr,
    reviewOrderTitle,
    reviewOrderDesc,
    reviewOrderDescValue,
    cfmTitle,
  } = useSelector(orderLimitDataSelector);
  const navigation = useNavigation();
  const [subInfoFactories] = useSubInfo();
  const hooksFactories = [
    {
      label: reviewOrderDesc,
      value: reviewOrderDescValue || '',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      boldLabel: true,
      boldValue: true,
    },
    {
      label: 'Rate',
      value: rateStr || '',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
    },
    ...subInfoFactories,
  ];
  const handleConfirm = async () => {
    try {
      const tx = await dispatch(actionBookOrder());
      if (tx) {
        dispatch(
          actionToggleModal({
            data: (
              <TradeSuccessModal
                title="Order initialed"
                desc={cfmTitle}
                btnColor={mainColor}
                handleTradeSucesss={() => {
                  navigation.navigate(routeNames.OrderLimit);
                  dispatch(actionInit(true));
                }}
              />
            ),
            visible: true,
          }),
        );
      }
    } catch {
      //
    }
  };
  return (
    <ReviewOrder
      extra={
        <View>
          <Text style={{ ...extraStyled.specialTitle, color: mainColor }}>
            {reviewOrderTitle}
          </Text>
          {hooksFactories.map((hook) => (
            <Hook key={hook.label} {...hook} />
          ))}
        </View>
      }
      handleConfirm={handleConfirm}
      loadingTx={ordering}
      btnColor={mainColor}
    />
  );
};

Review.propTypes = {};

export default React.memo(Review);

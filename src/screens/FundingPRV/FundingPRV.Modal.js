
import FundingPRV from '@src/components/FundingPRV';
import React from 'react';

import routeNames from '@src/router/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { actionFundingPRVModalVisible } from './FundingPRV.actions';
import { modalVisibleSelector } from './FundingPRV.selector';
import enhance from './FundingPRV.enhance';

const FundingPRVModal = () => {

  const isVisible = useSelector(modalVisibleSelector);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const cancelOnClick = async () => {
    console.log(' TO DO ');
  };

  const onTouchOutside = async () => {
    console.log(' TO DO ');
  };

  const confirmOnClick = async () => {

    dispatch(actionFundingPRVModalVisible(false));
  // await dispatch(actionFundingPRVModalVisible(false));
    navigation.navigate(routeNames.Trade, {
      data: {},
    });
  };

  // if (isVisible) return null

  return (
    <FundingPRV
      isVisible={isVisible}
      cancelOnClick={cancelOnClick}
      confirmOnClick={confirmOnClick}
      onTouchOutside={onTouchOutside}
    />
);
};

export default enhance(FundingPRVModal);

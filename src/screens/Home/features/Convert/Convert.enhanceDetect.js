import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch, useSelector} from 'react-redux';
import { accountSelector } from '@src/redux/selectors';
import { BottomBar } from '@components/core';
import {useFocusEffect, useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { ExHandler } from '@services/exception';
import { actionFetchCoinsV1 } from '@screens/Home/features/Convert/Convert.actions';
import { convertCoinsDataSelector } from '@screens/Home/features/Convert/Convert.selector';
import { switchAccountSelector } from '@src/redux/selectors/account';

const enhance = WrappedComp => (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const account = useSelector(accountSelector.defaultAccountSelector);
  const { isConvert } = useSelector(convertCoinsDataSelector);
  const switchingAccount = useSelector(switchAccountSelector);

  const fetchCoinsVersion1 = () => {
    try {
      dispatch(actionFetchCoinsV1());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const navigateConvert = () => {
    navigation.navigate(routeNames.ConvertTokenList);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!account) return;
      fetchCoinsVersion1();
    }, [account]),
  );

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
      {(isConvert && !switchingAccount) && (
        <BottomBar
          onPress={navigateConvert}
          text="Looking for your old coins? Convert them to v2"
        />
      )}
    </ErrorBoundary>
  );
};

export default enhance;

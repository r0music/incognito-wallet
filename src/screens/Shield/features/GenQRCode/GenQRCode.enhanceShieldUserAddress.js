import { BtnInfo } from '@components/Button';
import Header from '@components/Header';
import LoadingContainer from '@components/LoadingContainer';
import routeNames from '@routers/routeNames';
import { styled } from '@screens/Shield/features/GenQRCode/GenQRCode.styled';
import {
  shieldDataSelector,
  shieldSelector
} from '@screens/Shield/Shield.selector';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { childSelectedPrivacySelector } from '@src/redux/selectors';
import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { useSelector } from 'react-redux';

const enhance = (WrappedComp) => (props) => {
  const { isFetching, isFetched } = useSelector(shieldSelector);
  const { isShieldAddressDecentralized } = useSelector(shieldDataSelector);
  const navigation = useNavigation();
  const selectedPrivacy = useSelector(
    childSelectedPrivacySelector.childSelectedPrivacy,
  );
  const handleToggleTooltip = () => {
    navigation.navigate(routeNames.CoinInfo, { isShieldAddressDecentralized });
  };
  const hasError = !isFetched && !isFetching;

  const handleGoBack = () => {
    navigation.navigate(routeNames.Shield);
  };

  const renderHeader = React.useCallback(
    () => (
      <Header
        title={`Shield ${selectedPrivacy?.externalSymbol}`}
        titleStyled={styled.titleStyled}
        rightHeader={<BtnInfo isBlack onPress={handleToggleTooltip} />}
        onGoBack={handleGoBack}
      />
    ),
    [selectedPrivacy],
  );

  const renderLoading = React.useCallback(
    () => (
      <>
        {renderHeader()}
        <LoadingContainer />
      </>
    ),
    [],
  );

  /** render loading */
  if (isFetching) {
    return renderLoading();
  }

  /** render term off user */
  // if (
  //   isShieldAddressDecentralized === false
  //   && (selectedPrivacy?.currencyType === 1 || selectedPrivacy?.currencyType === 3)
  //   && !selectedPrivacy?.isVerified
  //   && selectedPrivacy?.priceUsd <= 0
  //   && !hasError
  //   && showTerm
  // ) {
  //   return renderTermOfUse();
  // }

  return (
    <ErrorBoundary>
      {renderHeader()}
      <WrappedComp {...{ ...props, isFetching, isFetched, hasError }} />
    </ErrorBoundary>
  );
};

export default enhance;

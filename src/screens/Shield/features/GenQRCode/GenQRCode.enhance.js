import { BtnInfo } from '@components/Button';
import Header from '@components/Header';
import { withLayout_2 } from '@components/Layout';
import withLazy from '@components/LazyHoc/LazyHoc';
import LoadingContainer from '@components/LoadingContainer';
import routeNames from '@routers/routeNames';
import withAccount from '@screens/DexV2/components/account.enhance';
import withShieldData from '@screens/Shield/features/GenQRCode/GenQRCode.data';
import { styled } from '@screens/Shield/features/GenQRCode/GenQRCode.styled';
import ShieldDecentralized from '@screens/Shield/features/ShieldDecentralized';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { CONSTANT_COMMONS } from '@src/constants';
import { THEME_KEYS } from '@src/theme/theme.consts';
import { themeModeSelector } from '@src/theme/theme.selector';
import React from 'react';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { useSelector } from 'react-redux';
import { compose } from 'recompose';

const enhance = (WrappedComp) => (props) => {
  const {
    tokenSymbol,
    decentralized,
    isFetched,
    isFetching,
    selectedPrivacy,
    handleShield,
  } = props;
  const { currencyType } = selectedPrivacy;
  const navigation = useNavigation();
  const selectedTerm = useNavigationParam('selectedTerm');

  const handleToggleTooltip = () => {
    navigation.navigate(routeNames.CoinInfo, { decentralized });
  };
  const hasError = !isFetched && !isFetching;

  const handleGoBack = () => {
    return navigation.goBack();
  };
  const themeMode = useSelector(themeModeSelector);
  const renderHeader = React.useCallback(
    () => (
      <Header
        title={`Shield ${tokenSymbol}`}
        titleStyled={styled.titleStyled}
        rightHeader={(
          <BtnInfo
            isBlack={themeMode !== THEME_KEYS.DARK_THEME}
            onPress={handleToggleTooltip}
          />
        )}
        onGoBack={handleGoBack}
      />
    ),
    [tokenSymbol],
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

  React.useEffect(() => {
    if (
      (!CONSTANT_COMMONS.CURRENCY_TYPE_BRIDGE.includes(currencyType) &&
        !selectedTerm) ||
      (selectedTerm === 'GENERATE_ADDRESS' &&
        typeof handleShield === 'function')
    ) {
      handleShield();
    }
  }, [selectedTerm]);

  /** render loading */
  if (isFetching) {
    return renderLoading();
  }

  if (selectedTerm === 'CONNECT_WALLET') {
    return <ShieldDecentralized {...{ ...props }} />;
  }

  return (
    <ErrorBoundary>
      {renderHeader()}
      <WrappedComp
        {...{
          ...props,
          isFetching,
          isFetched,
          hasError,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withAccount,
  withShieldData,
  withLazy,
  withLayout_2,
  enhance,
);

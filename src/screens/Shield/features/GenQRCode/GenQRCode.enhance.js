import React, { useState } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import LoadingContainer from '@components/LoadingContainer';
import Header from '@components/Header';
import { styled } from '@screens/Shield/features/GenQRCode/GenQRCode.styled';
import { BtnInfo } from '@components/Button';
import routeNames from '@routers/routeNames';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import TermOfUseShield from '@screens/Shield/features/TermOfUseShield';
import { withLayout_2 } from '@components/Layout';
import withShieldData from '@screens/Shield/features/GenQRCode/GenQRCode.data';
import { compose } from 'recompose';
import { CONSTANT_COMMONS } from '@src/constants';
import withAccount from '@screens/DexV2/components/account.enhance';
import ShieldDecentralized from '@screens/Shield/features/ShieldDecentralized';
import { PRV_ID } from '@src/screens/Dex/constants';
import { useSelector } from 'react-redux';
import { themeModeSelector } from '@src/theme/theme.selector';
import { THEME_KEYS } from '@src/theme/theme.consts';
import withLazy from '@components/LazyHoc/LazyHoc';

const enhance = (WrappedComp) => (props) => {
  const {
    tokenSymbol,
    decentralized,
    isFetched,
    isFetching,
    selectedPrivacy,
    handleShield,
  } = props;
  const { currencyType, isDecentralized }  = selectedPrivacy;

  const [showTerm, setShowTerm] = useState(true);
  const [selectedTerm, setSelectedTerm] = React.useState(undefined);
  const navigation = useNavigation();
  const disableBackToShield = useNavigationParam('disableBackToShield');

  const handleToggleTooltip = () => {
    navigation.navigate(routeNames.CoinInfo, { decentralized });
  };
  const hasError = !isFetched && !isFetching;

  const handleGoBack = () => {
    if (disableBackToShield ) return navigation.goBack();
    navigation.navigate(routeNames.Shield);
  };
  const themeMode = useSelector(themeModeSelector);
  const renderHeader = React.useCallback(() => (
    <Header
      title={`Shield ${tokenSymbol}`}
      titleStyled={styled.titleStyled}
      rightHeader={<BtnInfo isBlack={themeMode !== THEME_KEYS.DARK_THEME} onPress={handleToggleTooltip} />}
      onGoBack={handleGoBack}
    />
  ), [tokenSymbol]);

  const renderLoading = React.useCallback(() => (
    <>
      {renderHeader()}
      <LoadingContainer />
    </>
  ), []);

  const renderTermOfUse = () => {
    return (
      <TermOfUseShield
        {
        ...{
          ...props,
          selectedTerm,
          onNextPress: () => setShowTerm(false),
          onSelected: index => setSelectedTerm(index)
        }}
      />
    );
  };

  React.useEffect(() => {
    if ((!CONSTANT_COMMONS.CURRENCY_TYPE_BRIDGE.includes(currencyType) && selectedTerm === undefined) && typeof handleShield === 'function') {
      handleShield();
    }
  }, [selectedTerm]);

  /** render loading */
  if (isFetching) {
    return renderLoading();
  }

  /** render term off user */
  if (
    isDecentralized &&
    showTerm &&
    selectedPrivacy?.tokenId !== PRV_ID &&
    currencyType !== CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC &&
    currencyType !== CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.POLYGON_ERC20 &&
    currencyType !== CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.SPL
  ) {
    return renderTermOfUse();
  }

  if (selectedTerm === 1) {
    return (
      <ShieldDecentralized {...{ ...props, setShowTerm}} />
    );
  }

  return (
    <ErrorBoundary>
      {renderHeader()}
      <WrappedComp {...{ ...props, isFetching, isFetched, hasError, selectedTerm, setSelectedTerm}} />
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

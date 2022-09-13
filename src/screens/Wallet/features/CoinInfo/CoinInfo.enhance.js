import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { getTokenInfo } from '@src/services/api/token';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import { useNavigation } from 'react-navigation-hooks';
import format from '@src/utils/format';
import { CONSTANT_CONFIGS, CONSTANT_COMMONS } from '@src/constants';
import routeNames from '@src/router/routeNames';
import { PRVIDSTR } from 'incognito-chain-web-js/build/wallet';

export const getNetworkName = (selectedPrivacy) => {
  const { tokenId, networkName, network } = selectedPrivacy;
  let _network = network;
  if (tokenId === PRVIDSTR) {
    _network = networkName;
  }
  return `${_network} network`;
};

const enhance = (WrappedComp) => (props) => {
  const [state, setState] = React.useState({
    info: null,
  });
  const { info } = state;
  const navigation = useNavigation();

  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const {
    tokenId,
    isVerified,
    isBep2Token,
    contractId,
    pDecimals,
    incognitoTotalSupply,
    externalSymbol,
    symbol,
    listUnifiedToken,
    isPUnifiedToken,
    listChildToken,
  } = selectedPrivacy;

  const getContractLinkByTokenInfo = (tokenInfo) => {
    if (
      tokenInfo?.isErc20Token ||
      tokenInfo?.isETH ||
      tokenInfo?.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20
    ) {
      return `${CONSTANT_CONFIGS.ETHERSCAN_URL}/token/${tokenInfo?.contractId}`;
    }
    if (
      tokenInfo?.isBep2Token ||
      tokenInfo?.isBSC ||
      tokenInfo?.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BEP20
    ) {
      return `${CONSTANT_CONFIGS.BSCSCAN_URL}/token/${tokenInfo?.contractId}`;
    }
    if (tokenInfo?.isPolygonErc20Token || tokenInfo?.isMATIC) {
      return `${CONSTANT_CONFIGS.POLYGONSCAN_URL}/token/${tokenInfo?.contractId}`;
    }
    if (tokenInfo?.isFantomErc20Token || tokenInfo?.isFTM) {
      return `${CONSTANT_CONFIGS.FANTOMSCAN_URL}/token/${tokenInfo?.contractId}`;
    }
    if (tokenInfo?.isAvaxErc20Token || tokenInfo?.isAVAX) {
      return `${CONSTANT_CONFIGS.AVAXSCAN_URL}/token/${tokenInfo?.contractId}`;
    }
    return '';
  };

  const getContracts = () => {
    let contractInfos = [];

    if (tokenId === PRVIDSTR) {
      listChildToken?.map((item) => {
        contractInfos.push({
          label: `${item?.network} ID`,
          value: item?.contractId,
          link: getContractLinkByTokenInfo(item),
          copyable: true,
        });
      });
    } else if (isPUnifiedToken && listUnifiedToken?.length > 0) {
      listUnifiedToken?.map((item) => {
        contractInfos.push({
          label: `${item?.network} ID`,
          value: item?.contractId,
          link: getContractLinkByTokenInfo(item),
          copyable: true,
        });
      });
    } else {
      contractInfos.push({
        label: 'Contract ID',
        value: contractId,
        link: getContractLinkByTokenInfo(selectedPrivacy),
        copyable: true,
      });
    }
    return contractInfos;
  };

  const contracts = getContracts();

  let infosFactories = [
    {
      label: 'Origin',
      value: getNetworkName(selectedPrivacy),
    },
    {
      label: 'Original Ticker',
      value: externalSymbol || symbol,
      link:
        isBep2Token &&
        `${CONSTANT_CONFIGS.BINANCE_EXPLORER_URL}/asset/${externalSymbol}`,
    },

    {
      label: 'Coin ID',
      value: tokenId,
      copyable: true,
    },
    {
      label: 'Coin supply',
      value: incognitoTotalSupply
        ? format.amount(incognitoTotalSupply, pDecimals)
        : null,
    },
    {
      label: 'Owner name',
      value: info?.ownerName,
      copyable: true,
    },
    {
      label: 'Owner address',
      value: info?.ownerAddress,
      copyable: true,
    },
    { label: 'Owner email', value: info?.ownerEmail, copyable: true },
    {
      label: 'Owner website',
      value: info?.ownerWebsite,
      link: info?.ownerWebsite,
    },
  ];

  

  infosFactories = [...infosFactories, ...contracts];

  const handleGetIncognitoTokenInfo = async () => {
    if (!tokenId) return;
    try {
      const infoData = await getTokenInfo({ tokenId });
      await setState({ ...state, info: infoData });
    } catch (e) {
      console.log(e);
    }
  };
  const handlePressVerifiedInfo = () =>
    navigation.navigate(routeNames.CoinInfoVerify);
  React.useEffect(() => {
    handleGetIncognitoTokenInfo();
  }, [tokenId]);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          infosFactories,
          handlePressVerifiedInfo,
          tokenId,
          isVerified,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
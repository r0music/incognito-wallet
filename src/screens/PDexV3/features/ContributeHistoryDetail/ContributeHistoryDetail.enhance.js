import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useSelector} from 'react-redux';
import {selectedPrivacySelector} from '@src/redux/selectors';
import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';
import isEmpty from 'lodash/isEmpty';
import formatUtil from '@utils/format';
import {useNavigationParam} from 'react-navigation-hooks';
import {getHistoryByPairID} from '@screens/PDexV3/features/ContributeHistories/ContributeHistories.selector';
import { ACCOUNT_CONSTANT } from 'incognito-chain-web-js/build/wallet';
import flatten from 'lodash/flatten';

const enhance = WrappedComp => props => {
  const pairID = useNavigationParam('pairID');
  const history = useSelector(getHistoryByPairID)(pairID);
  const { statusText, mapContributes } = history;
  const getPrivacyDataByTokenID = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID);
  const handleOpenLink = (txID) => {
    if (!txID) return;
    linkingService.openUrl(`${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txID}`,);
  };
  const getSectionHook = (data, index) => {
    index += 1;
    const { requestTx, returnAmount, respondTx, amount, tokenId, status } = data;
    const token = getPrivacyDataByTokenID(tokenId);
    return [
      {
        label: `TxID${index}`,
        valueText: requestTx,
        copyable: true,
        openUrl: true,
        handleOpenLink: () => {
          handleOpenLink(requestTx);
        }
      },
      {
        label: `Status${index}`,
        valueText: status ? status.charAt(0).toUpperCase() + status.slice(1) : '',
        disabled: isEmpty(status) || (statusText !== ACCOUNT_CONSTANT.CONTRIBUTE_STATUS.WAITING),
      },
      {
        label: `ResponseTxID${index}`,
        valueText: respondTx,
        copyable: true,
        disabled: isEmpty(respondTx),
        openUrl: true,
        handleOpenLink: () => {
          handleOpenLink(respondTx);
        }
      },
      {
        label: `Amount${index}`,
        valueText: `${formatUtil.amountFull(amount, token.pDecimals)} ${token.symbol}`,
        disabled: !amount
      },
      {
        label: `ReturnAmount${index}`,
        valueText: `${formatUtil.amountFull(returnAmount, token.pDecimals)} ${token.symbol}`,
        disabled: !returnAmount
      }
    ];
  };
  const hookFactories = React.useMemo(() => {
    const headHook = [
      {
        label: 'PairID',
        valueText: pairID,
        copyable: true,
      },
      {
        label: 'Status',
        valueText: statusText,
      },
    ];
    const mainHooks = flatten((mapContributes || []).map(getSectionHook));
    return [...headHook, ...mainHooks];
  }, [history]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          hookFactories,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;

import React from 'react';
import { MESSAGES } from '@screens/Dex/constants';
import { ANALYTICS } from '@src/constants';
import { ExHandler } from '@services/exception';
import accountService from '@services/wallet/accountService';
import { useDispatch, useSelector } from 'react-redux';
import { actionAddFollowToken } from '@src/redux/actions/token';
import { actionLogEvent } from '@src/screens/Performance';
import { accountSelector } from '@src/redux/selectors';
import { walletSelector } from '@src/redux/selectors/wallet';
import { requestUpdateMetrics } from '@src/redux/actions/app';
import {useError} from '@components/UseEffect/useError';

const withTrade = (WrappedComp) => (props) => {
  const [error, setError] = React.useState('');
  const [trading, setTrading] = React.useState(false);
  const errorMessage = useError(error);
  const account = useSelector(accountSelector.defaultAccountSelector);
  const wallet = useSelector(walletSelector);
  const {
    inputValue,
    inputToken,
    outputToken,
    minimumAmount,
    fee,
    onTradeSuccess,
    tradingFee,
  } = props;

  const dispatch = useDispatch();

  const trade = async () => {
    if (trading) return;
    setTrading(true);
    setError('');
    try {
      dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.TRADE));
      const reqTrade = {
        account,
        wallet,
        fee,
        tokenIDToBuy: outputToken.id,
        tokenIDToSell: inputToken.id,
        sellAmount: inputValue,
        tradingFee,
        minAcceptableAmount: minimumAmount,
      };
      console.log('reqTrade', {
        fee,
        tokenIDToBuy: outputToken.id,
        tokenIDToSell: inputToken.id,
        sellAmount: inputValue,
        tradingFee,
        minAcceptableAmount: minimumAmount,
      });
      let result = await accountService.createAndSendTradeRequestTx(reqTrade);
      if (result?.txId) {
        onTradeSuccess(true);
      }
    } catch (error) {
      if (error) {
        dispatch(
          actionLogEvent({
            desc: `Trade has error: ${error?.message || error} with Code: ${
              error?.code
            }`,
          }),
        );
      }
      setError(new ExHandler(error).getMessage(error?.message || MESSAGES.TRADE_ERROR));
    } finally {
      setTrading(false);
      dispatch(actionAddFollowToken(inputToken?.id));
      dispatch(actionAddFollowToken(outputToken?.id));
    }
  };

  return (
    <WrappedComp
      {...{
        ...props,
        trading,
        onTrade: trade,
        error: errorMessage,
      }}
    />
  );
};

export default withTrade;

/* eslint-disable no-empty */
import React, { useMemo, useState } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { MESSAGES } from '@src/constants';
import { Toast } from '@components/core';
import APIService from '@services/api/miner/APIService';
import NodeService from '@services/NodeService';
import { ExHandler } from '@services/exception';
import accountService from '@services/wallet/accountService';
import { onClickView } from '@utils/ViewUtil';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionUpdateWithdrawing as updateWithdrawing,
  updateWithdrawTxs,
} from '@screens/Node/Node.actions';
import { getValidNodes, checkValidNode, findAccountFromListAccounts, checkAccountBalanceForNode } from '@screens/Node/Node.utils';
import { listAllMasterKeyAccounts } from '@src/redux/selectors/masterKey';
import { MAX_FEE_PER_TX } from '@src/components/EstimateFee/EstimateFee.utils';
import { getPrivacyPRVInfo, validatePRVBalanceSelector } from '@src/redux/selectors/selectedPrivacy';

const enhanceWithdraw = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const listAccount = useSelector(listAllMasterKeyAccounts);

  const [loadingWithrawAll, setLoadingWithrawAll] = useState(false);
  const { feePerTx, prvBalanceOriginal, pDecimals, feePerTxToHumanStr, feeAndSymbol } = useSelector(getPrivacyPRVInfo);
  const validatePRVBalanceFn = useSelector(validatePRVBalanceSelector);
  
  const { listDevice, noRewards, withdrawTxs, withdrawing } = props;

  const withdrawable = useMemo(() => {
    const validNodes = getValidNodes(listDevice);
    const vNodes = validNodes.filter((device) => device.IsVNode);
    const pNodes = validNodes.filter((device) => device.IsPNode);
    const vNodeWithdrawable =
      vNodes.length && vNodes.length !== withdrawTxs?.length;
    const pNodeWithdrawable =
      pNodes.length && pNodes.some((item) => item.IsFundedStakeWithdrawable);
    return (!noRewards && vNodeWithdrawable) || pNodeWithdrawable;
  }, [withdrawTxs, listDevice, noRewards]);

  const showToastMessage = (message = '', duration = 10000) => {
    message && Toast.showInfo(message, { duration });
  };

  const showToastErrorMessage = (message = '', duration = 20000) => {
    message && Toast.showError(message, { duration });
  };

  // Support withdraw VNode | PNode unstaked
  const sendWithdrawTx = async (paymentAddress, tokenIds) => {
    const _withdrawTxs = {};
    for (const tokenId of tokenIds) {
      const account = findAccountFromListAccounts({
        accounts: listAccount,
        address: paymentAddress
      });
      const res = await accountService.createAndSendWithdrawRewardTx({
        tokenID: tokenId,
        account,
        wallet: account.Wallet,
        fee: MAX_FEE_PER_TX,
      });
      _withdrawTxs[paymentAddress] = res?.txId;
    }
    dispatch(updateWithdrawTxs(Object.assign(withdrawTxs, _withdrawTxs)));
    return _withdrawTxs;
  };

  const handleWithdraw = async (device, showToast = true) => {
    try {
      const account = device.Account;
      const allRewards = device?.AllRewards;
      // Case withdraw VNode | PNode unstaked
      if (device.IsVNode || device.IsFundedUnstaked) {

        const { PaymentAddress } = account || {};
        // get tokens can withdraw with PaymentAddress
        const tokenIds = allRewards.reduce((tokens, currentReward) => {
          let tokenIds = tokens;
          if (currentReward?.balance > 0) {
            tokenIds.push(currentReward?.id);
            return tokenIds;
          }
          return tokenIds;
        }, []);
        const txs = await sendWithdrawTx(PaymentAddress, tokenIds);
        console.debug('Handle withdraw', txs);
        const message = MESSAGES.VNODE_WITHDRAWAL;

        if (showToast) {
          showToastMessage(message);
        }
        return txs;
      } else {
        // PNode requesting withdraw rewards
        if (device.IsPNode && !device?.IsFundedStakeWithdrawable) {
          return true;
        }
        // Case withdraw PNode
        await APIService.requestWithdraw({
          ProductID: device.ProductId,
          QRCode: device.qrCodeDeviceId,
          ValidatorKey: device.ValidatorKey,
          PaymentAddress: device.PaymentAddressFromServer,
        });
        device.IsFundedStakeWithdrawable = await NodeService.isWithdrawable(
          device,
        );
        const message = MESSAGES.PNODE_WITHDRAWAL;

        if (showToast) {
          showToastMessage(message);
        }
      }
    } catch (error) {
      if (showToast) {
        new ExHandler(error).showErrorToast(true);
      }
      throw error;
    }
  };

  const handleMessageDevicesWithdrawInvalid = (devices) => {
    let messages = '';
    let accountNameList = [];
    devices.map(item => {
      accountNameList.push(item.device.AccountName || item.device.Name);
      // messages = messages + `AccountName: ${item.device.AccountName || item.device.Name} \n ${item.errorMessage || ''} \n\n`;
    });
    messages = `AccountName: ${accountNameList.join(', ')} \nInsufficient PRV balance to cover network fee. \n ${feeAndSymbol} is required per node. `;
    return messages;
  };

  const handleWithdrawAll = async () => {

    let devicesListCanWithdraw = [];
    let devicesListCanNotWithdraw = [];

    dispatch(updateWithdrawing(true));
    setLoadingWithrawAll(true);
    for (const device of listDevice) {
      try {
        if (checkValidNode(device)) {
          const {isValid, errorMessage} = await checkAccountBalanceForNode(device, listAccount);
          if (isValid) devicesListCanWithdraw.push(device);
          else devicesListCanNotWithdraw.push({ device, errorMessage });
          // await handleWithdraw(device, false);
        }
      } catch {
        /*Ignore the error*/
      } finally {
      }
    }

    // console.log(' FINAL ', {
    //   devicesListCanWithdraw,
    //   devicesListCanNotWithdraw
    // });

    //Hanlde withdraw with devices valid
    let jobWithdraw = [];
    devicesListCanWithdraw.map(device => {
      jobWithdraw.push(handleWithdraw(device, false));
    });
    await Promise.all(jobWithdraw);

   //Hanlde withdraw with devices in-valid
    if (devicesListCanNotWithdraw && devicesListCanNotWithdraw.length > 1) {
      showToastErrorMessage(handleMessageDevicesWithdrawInvalid(devicesListCanNotWithdraw));
    } else {
      showToastMessage(MESSAGES.ALL_NODE_WITHDRAWAL);
    }

    // Turn-off Loading
    dispatch(updateWithdrawing(false));
    setLoadingWithrawAll(false);
  };
  
  const handlePressWithdraw = onClickView(handleWithdraw);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          withdrawing,
          withdrawable,
          noRewards,
          withdrawTxs,

          handleWithdrawAll,
          handlePressWithdraw,
          loadingWithrawAll,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceWithdraw;

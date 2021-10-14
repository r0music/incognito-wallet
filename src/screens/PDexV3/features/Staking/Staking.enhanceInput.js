import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {change} from 'redux-form';
import {formConfigsInvest, formConfigsWithdrawInvest, formConfigsWithdrawReward} from '@screens/PDexV3/features/Staking/Staking.constant';

const enhanceInput = WrappedComp => props => {
  const dispatch = useDispatch();
  const onInvestMax = (text) => dispatch(change(formConfigsInvest.formName, formConfigsInvest.input, text));
  const onWithdrawMaxInvest =(text) => dispatch(change(formConfigsWithdrawInvest.formName, formConfigsWithdrawInvest.input, text));
  const onWithdrawMaxReward = (text) => dispatch(change(formConfigsWithdrawReward.formName, formConfigsWithdrawReward.input, text));
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onInvestMax,
          onWithdrawMaxInvest,
          onWithdrawMaxReward,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceInput;

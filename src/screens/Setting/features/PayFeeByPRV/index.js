import React from 'react';
import { Switch } from '@components/core';
import Section, { sectionStyle } from '@screens/Setting/features/Section';
import { Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  actionToggleUsePRVToPayFee,
  isUsePRVToPayFeeSelector,
} from '@screens/Setting';
import { ConvertIcon } from '@components/Icons';

const PayFeeByPRVSection = () => {
  const toggle = useSelector(isUsePRVToPayFeeSelector);
  const dispatch = useDispatch();
  const onToggleValue = async () => await dispatch(actionToggleUsePRVToPayFee());
  return (
    <Section
      label="Use PRV to pay fee"
      headerRight={<Switch onValueChange={onToggleValue} value={toggle} />}
      headerIcon={<ConvertIcon />}
      customItems={[
        <View
          key="use-prv-to-pay-fee"
          onPress={toggle}
          style={[sectionStyle.subItem]}
        >
          <Text style={[sectionStyle.desc]}>
            Enjoy discount when trading
          </Text>
        </View>,
      ]}
    />
  );
};

export default React.memo(PayFeeByPRVSection);

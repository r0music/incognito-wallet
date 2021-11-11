import React from 'react';
import { Switch } from '@components/core';
import Section, { sectionStyle } from '@screens/Setting/features/Section';
import { Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  decimalDigitsSelector,
  actionToggleDecimalDigits,
} from '@screens/Setting';
import { DecimalDigitIcon } from '@components/Icons';

const DecimalDigitsSection = () => {
  const toggle = useSelector(decimalDigitsSelector);
  const dispatch = useDispatch();
  const onToggleValue = async () => await dispatch(actionToggleDecimalDigits());
  return (
    <Section
      label="Decimal Digits"
      headerRight={<Switch onValueChange={onToggleValue} value={toggle} />}
      headerIcon={<DecimalDigitIcon />}
      customItems={[
        <View
          key="decimal-digits"
          onPress={toggle}
          style={[sectionStyle.subItem]}
        >
          <Text style={[sectionStyle.desc]}>
            {'Limit main asset\ndisplays to 5 decimal digits'}
          </Text>
        </View>,
      ]}
    />
  );
};

export default React.memo(DecimalDigitsSection);

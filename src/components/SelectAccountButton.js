import React from 'react';
import toLower from 'lodash/toLower';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { accountSelector } from '@src/redux/selectors';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { listAllMasterKeyAccounts } from '@src/redux/selectors/masterKey';
import { switchMasterKey } from '@src/redux/actions/masterKey';
import accountService from '@services/wallet/accountService';
import styled from 'styled-components/native';
import { colorsSelector } from '@src/theme';
import { FONT } from '@src/styles';
import { TouchableOpacity, Text } from './core';

const styles = StyleSheet.create({
  btnStyle: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  accountName: {
    ...FONT.TEXT.incognitoP1,
  },
});

const CustomTouchableOpacity = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.black1};
`;

const SelectAccountButton = ({
  ignoredAccounts,
  disabled,
  handleSelectedAccount,
}) => {
  const colors = useSelector(colorsSelector);
  const account = useSelector(accountSelector.defaultAccountSelector);
  const defaultAccountName = useSelector(
    accountSelector.defaultAccountNameSelector,
  );
  const accounts = useSelector(listAllMasterKeyAccounts);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const onNavSelectAccount = () => {
    if (disabled) return;
    navigation.navigate(routeNames.SelectAccount, {
      ignoredAccounts,
      handleSelectedAccount,
    });
  };
  const checkAccount = async () => {
    try {
      if (ignoredAccounts.includes(toLower(account?.name))) {
        const accountNames = accounts.map((item) => item.accountName);
        const validAccounts = accountNames.filter(
          (name) => !ignoredAccounts.includes(toLower(name)),
        );
        if (validAccounts && validAccounts.length) {
          await dispatch(
            switchMasterKey(
              validAccounts[0].MasterKeyName,
              accountService.getAccountName(validAccounts[0]),
            ),
          );
        }
      }
    } catch (error) {
      console.log('CHECK ACCOUNT ERROR', error);
    }
  };
  React.useEffect(() => {
    checkAccount();
  }, []);
  return (
    <CustomTouchableOpacity
      disabled={disabled}
      onPress={onNavSelectAccount}
      style={[styles.btnStyle, { borderColor: colors.against, borderWidth: 1 }]}
    >
      <Text style={[styles.accountName]} numberOfLines={1} ellipsizeMode="tail">
        {defaultAccountName}
      </Text>
    </CustomTouchableOpacity>
  );
};

SelectAccountButton.propTypes = {
  ignoredAccounts: PropTypes.array,
  disabled: PropTypes.bool,
  handleSelectedAccount: PropTypes.func,
};

SelectAccountButton.defaultProps = {
  ignoredAccounts: [],
  disabled: false,
};

export default SelectAccountButton;

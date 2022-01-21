import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  actionSwitchAccountFetched,
  actionSwitchAccountFetching,
} from '@src/redux/actions/account';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import {
  defaultAccount,
  switchAccountSelector,
} from '@src/redux/selectors/account';
import { Text, Text3, Toast, TouchableOpacity } from '@src/components/core';
import { ExHandler } from '@src/services/exception';
import debounce from 'lodash/debounce';
import { FONT } from '@src/styles';
import Row from '@components/Row';
import { switchMasterKey } from '@src/redux/actions/masterKey';
import { RatioIcon } from '@components/Icons';
import styled from 'styled-components/native';
import { actionToggleModal } from '@src/components/Modal';
import ModalSwitchingAccount from './SelectAccount.modalSwitching';

const itemStyled = StyleSheet.create({
  wrapper: {
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  selected: {},
  container: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 9,
  },
  address: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 7,
    marginTop: 4,
  },
});

const CustomRow = styled(Row)`
  border: 1px solid ${({ theme }) => theme.border1};
`;

const AccountItem = React.memo(
  ({
    accountName,
    PrivateKey,
    PaymentAddress,
    MasterKeyName,
    handleSelectedAccount,
  }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const onSelect = useNavigationParam('onSelect');
    const account = useSelector(defaultAccount);
    const switchingAccount = useSelector(switchAccountSelector);
    if (!accountName) {
      return null;
    }
    const onSelectAccount = async () => {
      try {
        if (switchingAccount) {
          return;
        }
        await dispatch(actionSwitchAccountFetching());
        await dispatch(
          actionToggleModal({
            visible: true,
            data: <ModalSwitchingAccount />,
          }),
        );
        if (PrivateKey === account.PrivateKey) {
          Toast.showInfo(`Your current account is "${accountName}"`);
          return;
        }
        await dispatch(switchMasterKey(MasterKeyName, accountName));

      } catch (e) {
        new ExHandler(
          e,
          `Can not switch to account "${accountName}", please try again.`,
        ).showErrorToast();
      } finally {
        await dispatch(actionSwitchAccountFetched());
        dispatch(
          actionToggleModal()
        );
        if (typeof handleSelectedAccount === 'function') {
          handleSelectedAccount();
        }
        if (!onSelect) {
          navigation.goBack();
        } else {
          onSelect();
        }
      }
    };

    const isCurrentAccount = useMemo(
      () => PrivateKey === account.PrivateKey,
      [PrivateKey, account.PrivateKey],
    );

    // eslint-disable-next-line react/prop-types
    const Component = ({ style }) => (
      <CustomRow style={[itemStyled.wrapper, style]}>
        <View style={itemStyled.container}>
          <Row centerVertical spaceBetween>
            <Text style={itemStyled.name} numberOfLines={1}>
              {accountName}
            </Text>
            <RatioIcon selected={isCurrentAccount} />
          </Row>
          <Text3
            style={itemStyled.address}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {PaymentAddress}
          </Text3>
        </View>
      </CustomRow>
    );

    if (!switchingAccount) {
      return (
        <TouchableOpacity onPress={debounce(onSelectAccount, 100)}>
          <Component style={[isCurrentAccount ? itemStyled.selected : null]} />
        </TouchableOpacity>
      );
    }

    return <Component />;
  },
);

AccountItem.defaultProps = {
  handleSelectedAccount: null,
};

AccountItem.propTypes = {
  accountName: PropTypes.string.isRequired,
  PaymentAddress: PropTypes.string.isRequired,
  PrivateKey: PropTypes.string.isRequired,
  MasterKeyName: PropTypes.string.isRequired,
  handleSelectedAccount: PropTypes.func,
};

export default AccountItem;

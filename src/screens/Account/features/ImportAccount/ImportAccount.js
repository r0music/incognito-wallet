import { Text, TouchableOpacity, View, Button, ScrollView, ScrollViewBorder } from '@src/components/core';
import { Text4 } from '@src/components/core/Text';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  createForm,
  InputField,
  InputQRField,
} from '@src/components/core/reduxForm';
import React from 'react';
import { ButtonBasic } from '@src/components/Button';
import { Header } from '@src/components';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';
import styleSheet from './ImportAccount.styled';
// eslint-disable-next-line import/no-cycle
import withImportAccount from './ImportAccount.enhance';


export const formImportAccount = {
  formName: 'formImportAccount',
  privateKey: 'privateKey',
  accountName: 'accountName',
};

const Form = createForm(formImportAccount.formName);

const ImportAccount = (props) => {
  const {
    getAccountValidator,
    getPrivateKeyValidator,
    handleImportAccount,
    handleImportMasterKey,
    toggle,
    randomName,
    handleChangeRandomName,
    disabledForm,
    wantImport,
    onConfirm,
    importing,
    checking,
  } = props;

  const renderForm = () => {
    return (
      <View borderTop fullFlex>
        <Form>
          {({ handleSubmit, submitting }) => (
            <>
              {toggle && randomName ? (
                <View style={styleSheet.randomNameField}>
                  <Text style={styleSheet.randomNameLabel}>Keychain name</Text>
                  <View style={styleSheet.randomNameValue}>
                    <Text4
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styleSheet.randomNameText}
                    >
                      {randomName}
                    </Text4>
                    <TouchableOpacity
                      onPress={handleChangeRandomName}
                      style={styleSheet.randomNameChangeBtn}
                    >
                      <Text style={styleSheet.randomNameChangeBtnText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Field
                  component={InputField}
                  componentProps={{ autoFocus: true, style: { marginTop: 0 } }}
                  name="accountName"
                  placeholder="Keychain name"
                  label="Keychain name"
                  validate={getAccountValidator()}
                />
              )}
              <Field
                component={InputQRField}
                name="privateKey"
                placeholder="Enter private key"
                label="Private Key"
                validate={getPrivateKeyValidator()}
              />
              <Button
                title={(checking || submitting) ? 'Importing...' : 'Import'}
                buttonStyle={styleSheet.submitBtn}
                onPress={checking ? undefined : handleSubmit(handleImportAccount)}
                disabled={disabledForm || submitting || checking}
              />
            </>
          )}
        </Form>
      </View>
    );
  };

  const renderConfirm = () => {
    return (
      <View borderTop fullFlex>
        <Text4 style={styleSheet.actionText}>
          This keychain is not linked to any of your current master keys. Import its master key to restore all associated keychains, or import this keychain only.
        </Text4>
        <View style={styleSheet.actions}>
          <Button
            title="Import master key"
            buttonStyle={[styleSheet.submitBtn, styleSheet.action]}
            onPress={importing ? undefined : handleImportMasterKey}
            disabled={importing}
          />
          <Button
            title={importing ? 'Importing...' : 'Import keychain only'}
            buttonStyle={[styleSheet.submitBtn, styleSheet.action]}
            onPress={importing ? undefined : onConfirm}
            disabled={importing}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <Header title="Import keychain" />
      <ScrollViewBorder>
        {wantImport ? renderConfirm() : renderForm()}
      </ScrollViewBorder>
    </>
  );
};

ImportAccount.defaultProps = {};

ImportAccount.propTypes = {
  disabledForm: PropTypes.bool.isRequired,
  getAccountValidator: PropTypes.func.isRequired,
  getPrivateKeyValidator: PropTypes.func.isRequired,
  handleImportAccount: PropTypes.func.isRequired,
  toggle: PropTypes.bool.isRequired,
  randomName: PropTypes.string.isRequired,
  handleChangeRandomName: PropTypes.func.isRequired,
  handleImportMasterKey: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  importing: PropTypes.bool.isRequired,
  wantImport: PropTypes.bool.isRequired,
  checking: PropTypes.bool.isRequired,
};

export default compose(
  withLayout_2,
  withImportAccount
)(ImportAccount);

import React from 'react';
import { ExHandler } from '@services/exception';
import { accountServices } from '@services/wallet';
import { migratePRVProvide } from '@services/api/pool';
import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';
import appConstant from '@src/constants/app';
import { MESSAGES } from '@screens/Dex/constants';
import { useError } from '@components/UseEffect/useError';

const withConfirm = (WrappedComp) => (props) => {
  const [error, setError] = React.useState('');
  const errorMessage = useError(error);
  const [providing, setProviding] = React.useState(false);
  const [readyToRequest, setReadyToRequest] = React.useState(false);
  const [disable, setDisable] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const captchaRef = React.useRef(null);
  const { value, onSuccess, account, wallet, selectedTerm} = props;

  const handleProvideApi = async (captchaCode) => {
    try {
      setDisable(false);
      if (!readyToRequest) return;
      const signEncode = await accountServices.signPoolWithdraw({
        account,
        wallet,
        amount: value,
      });
      await migratePRVProvide({
        paymentAddress: account.PaymentAddress,
        signEncode,
        verifyCode: captchaCode,
        amount: value,
        termID: selectedTerm?.termID,
      });
      onSuccess(true);
    } catch (error) {
      setReadyToRequest(false);
      setError(
        new ExHandler(error).getMessage(
          error?.message || MESSAGES.REQUEST_MIGRATE_TOKEN_ERROR,
        ),
      );
    } finally {
      setProviding(false);
    }
  };

  const handleRequestMigrate = async () => {
    try {
      if (!readyToRequest || captchaRef.current) {
        setReadyToRequest(true);
        setTimeout(() => {
          captchaRef.current?.refreshToken();
        }, 1000);
      }
      return true;
    } catch (e) {
      setReadyToRequest(false);
      setProviding(false);
      setError(new ExHandler(e).getMessage());
    }
  };

  const onConfirmPress = async () => {
    try {
      if (providing || !captchaRef.current) return;
      setProviding(true);
      handleRequestMigrate().then();
    } catch (error) {
      handleRequestMigrate().then();
    }
  };

  const onRefresh = () => {
    if (disable) return;
    setRefreshing(true);
    setError('');
    setProviding(false);
    setReadyToRequest(false);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  return (
    <>
      <ReCaptchaV3
        ref={captchaRef}
        captchaDomain={appConstant.CAPTCHA_DOMAIN}
        siteKey={appConstant.CAPTCHA_KEY}
        onReceiveToken={handleProvideApi}
      />
      <WrappedComp
        {...{
          ...props,
          providing,
          error: errorMessage,
          disable,
          refreshing,

          onRefresh,
          onConfirm: onConfirmPress,
        }}
      />
    </>
  );
};

export default withConfirm;

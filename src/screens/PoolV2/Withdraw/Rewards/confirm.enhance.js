import React from 'react';
import { ExHandler } from '@services/exception';
import { withdrawReward } from '@services/api/pool';
import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';
import appConstant from '@src/constants/app';
import { accountServices } from '@services/wallet';
import {useError} from '@components/UseEffect/useError';

const withConfirm = WrappedComp => (props) => {
  const captchaRef = React.useRef(null);
  const [error, setError] = React.useState('');
  const errorMessage = useError(error);
  const [disable, setDisable] = React.useState(true);
  const [withdrawing, setWithdrawing] = React.useState(false);
  const { account, wallet, onSuccess } = props;

  const onConfirmPress = async () => {
    if(captchaRef.current && !withdrawing) {
      setWithdrawing(true);
      setTimeout(() => {
        captchaRef.current?.refreshToken();
      }, 1000);
    }
  };

  const handleWithDraw = async (verifyCode) => {
    if (disable) return setDisable(false);
    if (!verifyCode) return;

    setWithdrawing(true);
    setError('');

    try {
      const signEncode = await accountServices.signPoolWithdraw({
        account,
        wallet,
        amount: 0
      });
      await withdrawReward(account.PaymentAddress, signEncode, verifyCode);
      onSuccess(true);
    } catch (error) {
      setError(new ExHandler(error).getMessage());
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <>
      <ReCaptchaV3
        ref={captchaRef}
        captchaDomain={appConstant.CAPTCHA_DOMAIN}
        siteKey={appConstant.CAPTCHA_KEY}
        onReceiveToken={handleWithDraw}
      />
      <WrappedComp
        {...{
          ...props,
          withdrawing,
          onConfirm: onConfirmPress,
          error: errorMessage,
          disable,
        }}
      />
    </>
  );
};

export default withConfirm;

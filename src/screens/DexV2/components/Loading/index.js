import { Modal } from 'react-native';
import PropTypes from 'prop-types';
import { ActivityIndicator, Text, Text3, View } from '@components/core/index';
import { COLORS } from '@src/styles';
import React, { useLayoutEffect } from 'react';
import KeepAwake from 'react-native-keep-awake';
import { useSelector } from 'react-redux';
import { defaultAccountSelector } from '@src/redux/selectors/account';
import accountService from '@src/services/wallet/accountService';
import { walletSelector } from '@src/redux/selectors/wallet';
import stylesheet from './style';

const Loading = ({ open, showPercent, forcePercent }) => {
  const account = useSelector(defaultAccountSelector);
  const wallet = useSelector(walletSelector);
  const [state, setState] = React.useState({
    percent: 0,
    message: '',
  });

  const { percent, message } = state;
  const progress = async () => {
    const [percent, message] = await Promise.all([
      accountService.getProgressTx(account, wallet),
      accountService.getDebugMessage(account, wallet),
    ]);
    percent && setState({ ...state, percent, message });
  };

  useLayoutEffect(() => {
    forcePercent && setState({ ...state, percent: forcePercent, message });
  }, [forcePercent]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      progress();
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return (
    <Modal animationType="fade" transparent visible={open}>
      <View style={stylesheet.container}>
        <View style={stylesheet.wrapper}>
          <ActivityIndicator size="large" />
          {showPercent && (
            <>
              <Text style={stylesheet.percent}>{`${percent}%`}</Text>
              {!!global.isDebug() && !!message && (
                <Text style={stylesheet.desc}>{message}</Text>
              )}
            </>
          )}
          <Text style={stylesheet.desc}>Completing this action...</Text>
          <Text3 style={stylesheet.desc}>
            Please do not navigate away from the app.
          </Text3>
        </View>
        <KeepAwake />
      </View>
    </Modal>
  );
};

Loading.propTypes = {
  open: PropTypes.bool.isRequired,
  showPercent: PropTypes.bool,
  forcePercent: PropTypes.number,
};

Loading.defaultProps = {
  showPercent: true,
  forcePercent: 0,
};

export default Loading;

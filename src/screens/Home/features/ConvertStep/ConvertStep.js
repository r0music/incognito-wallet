import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import styles from '@screens/Home/features/Convert/Convert.styled';
import { ActivityIndicator } from '@components/core';
import { Icon } from 'react-native-elements';
import { COLORS } from '@src/styles';
import { ScreenHeight } from '@utils/devices';
import { useDispatch, useSelector } from 'react-redux';
import { convertCoinsDataSelector, convertGetConvertStepSelector } from '@screens/Home/features/Convert/Convert.selector';
import { ButtonBasic } from '@components/Button';
import { actionConvertCoins } from '@screens/Home/features/Convert/Convert.actions';
import { MESSAGES } from '@screens/Dex/constants';
import { getDefaultAccountWalletSelector } from '@src/redux/selectors/shared';
import {Row} from '@src/components';
import {CONSTANT_CONFIGS} from '@src/constants';
import {defaultAccountSelector} from '@src/redux/selectors/account';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';

const ConvertStep = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { convertStep: currentStep, messages, isConverting, isConverted, percents }= useSelector(convertCoinsDataSelector);
  const steps = useSelector(convertGetConvertStepSelector);
  const accountWallet = useSelector(getDefaultAccountWalletSelector);
  const defaultAccount = useSelector(defaultAccountSelector);
  const flatListRef = React.useRef(null);
  const [message, setMessage] = React.useState('');
  const onFaucetPress = () => {
    navigation.navigate(routeNames.WebView, {
      url: CONSTANT_CONFIGS.FAUCET_URL + `address=${defaultAccount.PaymentAddress}`
    });
  };

  const renderStep = (data) => {
    const { key, name, tokenID } = data?.item;
    const status = messages.find((item) => item?.tokenID === tokenID);
    const percent = percents[tokenID] || 0;
    let statusColor = COLORS.black;
    let error;
    if (status) {
      const { errorMessage } = status;
      error = errorMessage;
      statusColor = errorMessage ? COLORS.red : COLORS.green4;
    }
    return (
      <>
        <View style={styles.log} key={key}>
          {currentStep === key ? <ActivityIndicator style={styles.logIcon} size="small" /> : (
            <Icon
              containerStyle={styles.logIcon}
              color={statusColor}
              size={12}
              name="checkbox-blank-circle"
              type="material-community"
            />
          )}
          <Text style={styles.stepText}>
            {`${name || 'Incognito Token'} (${percent}%)`}
          </Text>
        </View>
        {!!error && <Text style={styles.warningText}>{error}</Text>}
      </>
    );
  };

  const handleScrollStep = () => {
    if(!currentStep || !steps || !flatListRef.current) return;
    const index = steps.findIndex(step => step.key === currentStep);
    if (index !== -1) {
      flatListRef.current.scrollToIndex({ animated: true, index: index });
    }
  };

  const handleConvert = () => {
    if (isConverting || isConverted) return;
    dispatch(actionConvertCoins());
  };

  const progress = async () => {
    const message = await accountWallet.getDebugMessage();
    setMessage(message);
  };

  React.useEffect(() => {
    handleScrollStep();
  }, [currentStep, steps]);

  React.useEffect(() => {
    accountWallet.resetProgressTx();
    const interval = setInterval(() => {
      progress();
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return(
    <View style={{ marginTop: 30, flex: 1 }}>
      <View style={[{ maxHeight: ScreenHeight * 0.4 }]}>
        <FlatList
          ref={flatListRef}
          data={steps}
          renderItem={renderStep}
          keyExtractor={(item) => item.key}
        />
      </View>
      <Text style={styles.text}>{message}</Text>
      <Row style={{ justifyContent: 'space-between' }}>
        <ButtonBasic
          title={isConverted ? 'Converted' : isConverting ? 'Converting...' : 'Convert'}
          btnStyle={{ marginTop: 30, marginBottom: 50, width: '48%' }}
          onPress={handleConvert}
          disabled={isConverting || isConverted}
        />
        <ButtonBasic
          title="Faucet"
          btnStyle={{ marginTop: 30, marginBottom: 50, width: '48%' }}
          onPress={onFaucetPress}
        />
      </Row>
      {isConverting && (
        <Text style={styles.warning}>{MESSAGES.CONVERT_PROCESS}</Text>
      )}
    </View>
  );
};

ConvertStep.propTypes = {};

export default memo(ConvertStep);

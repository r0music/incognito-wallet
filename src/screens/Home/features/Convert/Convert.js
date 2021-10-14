import React from 'react';
import { View } from 'react-native';
import { Header, LoadingContainer, SuccessModal } from '@src/components';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';
import ConvertStep from '@screens/Home/features/ConvertStep';
import { useSelector } from 'react-redux';
import { convertCoinsDataSelector } from '@screens/Home/features/Convert/Convert.selector';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { Toast } from '@components/core';
import { MESSAGES } from '@screens/Dex/constants';
import KeepAwake from 'react-native-keep-awake';
import mainStyles from '@screens/DexV2/style';

const Convert = () => {
  const { isFetching, isConverting, isConverted, isError } = useSelector(convertCoinsDataSelector);
  const fetchCoinsV1 = useNavigationParam('fetchCoinsV1');
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
  const renderContent = () => (
    <ConvertStep />
  );

  const handleGoBack = () => {
    if (isConverting) {
      return Toast.showInfo(MESSAGES.CONVERT_PROCESS);
    }
    if (isConverted && typeof fetchCoinsV1 === 'function') {
      fetchCoinsV1();
    }
    navigation.goBack();
  };

  const handlePressSuccess = () => {
    setVisible(false);
    setTimeout(() => {
      handleGoBack();
    }, 500);
  };

  React.useEffect(() => {
    if (!isConverting && isConverted && !isError) {
      setVisible(true);
    }
  }, [isConverting, isConverted, isError]);

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="Convert Coins"
        onGoBack={handleGoBack}
      />
      <SuccessModal
        closeSuccessDialog={handlePressSuccess}
        title="Convert successfully"
        buttonTitle="OK"
        buttonStyle={mainStyles.buttonBlack}
        extraInfo="Convert successfully. Your balance will update in a couple of minutes"
        visible={visible && !isError}
      />
      {isFetching ? <LoadingContainer /> : renderContent()}
      <KeepAwake />
    </View>
  );
};

export default compose(
  withLayout_2,
)(React.memo(Convert));

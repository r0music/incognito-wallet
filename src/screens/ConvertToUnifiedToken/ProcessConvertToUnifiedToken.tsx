import { Button, Text, View } from '@src/components/core';
import Header from '@src/components/Header';
import { withLayout_2 } from '@src/components/Layout';
import { COLORS } from '@src/styles';
import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  TextStyle,
  ViewStyle,
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { ConvertProcessItem } from './ConvertProcessItem';
import { convertToUnifiedToken } from './state/operations';
import { listTokenConvertSelector } from './state/selectors';

const ProcessConvertToUnifiedToken: React.FC = () => {
  const navigation = useNavigation();
  const listTokenConvert = useSelector(listTokenConvertSelector);

  const isConvertSuccess =
    listTokenConvert?.filter((token) => token?.convertStatus === 'SUCCESSFULLY')
      ?.length === listTokenConvert?.length;

  const isConvertProcessing =
    listTokenConvert?.filter(
      (token) =>
        token?.convertStatus === 'PROCESSING' ||
        token?.convertStatus === 'PENDING' ||
        !token?.convertStatus,
    )?.length > 0;

  const isConverted =
    listTokenConvert?.filter(
      (token) =>
        token?.convertStatus === 'SUCCESSFULLY' ||
        token?.convertStatus === 'FAILED',
    )?.length === listTokenConvert?.length;

  const keyExtractor = useCallback((item) => item?.id?.toString(), []);

  const renderItem = useCallback(
    ({ item }) => <ConvertProcessItem pTokenData={item} />,
    [],
  );

  const renderItemSeparatorComponent = useCallback(
    () => <View style={itemSpace} />,
    [],
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(convertToUnifiedToken());
  }, []);

  const renderWarningBox = () => {
    return (
      <View style={warningBoxContainer}>
        <ActivityIndicator size="small" color="white" />
        <Text style={textBoxStyle}>
          Please do not navigate away till this process completes
        </Text>
      </View>
    );
  };

  const renderSuccessBox = () => {
    return (
      <View style={successBoxContainer}>
        <View style={leftBoxContainer}>
          <MaterialCommunityIcons
            size={16}
            name="check-bold"
            color={COLORS.green}
          />
        </View>
        <Text style={textBoxStyle}>The convert process completed.</Text>
      </View>
    );
  };

  const onGoBack = () => {
    navigation.popToTop();
  };

  return (
    <>
      <Header title="Convert coins" hideBackButton />
      <View borderTop fullFlex>
        {isConverted && renderSuccessBox()}
        {isConvertProcessing && renderWarningBox()}
        <FlatList
          data={listTokenConvert}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparatorComponent}
          contentContainerStyle={flatListContentContainerStyle}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          windowSize={10}
        />
      </View>
      {isConverted && (
        <View style={bottomButtonContainerStyle}>
          <Button
            title="Go back to wallet"
            onPress={onGoBack}
            titleStyle={buttonTitleStyle}
            buttonStyle={buttonStyle}
            disabledTitleStyle={buttonTitleStyle}
          />
        </View>
      )}
      <KeepAwake />
    </>
  );
};

export default withLayout_2(ProcessConvertToUnifiedToken);

const itemSpace: ViewStyle = {
  width: '100%',
  height: 16,
};

const flatListContentContainerStyle: ViewStyle = {
  flexGrow: 1,
  paddingHorizontal: 16,
  paddingVertical: 24,
};

const warningBoxContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.red1,
  borderRadius: 6,
  padding: 16,
  marginHorizontal: 16,
  marginTop: 16,
};

const leftBoxContainer: ViewStyle = {
  width: 24,
  height: 24,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: COLORS.white,
};

const successBoxContainer: ViewStyle = {
  ...warningBoxContainer,
  backgroundColor: COLORS.green,
};

const bottomButtonContainerStyle: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 16,
};
const buttonStyle: ViewStyle = {
  width: '100%',
  height: 50,
  borderRadius: 8,
};

const textBoxStyle: TextStyle = {
  fontSize: 14,
  fontWeight: '500',
  marginLeft: 16,
};

const buttonTitleStyle: TextStyle = {
  color: COLORS.white,
};

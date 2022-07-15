import { ScrollViewBorder, Text, View } from '@components/core';
import { shieldDataSelector } from '@screens/Shield/Shield.selector';
import { ButtonBasic } from '@src/components/Button';
import { CopiableTextDefault as CopiableText } from '@src/components/CopiableText';
import { View2 } from '@src/components/core/View';
import { ClockWiseIcon, ConvertIcon2 } from '@src/components/Icons';
import LoadingContainer from '@src/components/LoadingContainer';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import Tooltip from '@src/components/Tooltip/Tooltip';
import { CONSTANT_COMMONS } from '@src/constants';
import { childSelectedPrivacySelector } from '@src/redux/selectors';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { COLORS } from '@src/styles';
import { colorsSelector } from '@src/theme/theme.selector';
import convert from '@utils/convert';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import withGenQRCode from './GenQRCode.enhance';
import { styled } from './GenQRCode.styled';

const NormalText = React.memo((props) => {
  const { text, style = null, children = null } = props;
  return (
    <Text style={[styled.text, style]}>
      {text}
      {children}
    </Text>
  );
});

const ShieldError = React.memo(({ handleShield, isPortalCompatible }) => {
  return (
    <View style={styled.errorContainer}>
      <ClockWiseIcon />
      <Text style={[styled.errorText, { marginTop: 30 }]}>
        {'We seem to have hit a snag. Simply\ntap to try again.'}
      </Text>
      <ButtonBasic
        btnStyle={styled.btnRetry}
        titleStyle={styled.titleBtnRetry}
        onPress={handleShield}
        title="Try again"
      />
      {isPortalCompatible ? (
        <Text style={styled.errorText}>
          {
            'If that doesn’t work,\ncheck the bulletin board for scheduled maintenance.\n\nIf there is none,\nplease come back in an hour.'
          }
        </Text>
      ) : (
        <Text style={styled.errorText}>
          {
            'If that doesn’t work,\nplease make sure your app version is the latest.'
          }
        </Text>
      )}
    </View>
  );
});

const Extra = (props) => {
  const { address, min, expiredAt, isPortal } =
    useDebounceSelector(shieldDataSelector);
  const { selectedPrivacy, defaultFee, colors } = props;
  const navigation = useNavigation();
  const renderMinShieldAmount = () => {
    if (!min) return null;
    return (
      <>
        <View style={styled.warningBoxContainer}>
          <Text style={styled.grayText}>Minimum shield amount</Text>
          <Text style={[styled.boldText]}>
            {`${min} ${
              selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol
            }`}
          </Text>
        </View>
        <Text style={styled.orangeText}>
          Smaller amounts will be rejected by the network and lost.
        </Text>
      </>
    );
  };

  const renderEstimateShieldingTime = () => {
    let shieldingTimeText = '';
    if (isPortal) {
      shieldingTimeText = '60 mins';
    }
    if (selectedPrivacy?.isETH || selectedPrivacy?.isErc20Token) {
      shieldingTimeText = '10 mins';
    }
    if (selectedPrivacy?.isBSC || selectedPrivacy?.isBep20Token) {
      shieldingTimeText = '5 mins';
    }
    if (selectedPrivacy?.isMATIC || selectedPrivacy?.isPolygonErc20Token) {
      shieldingTimeText = '9 mins';
    }
    if (selectedPrivacy?.isFTM || selectedPrivacy?.isFantomErc20Token) {
      shieldingTimeText = '3 mins';
    }

    if (isEmpty(shieldingTimeText)) {
      return null;
    }

    return (
      <View>
        <View style={styled.noteItemContainer}>
          <View style={styled.dot} />
          <Text style={[styled.noteText, { color: colors.text1 }]}>
            {`Your ${
              selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol
            } shielding transaction is estimated to complete in ${shieldingTimeText}.`}
          </Text>
        </View>
        {!isPortal && <View style={styled.space} />}
      </View>
    );
  };

  const renderEstimateFee = () => {
    const isNativeToken =
      selectedPrivacy?.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ETH ||
      selectedPrivacy?.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BNB ||
      selectedPrivacy?.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC ||
      selectedPrivacy?.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.FTM;
    let humanFee = convert.toNumber(
      (isNativeToken ? defaultFee?.estimateFee : defaultFee?.tokenFee) || 0,
      true,
    );
    const originalFee = convert.toOriginalAmount(
      humanFee,
      selectedPrivacy?.pDecimals,
    );
    humanFee = convert.toHumanAmount(originalFee, selectedPrivacy?.pDecimals);
    humanFee = convert.toPlainString(humanFee);
    if (!humanFee || humanFee == 0) return null;
    return (
      <>
        <View style={styled.warningBoxContainer}>
          <Text style={styled.grayText}>Shielding fee (est.)</Text>
          <Text style={[styled.boldText]}>
            {`${humanFee} ${
              selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol
            }`}
          </Text>
        </View>
        <Text style={styled.orangeText}>
          This fee will be deducted from the shielded funds.
        </Text>
      </>
    );
  };

  const renderNoteBox = () => {
    return (
      <View style={styled.noteBoxContainer}>
        {renderEstimateShieldingTime()}
        {!isPortal && (
          <View style={styled.noteItemContainer}>
            <View style={styled.dot} />
            <Text style={styled.noteText}>
              Sending coins or tokens other than{' '}
              {selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol} to
              this address may result in the loss of your funds.
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderShieldAddress = () => (
    <>
      <View style={styled.qrCode}>
        <QrCodeGenerate value={address} size={175} />
        <Text style={styled.shieldDescription}>
          {selectedPrivacy?.isCentralized
            ? 'Send to this shielding address once only.'
            : `Send only ${
                selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol
              } to this shielding address.`}
        </Text>
        {selectedPrivacy?.isCentralized && !isEmpty(expiredAt) && (
          <Text style={styled.shieldExpiration}>Expires at: {expiredAt}</Text>
        )}
      </View>
      <View>
        <Text style={styled.networkTypeLabel}>Network type</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styled.networkBoxContainer}
        >
          <Text>{selectedPrivacy?.network}</Text>
          <ConvertIcon2 />
        </TouchableOpacity>
      </View>
      <Text style={styled.addressLabel}>
        {selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol} Shielding
        address
      </Text>
      <CopiableText data={address} textStyle={{ color: colors.text1 }} />
      {renderMinShieldAmount()}
      {renderEstimateFee()}
      {renderNoteBox()}
    </>
  );

  return <View style={styled.extra}>{renderShieldAddress()}</View>;
};

const Content = () => {
  return (
    <View style={[styled.content, { backgroundColor: 'white' }]}>
      <Text style={[styled.textContent, { color: 'black' }]}>
        Make sure you have selected the right coin
      </Text>
    </View>
  );
};

const GenQRCode = (props) => {
  const {
    handleShield,
    isFetching,
    isFetchFailed,
    isPortalCompatible,
    data: shieldData,
  } = props;
  const colors = useDebounceSelector(colorsSelector);
  const { address } = shieldData || {};
  const [toggle, setToggle] = React.useState(true);
  const selectedPrivacy = useDebounceSelector(
    childSelectedPrivacySelector.childSelectedPrivacy,
  );
  const [defaultFee, setDefaultFee] = React.useState({
    estimateFee: 0,
    tokenFee: 0,
  });
  if (
    (shieldData?.tokenFee || shieldData?.estimateFee) &&
    defaultFee?.estimateFee === 0 &&
    defaultFee?.tokenFee === 0
  ) {
    const temp = {
      estimateFee: shieldData?.estimateFee,
      tokenFee: shieldData?.tokenFee,
    };
    setDefaultFee(temp);
  }

  React.useEffect(() => {
    if (toggle) {
      const timeout = setTimeout(() => {
        setToggle(false);
      }, 3000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [toggle]);
  const renderComponent = () => {
    if (isFetchFailed) {
      return (
        <ShieldError
          handleShield={handleShield}
          isPortalCompatible={isPortalCompatible}
        />
      );
    }
    if (isFetching || !address) {
      return <LoadingContainer />;
    }
    return (
      <View2 style={{ flex: 1 }}>
        <ScrollViewBorder
          style={styled.scrollViewContainer}
          contentContainerStyle={styled.scrollview}
        >
          <Extra
            {...{
              ...props,
              selectedPrivacy,
              defaultFee,
              colors,
            }}
          />
        </ScrollViewBorder>
      </View2>
    );
  };

  return (
    <View style={styled.container}>
      {toggle && (
        <Tooltip
          content={<Content />}
          containerStyle={{
            backgroundColor: COLORS.black,
            borderRadius: 11,
            paddingBottom: 0,
          }}
          triangleStyle={{
            top: -50,
            right: 25,
            borderBottomColor: colors.background4,
            transform: [{ rotate: '0deg' }],
          }}
        />
      )}
      {renderComponent()}
    </View>
  );
};

NormalText.propTypes = {
  text: PropTypes.string.isRequired,
};

Extra.propTypes = {};

GenQRCode.propTypes = {
  hasError: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  handleShield: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isFetchFailed: PropTypes.bool.isRequired,
  isPortalCompatible: PropTypes.bool.isRequired,
};

export default withGenQRCode(GenQRCode);

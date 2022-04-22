import { ScrollViewBorder, Text, View } from '@components/core';
import { actionGetPRVBep20FeeToShield } from '@screens/Shield/Shield.actions';
import {
  shieldDataBscSelector,
  shieldDataSelector,
} from '@screens/Shield/Shield.selector';
import { ButtonBasic } from '@src/components/Button';
import { CopiableTextDefault as CopiableText } from '@src/components/CopiableText';
import { View2 } from '@src/components/core/View';
import { ClockWiseIcon, RatioIcon, ConvertIcon2 } from '@src/components/Icons';
import LoadingContainer from '@src/components/LoadingContainer';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import Tooltip from '@src/components/Tooltip/Tooltip';
import { CONSTANT_COMMONS } from '@src/constants';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { defaultAccountSelector } from '@src/redux/selectors/account';
import { PRV_ID } from '@src/screens/DexV2/constants';
import { ExHandler } from '@src/services/exception';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { COLORS } from '@src/styles';
import { colorsSelector } from '@src/theme/theme.selector';
import convert from '@utils/convert';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity, View as View3 } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';
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
  const { address, min, expiredAt, decentralized, isPortal } =
    useDebounceSelector(shieldDataSelector);
  const { selectedPrivacy, defaultFee, colors } = props;
  const navigation = useNavigation();
  const isPRV = selectedPrivacy?.tokenId === PRV_ID;
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
        <Text style={styled.redText}>
          Smaller amounts will be rejected by the network and lost.
        </Text>
      </>
    );
  };

  const renderMinPortalShieldAmount = () => {
    let minComp;
    const symbol = selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol;
    if (min) {
      minComp = (
        <>
          <NormalText text="Minimum: " style={{ color: colors?.text1 }}>
            <Text style={[styled.boldText]}>{`${min} ${symbol}`}</Text>
          </NormalText>
          <NormalText
            text={'Smaller amounts will be rejected\nby the network and lost.'}
            style={styled.smallText}
          />
        </>
      );
    }
    return minComp;
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
    if (!humanFee) return null;
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
        <Text style={styled.redText}>
          This fee will be deducted from the shielded funds.
        </Text>
      </>
    );
  };

  const renderShieldIncAddress = () => (
    <>
      <NormalText style={[styled.title, { color: colors.text1 }]}>
        {'Send to this shielding\naddress once only.'}
      </NormalText>
      <View style={styled.qrCode}>
        <QrCodeGenerate value={address} size={175} />
      </View>
      <View style={styled.hook}>
        {!isEmpty(expiredAt) && (
          <NormalText text="Expires at: " style={{ color: colors.text1 }}>
            <Text style={[styled.boldText, styled.countdown]}>{expiredAt}</Text>
          </NormalText>
        )}
      </View>
      <CopiableText
        data={address}
        textStyle={{ color: colors.text1 }}
        btnStyle={{ backgroundColor: colors.background6 }}
      />
      {renderMinShieldAmount()}
      {renderNoteBox()}
    </>
  );

  const renderNoteBox = () => {
    return (
      <View style={styled.noteBoxContainer}>
        <View style={styled.noteItemContainer}>
          <View style={styled.dot} />
          <Text style={styled.noteText}>
            If sending from an exchange, please take withdrawal times into
            account.
          </Text>
        </View>
        <View style={styled.space} />
        <View style={styled.noteItemContainer}>
          <View style={styled.dot} />
          <Text style={styled.noteText}>
            If maybe more reliable to use a normal wallet as an intermediary.
          </Text>
        </View>
      </View>
    );
  };

  const renderShieldUserAddress = () => (
    <>
      <View style={styled.qrCode}>
        <QrCodeGenerate value={address} size={175} />
        <Text style={styled.shieldDescription}>
          {`Send only ${
            selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol
          } to this shielding address.`}
        </Text>
      </View>
      {!isPRV && (
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
      )}
      <Text style={styled.addressLabel}>
        {selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol} Shielding
        address
      </Text>
      <CopiableText
        data={address}
        textStyle={{ color: colors.text1 }}
        btnStyle={{ backgroundColor: colors.background6 }}
      />
      {renderMinShieldAmount()}
      {renderEstimateFee()}
      {renderNoteBox()}
    </>
  );

  const renderShieldPortalAddress = () => (
    <>
      <NormalText style={[styled.title, { color: colors.text1 }]}>
        {`Send only ${
          selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol
        } \nto this shielding address.`}
      </NormalText>
      <View style={styled.qrCode}>
        <QrCodeGenerate value={address} size={175} />
      </View>
      <View style={styled.hook}>{renderMinPortalShieldAmount()}</View>
      <CopiableText
        data={address}
        textStyle={{ color: colors.text1 }}
        btnStyle={{ backgroundColor: colors.background6 }}
      />
    </>
  );

  return (
    <View style={styled.extra}>
      {isPortal
        ? renderShieldPortalAddress()
        : decentralized === 2 ||
          decentralized === 3 ||
          decentralized === 4 ||
          decentralized === 5
        ? renderShieldUserAddress()
        : renderShieldIncAddress()}
    </View>
  );
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
  const shieldDataBsc = useDebounceSelector(shieldDataBscSelector);
  const colors = useDebounceSelector(colorsSelector);
  const { address } = shieldData || {};
  const [toggle, setToggle] = React.useState(true);
  const platforms = ['ETH', 'BSC'];
  const selectedPrivacy = useDebounceSelector(
    selectedPrivacySelector.selectedPrivacy,
  );
  const [selectedPlatform, setPlatform] = React.useState(0);
  const [selectingPlatform, setSelectingPlatform] = React.useState(0);
  const account = useDebounceSelector(defaultAccountSelector);
  const isPRV = selectedPrivacy?.tokenId === PRV_ID;
  const [defaultFee, setDefaultFee] = React.useState({
    estimateFee: 0,
    tokenFee: 0,
  });
  const dispatch = useDispatch();
  const [ethFee, setEthFee] = React.useState({ estimateFee: 0, tokenFee: 0 });
  const [bscFee, setBscFee] = React.useState({ estimateFee: 0, tokenFee: 0 });
  const [isLoadingBsc, setIsLoadingBsc] = React.useState(false);
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
    if (isPRV) {
      setEthFee(ethFee);
    }
  } else if (
    (shieldDataBsc?.tokenFee || shieldDataBsc?.estimateFee) &&
    bscFee?.estimateFee === 0 &&
    bscFee?.tokenFee === 0 &&
    isPRV
  ) {
    const temp = {
      estimateFee: shieldDataBsc?.estimateFeem,
      tokenFee: shieldDataBsc?.tokenFee,
    };
    setPlatform(selectingPlatform);
    setDefaultFee(temp);
    setBscFee(temp);
    setIsLoadingBsc(false);
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
      <View2>
        <ScrollViewBorder style={styled.scrollViewContainer} contentContainerStyle={styled.scrollview}>
          {isPRV && renderOptionsPRV()}
          <Extra
            {...{
              ...props,
              selectedPrivacy,
              defaultFee,
              colors,
              isPRV,
            }}
          />
        </ScrollViewBorder>
      </View2>
    );
  };

  const handlePress = (index) => {
    if (index !== selectedPlatform && isPRV) {
      setIsLoadingBsc(true);
      if (platforms[index] === 'ETH') {
        setDefaultFee(ethFee);
        setPlatform(index);
        setIsLoadingBsc(false);
      } else if (
        platforms[index] === 'BSC' &&
        (shieldDataBsc?.tokenFee || shieldDataBsc?.estimateFee)
      ) {
        setDefaultFee(bscFee);
        setPlatform(index);
        setIsLoadingBsc(false);
      } else {
        setSelectingPlatform(index);
        try {
          dispatch(
            actionGetPRVBep20FeeToShield(
              account,
              account?.signPublicKeyEncode,
              selectedPrivacy,
            ),
          );
        } catch (e) {
          new ExHandler(e).showErrorToast();
          setIsLoadingBsc(false);
        }
      }
    }
  };

  const renderOptionsPRV = () => (
    <View style={styled.selectBox}>
      {platforms.map((item, index) => {
        const isSelected = index === selectedPlatform;
        return (
          <TouchableOpacity
            style={[
              styled.optionBtn,
              { borderColor: colors.border1 },
              { marginBottom: 10 },
            ]}
            key={`key-${index}`}
            onPress={() => handlePress(index)}
            disabled={isLoadingBsc}
          >
            <View3 style={styled.optionContent}>
              <RatioIcon style={styled.icon} selected={isSelected} />
              <Text style={[styled.textSelectBox]}>{item}</Text>
            </View3>
          </TouchableOpacity>
        );
      })}
    </View>
  );
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

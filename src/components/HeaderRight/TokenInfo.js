import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icons from 'react-native-vector-icons/SimpleLineIcons';
import { COLORS } from '@src/styles';
import { CONSTANT_CONFIGS } from '@src/constants';
import formatUtil from '@src/utils/format';
import CopiableText from '@src/components/CopiableText';
import {Icon} from 'react-native-elements';
import { getTokenInfo } from '@src/services/api/token';
import { ExHandler } from '@src/services/exception';
import TokenInfoUpdate from '@src/components/TokenInfoUpdate';
import LoadingContainer from '@src/components/LoadingContainer';
import linkingService from '@src/services/linking';
import { Text, View, Container, Modal, TouchableOpacity, Divider, Button, ScrollView } from '../core';
import CryptoIcon from '../CryptoIcon';
import VerifiedText from '../VerifiedText';
import { tokenInfoStyle } from './style';
import SimpleInfo from '../SimpleInfo';

let component;

export const showTokenInfo = (selectedPrivacy) => {
  try {
    const { setState, handleToggle } = component || {};

    if (typeof setState === 'function' && typeof handleToggle === 'function' && selectedPrivacy?.tokenId) {
      component.setState({ selectedPrivacy }, () => component.handleToggle(true));
    }
  } catch (e) {
    new ExHandler(e, 'Can not show this token info.').showWarningToast();
  }
};

class TokenInfo extends Component {
  constructor() {
    super();

    this.state = {
      isShowInfo: false,
      copied: false,
      copiedLabel: null,
      incognitoInfo: null,
      showUpdateInfoView: false,
      selectedPrivacy: null,
      isGettingInfo: false,
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    const { selectedPrivacy: selectedPrivacyProps } = nextProps;
    const { selectedPrivacy: selectedPrivacyState } = nextState;

    return { selectedPrivacy: selectedPrivacyProps || selectedPrivacyState };
  }

  componentDidMount() {
    const { selectedPrivacy } = this.state;
    this.handleGetIncognitoTokenInfo(selectedPrivacy?.tokenId);

    component = this;
  }

  closeCopied = (label) => {
    this.setState({ copied: true, copiedLabel: label });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ copied: false });
    }, 1000);
  };

  handleGetIncognitoTokenInfo = async (tokenId) => {
    let info = null;
    try {
      if (!tokenId) return;
      this.setState({ isGettingInfo: true });
      info = await getTokenInfo({ tokenId });

      return info;
    } catch (e) {
      new ExHandler(e);
    } finally {
      this.setState({ isGettingInfo: false, incognitoInfo: info });
    }
  }

  handleUpdated = info => {
    if (info?.tokenID) {
      this.handleGetIncognitoTokenInfo(info.tokenID);
    }
  }

  handleCloseUpdateView = () => this.setState({ showUpdateInfoView: false })

  handleShowUpdateView = () => this.setState({ showUpdateInfoView: true })

  renderInfoItem = (label, value, { useDivider, copyable = false, multiline = false, link } = {}) => {
    if (value === undefined || value === null || value === '') return null;

    const renderValue = (v, multiline, style) => {
      if (multiline) {
        return <Text style={[tokenInfoStyle.infoItemValue, style]}>{value}</Text>;
      } else {
        return <Text numberOfLines={1} ellipsizeMode="middle" style={[tokenInfoStyle.infoItemValue, style]}>{value}</Text>;
      }
    };

    return (
      <React.Fragment key={label}>
        <View style={tokenInfoStyle.infoItem}>
          <Text numberOfLines={1} ellipsizeMode="middle" style={tokenInfoStyle.infoItemLabel}>{label}</Text>
          <View style={tokenInfoStyle.infoItemValueContainer}>
            <View style={tokenInfoStyle.infoItemValue}>
              {
                link
                  ? (
                    <TouchableOpacity style={tokenInfoStyle.link} onPress={() => linkingService.openUrl(link + '?from=incognitochain')}>
                      {renderValue(value, multiline, tokenInfoStyle.linkText)}
                    </TouchableOpacity>
                  )
                  : renderValue(value, multiline)
              }
            </View>
            {copyable && (
              <CopiableText
                text={value}
                style={tokenInfoStyle.infoItemValueCopy}
                onPress={() => this.closeCopied(label)}
              >
                <View style={tokenInfoStyle.rightBlock}>
                  <Icon name="copy" type="font-awesome" size={18} />
                </View>
              </CopiableText>
            )}
          </View>
        </View>
        { useDivider && <Divider color={COLORS.lightGrey5} /> }
      </React.Fragment>
    );
  };

  renderInfo = () => {
    const { copied, copiedLabel, incognitoInfo, selectedPrivacy } = this.state;

    if (!selectedPrivacy) {
      return <SimpleInfo text='There has nothing to display' />;
    }

    const { name, symbol, externalSymbol, tokenId, contractId, amount, pDecimals, incognitoTotalSupply, isVerified, isBep2Token, isBep20Token} = selectedPrivacy;

    const infos = [
      { label: 'Name', value: name },
      { label: 'Ticker', value: symbol },
      { label: 'Original Ticker', value: externalSymbol, link: isBep2Token && `${CONSTANT_CONFIGS.BINANCE_EXPLORER_URL}/asset/${externalSymbol}` },
      { label: 'Coin supply', value: incognitoTotalSupply ? formatUtil.amount(incognitoTotalSupply, pDecimals) : undefined },
      { label: 'Balance', value: formatUtil.amount(amount, pDecimals) },
      { label: 'Coin ID', value: tokenId, copyable: true },
      { label: 'Contract ID', value: contractId, copyable: true, link: isBep20Token ? `${CONSTANT_CONFIGS.BSCSCAN_URL}/token/${contractId}`: `${CONSTANT_CONFIGS.ETHERSCAN_URL}/address/${contractId}` },
      { label: 'Owner address', value: incognitoInfo?.showOwnerAddress ? incognitoInfo?.ownerAddress : undefined, copyable: true  },
      { label: 'Owner email', value: incognitoInfo?.ownerEmail, copyable: true  },
      { label: 'Owner website', value: incognitoInfo?.ownerWebsite, link: incognitoInfo?.ownerWebsite, copyable: true  },
    ].filter(i => ![undefined, null, ''].includes(i.value));

    return (
      <View style={tokenInfoStyle.infoContainer}>
        <View style={tokenInfoStyle.header}>
          <View style={tokenInfoStyle.iconContainer}>
            <CryptoIcon size={70} tokenId={tokenId} />
          </View>
          <View style={tokenInfoStyle.headerTextContainer}>
            <VerifiedText
              text={`${selectedPrivacy?.symbol} ${!selectedPrivacy?.isPrivateCoin ? selectedPrivacy?.networkName : ''}`}
              numberOfLines={1}
              ellipsizeMode="middle"
              style={tokenInfoStyle.headerText}
              isVerified={isVerified}
            />
            <Text numberOfLines={1} ellipsizeMode="middle" style={tokenInfoStyle.headerSubText}>{selectedPrivacy?.displayName}</Text>
          </View>
        </View>
        <Container style={tokenInfoStyle.contentContainer}>
          <View style={tokenInfoStyle.content}>
            <ScrollView>
              {
                isVerified && <VerifiedText containerStyle={{ marginBottom: 10 }} style={tokenInfoStyle.verifyText} text='Verified Coin' isVerified={isVerified} />
              }
              {
                !!incognitoInfo?.description && (
                  <View style={tokenInfoStyle.descContainer}>
                    <Text>{incognitoInfo?.description}</Text>
                  </View>
                )
              }
              <View style={tokenInfoStyle.infoItems}>
                {
                  infos.map((info, index) => this.renderInfoItem(info.label, info.value, { useDivider: (index < infos.length - 1), copyable: info.copyable, multiline: info.multiline, link: info.link },))
                }
              </View>
              {!!copied &&
              (
                <View style={tokenInfoStyle.copied}>
                  <Text style={tokenInfoStyle.copiedMessage}>{copiedLabel} was copied</Text>
                </View>
              )}
            </ScrollView>
          </View>
          {
            !!incognitoInfo?.isOwner && (
              <View style={tokenInfoStyle.updateBtnContainer}>
                <Button title='Update' onPress={this.handleShowUpdateView} />
              </View>
            )
          }
        </Container>
      </View>
    );
  };

  handleToggle = (isShow) => {
    this.setState(({ isShowInfo, incognitoInfo, selectedPrivacy }) => {
      const newIsShowInfo = isShow ?? !isShowInfo;
      let newIncognitoInfo = incognitoInfo;

      if (newIsShowInfo === false) {
        this.handleCloseUpdateView();
        newIncognitoInfo = null;
      } else if (selectedPrivacy?.isIncognitoToken){ // get token info every time the modal will be opened
        this.handleGetIncognitoTokenInfo(selectedPrivacy?.tokenId);
      }

      return { isShowInfo: newIsShowInfo, incognitoInfo: newIncognitoInfo };
    });
  }

  render() {
    const { isShowInfo, incognitoInfo, showUpdateInfoView, isGettingInfo } = this.state;
    const { iconColor, selectedPrivacy } = this.props;
    const showInfoIcon = !!selectedPrivacy?.tokenId;

    return (
      <View style={tokenInfoStyle.container}>
        {
          showInfoIcon && (
            <TouchableOpacity onPress={() => this.handleToggle()}>
              <Icons name='info' style={tokenInfoStyle.icon} size={24} color={iconColor} />
            </TouchableOpacity>
          )
        }
        <Modal visible={isShowInfo} close={() => this.handleToggle()} containerStyle={tokenInfoStyle.modalContainer} closeBtnColor={COLORS.primary} headerText='Coin info'>
          {
            isGettingInfo
              ? <LoadingContainer />
              : (
                showUpdateInfoView
                  ? !!incognitoInfo && (
                    <ScrollView>
                      <TokenInfoUpdate incognitoInfo={incognitoInfo} onUpdated={this.handleUpdated} onClose={this.handleCloseUpdateView} />
                    </ScrollView>
                  )
                  : this.renderInfo()
              )
          }
        </Modal>
      </View>
    );
  }
}

TokenInfo.defaultProps = {
  iconColor: COLORS.black,
  selectedPrivacy: null
};

TokenInfo.propTypes = {
  selectedPrivacy: PropTypes.object,
  iconColor: PropTypes.string,

};

export default TokenInfo;

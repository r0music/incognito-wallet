import BaseScreen from '@screens/BaseScreen';
import { ScrollViewBorder, View } from '@src/components/core';
import { getAccountByName } from '@src/redux/selectors/account';
import routeNames from '@src/router/routeNames';
import React from 'react';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import LocalDatabase from '@src/utils/LocalDatabase';
import Header from '@src/components/Header';
import { BtnQuestionDefault } from '@src/components/Button';
import NavigationService from '@src/services/NavigationService';
import { BackUpAccountModal } from '@screens/Node/BackuUpAccountModal';
import { withLayout_2 } from '@components/Layout';
import styles from './styles';
import WifiRepairSetup from './WifiRepairSetup';

const CONNECTION_STATUS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

class RepairingSetupNode extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      qrCode: null,
      account: null,
      step: 0,
      hotspotSSID: '',
      success: false,
      statusConnection: CONNECTION_STATUS.LOW,
      bandWidth: {},
      errPermission: '',
      isErrPermission: false,
      showBandWidthModal: false,
    };
  }

  getAccountByName = async () => {
    let accountQRCode = await LocalDatabase.getAccountWithQRCode();
    let account = await getAccountByName(JSON.parse(accountQRCode));
    this.setState({ account: account });
  };

  handleFinish = () => {
    this.setState({ success: false }, () => {
      // Need to navigate to RootMiner to pass params
      this.goToScreen(routeNames.Node, {
        refresh: new Date().getTime()
      });
    });
  };

  handleSetupComplete = () => {
    this.setState({ success: true });
  };

  renderStep() {
    const { hotspotSSID, account } = this.state;
    const { navigation } = this.props;
    const { verifyProductCode } = navigation.state.params;
    return (
      <WifiRepairSetup
        onNext={this.handleSetupComplete}
        verifyProductCode={verifyProductCode}
        account={account}
        hotspotSSID={hotspotSSID}
      />
    );
  }

  render() {
    const { success } = this.state;
    return (
      <>
        <Header
          title="Continue setup"
          rightHeader={<BtnQuestionDefault onPress={() => { NavigationService.navigate(routeNames.NodeHelp); }} />}
        />
        <BackUpAccountModal visible={success} onClose={this.handleFinish} />
        {this.renderStep()}
      </>
    );
  }

}

RepairingSetupNode.propTypes = {};

RepairingSetupNode.defaultProps = {};
const mapStateToProps = state => ({
  getAccountByName: getAccountByName(state),
});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLayout_2(RepairingSetupNode));

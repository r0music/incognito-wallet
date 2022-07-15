import React, { memo } from 'react';
import withEnhance from '@screens/Node/components/NodeItemDetail/NodeItemDetail.enhance';
import PropTypes from 'prop-types';
import styles from '@screens/Node/components/style';
import Header from '@components/Header';
import BtnMoreInfo from '@components/Button/BtnMoreInfo';
import BtnThreeDotsVer from '@components/Button/BtnThreeDotsVer';
import Rewards from '@screens/Node/components/Rewards';
import HelpIcon from '@components/HelpScreen/Icon';
import {
  Text,
  View,
  RoundCornerButton,
  TouchableOpacity,
  ScrollViewBorder, RefreshControl,
} from '@components/core';
import { Text4 } from '@components/core/Text';
import theme from '@src/styles/theme';
import ROUTE_NAMES from '@routers/routeNames';
import NodeStatus from '@screens/Node/components/NodeStatus';
import { isEmpty } from 'lodash';
import { compose } from 'recompose';
import nodeItemDetailEnhanceData from '@screens/Node/components/NodeItemDetail/NodeItemDetail.enhanceData';
import BottomBar from '@screens/Node/components/NodeBottomBar';
import SlashStatus from '@screens/Node/components/SlashStatus';
import { View2 } from '@src/components/core/View';
import { FONT } from '@src/styles';
import { useNavigation } from 'react-navigation-hooks';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme';

const NodeItemDetail = memo(({
  isLoading,
  item,
  rewardsList,
  name,
  ip,
  port,
  hasAccount,
  shouldShowStake,
  shouldShowWithdraw,
  processing,
  withdrawable,
  shouldRenderUnstake,
  accessToken,
  refreshToken,
  onUpdateNode,
  onHelpPress,
  onImportAccountPress,
  onWithdrawPress,
  onStakePress,
  onChangeWifiPress,
  onUnStakePress,
  onRefresh,
  onPressMonitorDetail
}) => {
  const navigation = useNavigation();
  const colors = useSelector(colorsSelector);
  const renderRewards = () => {
    if (rewardsList && rewardsList.length > 0) {
      return (<Rewards rewards={rewardsList} />);
    }
    return null;
  };

  const renderBtn = (title, onPress, disabled = false) => {
    return (
      <RoundCornerButton
        disabled={disabled}
        onPress={onPress}
        title={title}
        style={[{ flex: 1, margin: 2 }, theme.BUTTON.BLUE_TYPE]}
      />
    );
  };

  const renderButton = () => (
    <View style={[{ flexDirection: 'row' }, theme.MARGIN.marginBottomDefault]}>
      {!hasAccount ? renderBtn('Import a keychain', onImportAccountPress) : (
        <>
          {
            shouldShowStake
            && shouldShowWithdraw
              ? renderBtn(processing || !withdrawable
                ? 'Withdrawing...'
                : 'Withdraw', onWithdrawPress, !withdrawable)
              : null
          }
          {
            !shouldShowStake
            && shouldShowWithdraw
              ? renderBtn(processing || !withdrawable
                ? 'Withdrawing rewards...'
                : 'Withdraw rewards', onWithdrawPress, !withdrawable)
              : null
          }
          {
            shouldShowStake
              ? renderBtn(shouldShowWithdraw
                ? 'Stake'
                : 'Stake required', onStakePress)
              : null
          }
        </>
      )}
    </View>
  );

  const renderItemText = (text, value) => {
    return (
      <View style={[styles.balanceContainer, { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }]}>
        <Text4 style={{...FONT.TEXT.incognitoH6}}>{text}</Text4>
        <Text style={[theme.text.boldTextStyleMedium, { maxWidth: 200 }]} numberOfLines={1}>{value || ''}</Text>
      </View>
    );
  };

  const renderWarning = (text, value) => {
    return (
      <View style={[{ flexDirection: 'column', marginBottom: 30 }]}>
        <Text style={[theme.text.boldTextStyleMedium]}>{text}</Text>
        <Text style={styles.warningDesc} numberOfLines={4}>{value || ''}</Text>
      </View>
    );
  };

  const renderNodeSettings = () => {
    return (
      <TouchableOpacity
        onPress={onChangeWifiPress}
      >
        <Text4 style={[styles.text, styles.bold, styles.bigText]}>
          Change Wi-Fi
        </Text4>
      </TouchableOpacity>
    );
  };

  const renderUnstake = (onPress) => {
    return (
      <TouchableOpacity style={{ marginBottom: 30 }} onPress={onPress}>
        <Text4 style={[styles.text, styles.bold, styles.bigText]}>
          Unstake this Node
        </Text4>
      </TouchableOpacity>
    );
  };

  // Can update Firmware
  const renderUpdateNode = () => {
    if (
      !isLoading
      && !isEmpty(accessToken)
      && !isEmpty(refreshToken)
      && item?.IsUpdateFirmware
    ) {
      return (
        <TouchableOpacity style={{ marginTop: 30 }} onPress={onUpdateNode}>
          <Text4 style={[styles.text, styles.bold, styles.bigText]}>
            Update firmware
          </Text4>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderStakeInfo = () => (
    <>
      {(!!shouldRenderUnstake || !!item?.IsPNode) && (
        <View style={{ marginTop: 50 }}>
          {
            !!shouldRenderUnstake
            && renderUnstake(onUnStakePress)
          }
          {
            !!item?.IsPNode
            && (global.isDebug() || !!item?.AccountName)
            && renderNodeSettings()
          }
        </View>
      )}
    </>
  );

  const renderRefreshControl = () => (
    <RefreshControl
      refreshing={isLoading}
      onRefresh={onRefresh}
    />
  );

  const renderRightHeader = () => (
    <View2 style={styles.rightHeader}>
      {!isEmpty(item?.PublicKeyMining) &&
        <BtnThreeDotsVer onPress={() => onPressMonitorDetail && onPressMonitorDetail(item?.PublicKeyMining)} />
      }
      <TouchableOpacity style={[styles.infoIcon, { backgroundColor: colors.background1 }]} onPress={() => navigation.navigate(ROUTE_NAMES.NodeItemsHelp)}>
        <HelpIcon screen={ROUTE_NAMES.NodeItemsHelp} style={styles.infoBtnStyle} />
      </TouchableOpacity>
    </View2>
  );

  return (
    <View2 fullFlex>
      <Header
        title="Node details"
        rightHeader={renderRightHeader()}
      />
      <ScrollViewBorder
        refreshControl={renderRefreshControl()}
        style={
          {paddingBottom: 30}
        }
      >
        {renderRewards()}
        {renderButton()}
        <View style={{ marginTop: 50 }}>
          {renderItemText('Master key', item.MasterKey)}
          {renderItemText('Keychain', name)}
          {renderItemText('IP', `${ip}${!item.IsPNode ? (':' + port) : ''}`)}
          { item?.IsPNode && renderItemText('Version', item?.Firmware) }
          { !!item &&  <SlashStatus device={item} /> }
          { !!item && (<NodeStatus isLoading={isLoading} item={item} />) }
        </View>
        {renderStakeInfo()}
        {renderUpdateNode()}
        <View style={{ height: 60 }} />
      </ScrollViewBorder>
      <BottomBar />
    </View2>
  );
});

NodeItemDetail.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  ip: PropTypes.string.isRequired,
  port: PropTypes.string.isRequired,
  rewardsList: PropTypes.array.isRequired,
  hasAccount: PropTypes.bool.isRequired,
  shouldShowStake: PropTypes.bool.isRequired,
  shouldShowWithdraw: PropTypes.bool.isRequired,
  processing: PropTypes.bool.isRequired,
  accessToken: PropTypes.string.isRequired,
  refreshToken: PropTypes.string.isRequired,
  withdrawable: PropTypes.bool.isRequired,
  shouldRenderUnstake: PropTypes.bool.isRequired,
  onHelpPress: PropTypes.func.isRequired,
  onImportAccountPress: PropTypes.func.isRequired,
  onWithdrawPress: PropTypes.func.isRequired,
  onStakePress: PropTypes.func.isRequired,
  onChangeWifiPress: PropTypes.func.isRequired,
  onUnStakePress: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onUpdateNode: PropTypes.func.isRequired,
  onPressMonitorDetail: PropTypes.func.isRequired,
};

export default compose(
  nodeItemDetailEnhanceData,
  withEnhance,
)(NodeItemDetail);

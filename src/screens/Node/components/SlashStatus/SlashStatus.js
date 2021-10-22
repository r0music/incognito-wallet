import React, {memo} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import styles from '@screens/Node/components/style';
import theme from '@src/styles/theme';
import {Text, TouchableOpacity} from '@components/core';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '@src/styles';
import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';
import statusStyled from '../NodeStatus/style';

const SlashStatus = ({ device }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleOpenLink = () => {
    linkingService.openUrl(`${CONSTANT_CONFIGS.MAIN_WEBSITE}/t/node-unstaking-slashed-read-me-re-stake-guide/14040`,);
  };

  const renderDesc = () => {
    if (device.IsVNode || device.IsFundedUnstaked) {
      return (
        <View style={statusStyled.container}>
          <Text style={statusStyled.desc}>
            No worries. <Text onPress={handleOpenLink} style={[statusStyled.desc, { textDecorationLine: 'underline', color: COLORS.blue5 }]}>Follow these instructions</Text> to get back up and running again.
            Your stake has been returned to you. Please check your assets in this keychain, and follow the prompt to convert your coins from v1 to v2 if necessary.
            New
          </Text>
        </View>
      );
    }

    return (
      <View style={statusStyled.container}>
        <Text style={statusStyled.desc}>
          No worries. <Text onPress={handleOpenLink} style={[statusStyled.desc, { textDecorationLine: 'underline', color: COLORS.blue5 }]}>Follow these instructions</Text> to get back up and running again.
        </Text>
      </View>
    );
  };

  if (!device || !device?.IsSlashing) return null;

  return (
    <>
      <View style={[styles.balanceContainer, theme.MARGIN.marginBottomDefault, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <Text style={[theme.text.boldTextStyleMedium]}>Status</Text>
        <TouchableOpacity
          style={[{ flexDirection: 'row' }, styles.balanceContainer]}
          onPress={() => setIsExpanded(value => !value)}
        >
          <Text style={[theme.text.boldTextStyleMedium, theme.MARGIN.marginRightDefault]}>Slashed</Text>
          <Ionicons name={isExpanded ? 'ios-arrow-up' : 'ios-arrow-down'} size={25} color={COLORS.colorPrimary} />
        </TouchableOpacity>
      </View>
      {!isExpanded && renderDesc()}
    </>
  );
};

SlashStatus.propTypes = {
  device: PropTypes.object.isRequired
};

export default memo(SlashStatus);

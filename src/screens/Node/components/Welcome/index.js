import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity } from 'react-native';
import { Text, ScrollViewBorder, RoundCornerButton } from '@components/core';
import nodeImg from '@assets/images/node/node.png';
import theme from '@src/styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@src/styles';
import styles from './style';

const WelcomeNodes = ({ onAddPNode, onAddVNode }) => {
  return (
    <ScrollViewBorder contentContainerStyle={styles.pNode} style={{ paddingHorizontal: 0 }}>
      <Image style={styles.pNodeImg} source={nodeImg} resizeMode="contain" resizeMethod="resize" />
      <RoundCornerButton
        style={[styles.pNodeButton, theme.BUTTON.NODE_BUTTON]}
        onPress={onAddPNode}
        title='Add Node Device TESTTTTT'
      />
      <Text style={[styles.buyText, theme.MARGIN.marginTop30]}>Experienced Node operator?</Text>
      <TouchableOpacity style={[theme.FLEX.rowSpaceBetweenCenter]} onPress={onAddVNode}>
        <Text style={styles.getNode}>Add Node Virtual</Text>
        <Ionicons name="ios-arrow-forward" color={COLORS.newGrey} size={20} style={styles.arrow} />
      </TouchableOpacity>
    </ScrollViewBorder>
  );
};

WelcomeNodes.propTypes = {
  onAddVNode: PropTypes.func.isRequired,
  onAddPNode: PropTypes.func.isRequired,
};

export default React.memo(WelcomeNodes);

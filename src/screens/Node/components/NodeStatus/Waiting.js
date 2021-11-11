import { Text, View, TouchableOpacity } from '@components/core';
import { COLORS, FONT } from '@src/styles';
import React from 'react';
import linkingService from '@services/linking';
import { CONSTANT_URLS } from '@src/constants';
import styles from './style';

const Waiting = () => (
  <View style={styles.container}>
    <Text style={[styles.desc]}>This Node is currently waiting to be selected to create blocks and earn rewards. All Nodes have an equal chance of selection. Numbers may vary in the short-term, but will even out over time through random uniform distribution.</Text>
    <TouchableOpacity onPress={() => linkingService.openCommunityUrl(CONSTANT_URLS.VALIDATOR_LIFECYCLE)}>
      <Text style={{color: COLORS.blue5, marginTop: 20, fontFamily: FONT.NAME.bold }}>
        Learn about the validator lifecycle
      </Text>
    </TouchableOpacity>
  </View>
);

export default React.memo(Waiting);


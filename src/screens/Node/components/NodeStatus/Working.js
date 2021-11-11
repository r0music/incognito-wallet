import { Text, View, TouchableOpacity } from '@components/core';
import { COLORS, FONT } from '@src/styles';
import React from 'react';
import linkingService from '@services/linking';
import CONSTANT_URLS from '@src/constants/url';
import styles from './style';

const Working = () => (
  <View style={styles.container}>
    <Text style={styles.desc}>This Node is now working to create blocks, validate transactions, and earn rewards. It will continue to work and earn for at least 1 epoch (4 hours).</Text>
    <TouchableOpacity onPress={() => linkingService.openCommunityUrl(CONSTANT_URLS.VALIDATOR_LIFECYCLE)}>
      <Text style={{color: COLORS.blue5, fontFamily: FONT.NAME.bold, marginTop: 20}}>
        Learn about the validator lifecycle
      </Text>
    </TouchableOpacity>
  </View>
);

export default React.memo(Working);


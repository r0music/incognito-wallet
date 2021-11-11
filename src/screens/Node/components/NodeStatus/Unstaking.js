import { Text, View, TouchableOpacity } from '@components/core';
import { COLORS, FONT } from '@src/styles';
import React from 'react';
import linkingService from '@services/linking';
import CONSTANT_URLS from '@src/constants/url';
import styles from './style';

const Unstaking = () => (
  <View style={styles.container}>
    <Text style={styles.desc}>This Node will complete the unstaking process the next time it is randomly selected to create blocks. As such, unstaking times will vary. This may take anywhere between 4 hours to 21 days.</Text>
    <TouchableOpacity onPress={() => linkingService.openCommunityUrl(CONSTANT_URLS.UNSTAKING_PROCESS)}>
      <Text style={{color: COLORS.blue5, marginTop: 20, fontFamily: FONT.NAME.bold}}>
        Learn more about unstaking
      </Text>
    </TouchableOpacity>
  </View>
);

export default React.memo(Unstaking);


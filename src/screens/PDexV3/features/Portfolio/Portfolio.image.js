import React from 'react';
import { ImageCached } from '@src/components';
import incognito from '@assets/images/new-icons/incognito.png';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  rightIcon: {
    // position: 'absolute',
    left: -16,
    width: 33,
    height: 33,
    borderRadius: 16,
  }
});

const TwoTokenImage = React.memo(({ iconUrl1 , iconUrl2 }) => {
  return (
    <View style={styles.container}>
      <ImageCached style={[styles.icon, iconUrl1 && iconUrl1.includes('prv') && { height: 34, width: 34 }]} uri={iconUrl1} defaultImage={incognito} />
      <ImageCached style={[styles.rightIcon, iconUrl2 && iconUrl2.includes('prv') && { height: 34, width: 34 }]} uri={iconUrl2} defaultImage={incognito} />
    </View>
  );
});

TwoTokenImage.propTypes = {
  iconUrl1: PropTypes.string.isRequired,
  iconUrl2: PropTypes.string.isRequired,
};

export default TwoTokenImage;

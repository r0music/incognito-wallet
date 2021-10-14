import React from 'react';
import { Image, StyleSheet } from 'react-native';
import srcStar from '@src/assets/images/new-icons/star.png';
import srcStarBlue from '@src/assets/images/new-icons/star-blue.png';

const styled = StyleSheet.create({
  icon: {
    width: 16.84,
    height: 16,
  },
});

const IconCopy = (props) => {
  const { isBlue = false } = props;
  return (
    <Image
      style={[styled.icon, props?.style]}
      source={isBlue ? srcStarBlue : srcStar}
    />
  );
};

IconCopy.propTypes = {};

export default IconCopy;

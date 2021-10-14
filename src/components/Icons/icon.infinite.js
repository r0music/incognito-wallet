import React from 'react';
import { Image } from 'react-native';
import srcInfiniteIcon from '@src/assets/images/icons/infinite.png';
import PropTypes from 'prop-types';

const InfiniteIcon = ({ style }) => {
  return (
    <Image
      source={srcInfiniteIcon}
      style={[{ width: 30, height: 14 }, style]}
    />
  );
};

InfiniteIcon.defaultProps = {
  style: null,
};

InfiniteIcon.propTypes = {
  style: PropTypes.any,
};

export default InfiniteIcon;

import React from 'react';
import PropTypes from 'prop-types';
import incognito from '@assets/images/new-icons/incognito.png';
import { Image } from 'react-native';

export const Icon = (props) => {
  const { iconUrl, style } = props;
  return (
    <Image
      style={[{ width: 20, height: 20 }, style]}
      source={{ uri: iconUrl }}
      defaultSource={incognito}
    />
  );
};

Icon.defaultProps = {
  style: null,
};

Icon.propTypes = {
  iconUrl: PropTypes.string.isRequired,
  style: PropTypes.any,
};

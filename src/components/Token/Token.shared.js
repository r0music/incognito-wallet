import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { AppIcon } from '@src/components/Icons';
import { Image } from '@src/components/core';
import PropTypes from 'prop-types';

export const Icon = React.memo((props) => {
  const { iconUrl, style } = props;
  if (isEmpty(iconUrl)) {
    return <AppIcon />;
  }
  return <Image style={[{ width: 20, height: 20 }, style]} source={{ uri: iconUrl }} />;
});

Icon.defaultProps = {
  style: null
};

Icon.propTypes = {
  iconUrl: PropTypes.string.isRequired,
  style: PropTypes.any
};

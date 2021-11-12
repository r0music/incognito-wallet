import React from 'react';
import PropTypes from 'prop-types';
import incognito from '@assets/images/new-icons/incognito.png';
import ImageCached from '@src/components/ImageCached';

export const Icon = React.memo((props) => {
  const { iconUrl: uri, style } = props;
  return (
    <ImageCached
      style={[{ width: 20, height: 20 }, style]}
      uri={uri}
      defaultImage={incognito}
    />
  );
});

Icon.defaultProps = {
  style: null,
};

Icon.propTypes = {
  iconUrl: PropTypes.string.isRequired,
  style: PropTypes.any,
};

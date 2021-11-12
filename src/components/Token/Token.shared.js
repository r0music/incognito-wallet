import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import incognito from '@assets/images/new-icons/incognito.png';
// import ImageCached from '@src/components/ImageCached';

export const Icon = React.memo((props) => {
  const { iconUrl: uri, style } = props;
  const [error, setError] = React.useState(false);
  if (error || !uri) {
    return (
      <Image
        style={[{ width: 20, height: 20, borderRadius: 20 }, style]}
        source={incognito}
      />
    );
  }
  return (
    <Image
      style={[{ width: 20, height: 20, borderRadius: 20 }, style]}
      source={{ uri }}
      defaultSource={incognito}
      onError={() => setError(true)}
    />
  );
  // return (
  //   <ImageCached
  //     style={[{ width: 20, height: 20 }, style]}
  //     uri={iconUrl}
  //     defaultImage={incognito}
  //   />
  // );
});

Icon.defaultProps = {
  style: null,
};

Icon.propTypes = {
  iconUrl: PropTypes.string.isRequired,
  style: PropTypes.any,
};

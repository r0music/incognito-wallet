import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity as RNComponent,
  TouchableOpacityProps,
} from 'react-native';

const TouchableOpacity = (props: TouchableOpacityProps) => {
  const { onPress, activeOpacity = 0.2, ...rest } = props;
  const _onPress = () => {
    requestAnimationFrame(() => {
      if (typeof onPress === 'function') {
        onPress();
      }
    });
  };

  return (
    <RNComponent onPress={_onPress} activeOpacity={activeOpacity} {...rest} />
  );
};

TouchableOpacity.defaultProps = {
  activeOpacity: undefined,
};

TouchableOpacity.propTypes = {
  onPress: PropTypes.func.isRequired,
  activeOpacity: PropTypes.number,
};

export default TouchableOpacity;

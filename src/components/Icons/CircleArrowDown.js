import React from 'react';
import { Image } from 'react-native';
import srcDownArrowIcon from '@src/assets/images/icons/circle_arrow_down.png';
import PropTypes from 'prop-types';

const CircleArrowDownIcon = (props) => {
  const defaultStyle = {
    width: 40,
    height: 40,
  };
  const { style, source, ...rest } = props;
  return (
    <Image
      source={source ? source : srcDownArrowIcon}
      style={[defaultStyle, style]}
      {...rest}
    />
  );
};

CircleArrowDownIcon.defaultProps = {
  source: srcDownArrowIcon,
  style: {},
};

CircleArrowDownIcon.propTypes = {
  style: PropTypes.any,
  source: PropTypes.any,
};

export default CircleArrowDownIcon;

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const ArrowDownIcon = (props) => (
  <Svg width={12} height={12} fill="none" {...props}>
    <Path
      d="M6.017 10a.996.996 0 0 1-.792-.373L.61 4.407c-.326-.373-.28-.932.093-1.212.373-.28.886-.28 1.212.094l4.008 4.567c.046.047.093.047.186 0l4.008-4.567a.832.832 0 0 1 1.212-.047.924.924 0 0 1 .093 1.212l-4.567 5.22c-.233.186-.513.326-.839.326Z"
      fill="#757575"
    />
  </Svg>
);

export default ArrowDownIcon;

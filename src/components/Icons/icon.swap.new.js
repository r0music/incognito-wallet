import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const SwapIconNew = (props) => (
  <Svg width={40} height={40} fill="none" {...props}>
    <Circle cx={20} cy={20} r={19.5} fill="#252525" stroke="#363636" />
    <Path
      d="M19.16 13.82V23.83a.148.148 0 0 1-.182.141.148.148 0 0 1-.074-.045l-4.448-5.052a.843.843 0 0 0-1.265 1.112l5.758 6.54a1.405 1.405 0 0 0 2.107 0l5.757-6.54a.842.842 0 0 0-1.265-1.11L21.1 23.927a.147.147 0 0 1-.256-.097V13.82a.842.842 0 0 0-1.685 0h.001Z"
      fill="#fff"
    />
  </Svg>
);

export default SwapIconNew;

import React from 'react';
import Svg, { Circle, G, Path, Defs, ClipPath } from 'react-native-svg';

const IconCloseSVG = (props) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Circle
      cx={12}
      cy={12}
      r={11.5}
      fill="#fff"
      fillOpacity={0.05}
      stroke="#363636"
    />
    <G clipPath="url(#a)">
      <Path
        d="M12.959 12.075a.1.1 0 0 1 0-.146l3.858-3.863a.622.622 0 0 0-.442-1.064.63.63 0 0 0-.441.181l-3.859 3.858a.105.105 0 0 1-.15 0L8.067 7.183a.63.63 0 0 0-1.02.202.62.62 0 0 0 .137.681l3.858 3.863a.1.1 0 0 1 .023.112.1.1 0 0 1-.023.034l-3.858 3.858a.622.622 0 0 0 .441 1.064.63.63 0 0 0 .442-.18l3.858-3.859a.104.104 0 0 1 .15 0l3.859 3.858a.63.63 0 0 0 1.02-.202.62.62 0 0 0-.137-.681l-3.858-3.858Z"
        fill="#fff"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" transform="translate(7 7)" d="M0 0h10v10H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default IconCloseSVG;

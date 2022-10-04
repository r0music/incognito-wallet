import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const MailIcon = (props) => (
  <Svg
    width={28}
    height={24}
    viewBox="0 0 28 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M14.951 13.418h5.183v-.091a2.448 2.448 0 0 1 1.567-2.288 2.38 2.38 0 0 1 2.288.412V1.979a.206.206 0 0 0-.115-.172.183.183 0 0 0-.194 0l-9.724 7.241a2.757 2.757 0 0 1-3.89 0L.31 1.853a.172.172 0 0 0-.195 0A.206.206 0 0 0 0 2.025v12.011a2.002 2.002 0 0 0 2.002 1.956h10.055a2.974 2.974 0 0 1 2.894-2.574Z"
      fill="url(#a)"
    />
    <Path
      d="M11.13 7.985a1.236 1.236 0 0 0 1.762 0L22.593.847a.503.503 0 0 0 .126-.515.515.515 0 0 0-.412-.332H1.716a.48.48 0 0 0-.4.332.526.526 0 0 0 .114.515l9.7 7.138Z"
      fill="url(#b)"
    />
    <Path
      d="M23.085 12.846a.71.71 0 0 0-.79-.252.742.742 0 0 0-.446.733v1.807h-6.863a1.281 1.281 0 0 0-1.259 1.338v3.615a1.28 1.28 0 0 0 1.224 1.339h6.864v1.807a.697.697 0 0 0 .675.767.72.72 0 0 0 .56-.286l4.13-4.793a.972.972 0 0 0 0-1.282l-4.095-4.793Z"
      fill="url(#c)"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={0.706}
        y1={8.096}
        x2={22.276}
        y2={2.018}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="silver" />
        <Stop offset={1} stopColor="#F5F5F5" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={1.922}
        y1={3.713}
        x2={19.511}
        y2={-3.828}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="silver" />
        <Stop offset={1} stopColor="#F5F5F5" />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1={14}
        y1={18.28}
        x2={27.695}
        y2={18.28}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#1C55B8" />
        <Stop offset={1} stopColor="#1A73E8" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default MailIcon;

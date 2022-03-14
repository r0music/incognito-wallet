import React from 'react';
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const RaydiumIcon2 = (props) => (
  <Svg
    width={50}
    height={50}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle opacity={0.98} cx={25} cy={25} r={25} fill="#131A35" />
    <Path
      d="M40.1502 20.1288V33.7496L25 42.4949L9.84151 33.7496V16.2504L25 7.49665L36.6437 14.2225L38.4012 13.2086L25 5.46875L8.08398 15.2365V34.7635L25 44.5312L41.9162 34.7635V19.1149L40.1502 20.1288Z"
      fill="url(#paint0_linear_4286_16667)"
    />
    <Path
      d="M20.7585 33.7583H18.2236V25.2579H26.6733C27.4727 25.2491 28.2365 24.9258 28.7994 24.3581C29.3624 23.7905 29.6792 23.024 29.6813 22.2244C29.6859 21.8292 29.6096 21.4371 29.457 21.0724C29.3044 20.7076 29.0789 20.378 28.794 20.1037C28.5185 19.8205 28.1887 19.596 27.8243 19.4436C27.4598 19.291 27.0683 19.2138 26.6733 19.2164H18.2236V16.6309H26.6816C28.1624 16.6397 29.5801 17.2319 30.6272 18.279C31.6742 19.3261 32.2664 20.7438 32.2753 22.2244C32.2843 23.358 31.9388 24.4659 31.2868 25.393C30.6867 26.2802 29.841 26.9732 28.8532 27.3872C27.8751 27.6974 26.8544 27.8514 25.8282 27.8435H20.7585V33.7583Z"
      fill="url(#paint1_linear_4286_16667)"
    />
    <Path
      d="M32.2158 33.5469H29.2584L26.9771 29.5671C27.8796 29.5119 28.7699 29.3298 29.6217 29.0264L32.2158 33.5469Z"
      fill="url(#paint2_linear_4286_16667)"
    />
    <Path
      d="M38.3843 17.2982L40.1333 18.2699L41.8825 17.2982V15.2449L40.1333 14.231L38.3843 15.2449V17.2982Z"
      fill="url(#paint3_linear_4286_16667)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_4286_16667"
        x1={35.6742}
        y1={-5.46123}
        x2={-1.18367}
        y2={5.59531}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#C200FB" />
        <Stop offset={0.489658} stopColor="#3772FF" />
        <Stop offset={0.489758} stopColor="#3773FE" />
        <Stop offset={1} stopColor="#5AC4BE" />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear_4286_16667"
        x1={36.0019}
        y1={-6.61394}
        x2={-1.04646}
        y2={3.35845}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#C200FB" />
        <Stop offset={0.489658} stopColor="#3772FF" />
        <Stop offset={0.489758} stopColor="#3773FE" />
        <Stop offset={1} stopColor="#5AC4BE" />
      </LinearGradient>
      <LinearGradient
        id="paint2_linear_4286_16667"
        x1={33.5739}
        y1={-0.229315}
        x2={-0.246372}
        y2={17.9346}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#C200FB" />
        <Stop offset={0.489658} stopColor="#3772FF" />
        <Stop offset={0.489758} stopColor="#3773FE" />
        <Stop offset={1} stopColor="#5AC4BE" />
      </LinearGradient>
      <LinearGradient
        id="paint3_linear_4286_16667"
        x1={35.6741}
        y1={-5.46108}
        x2={-1.18365}
        y2={5.59565}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#C200FB" />
        <Stop offset={0.489658} stopColor="#3772FF" />
        <Stop offset={0.489758} stopColor="#3773FE" />
        <Stop offset={1} stopColor="#5AC4BE" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default RaydiumIcon2;

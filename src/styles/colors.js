const COLORS = {
  transparent: 'transparent',
  orange: '#FF8E00',
  white: 'white',
  blue: '#25CDD6',
  blue1: '#0A3A3C',
  red: '#FE4D4D',
  green: '#26C64D',
  dark1: '#101111',
  dark2: '#0D3A3C',
  dark3: '#014E52',
  lightGrey1: '#8C9C9D',
  lightGrey2: '#B9C9CA',
  lightGrey3: '#9AB7B8',
  lightGrey4: '#D1DFE0',
  lightGrey5: '#E4EEEF',
  lightGrey6: '#F0F5F5',
  lightGrey7: '#F0F9F9',

  toastBackgroundDefault: 'rgba(107, 141, 143, 0.8)',
  toastBackgroundError: 'rgba(255, 101, 47, 0.8)',
  toastBackgroundWarning: 'rgba(255, 241, 192, 0.8)',
  toastBackgroundSuccess: 'rgba(42, 171, 160, 0.8)',
  overlayBlack: 'rgba(6, 40, 41, 0.9)',
  overlayBlackDark: 'rgba(0, 0, 0, 0.8)',
  overlayBlackLight: 'rgba(0, 0, 0, 0.3)',
};


export default {
  ...COLORS,
  primary: COLORS.blue,
};
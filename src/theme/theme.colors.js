const white = '#FFFFFF';
const black = '#000000';

export function appTheme(darkMode: boolean) {
  return {
    // base
    white,
    black,
    // background
    background1: darkMode ? '#303030' : white,
    background2: darkMode ? '#1A1A1A' : '#F2F4F5',
    background3: darkMode ? '#404040' : '#ECECEC',
    background4: darkMode ? white : black,
    background5: darkMode ? '#404040' : white,
    background6: darkMode ? '#1A73E8' : '#404040', // blue - gray
    background7: darkMode ? '#404040' : '#F4F4F4',
    background8: darkMode ? '#F6465D' : '#ECECEC', // red - gray
    background9: darkMode ? '#404040' : '#333335',
    background10: darkMode ? black : white,
    background11: darkMode ? '#303030' : '#9C9C9C',

    // text
    text1: darkMode ? white : black,
    text2: darkMode ? '#000000' : '#9e9e9e',
    text3: darkMode ? '#9C9C9C' : '#C0C0C0',
    // todo: review
    text4: darkMode ? '#9C9C9C' : '#8A8A8E',
    text5: darkMode ? '#9C9C9C' : '#A6A6A6',
    text6: darkMode ? '#9C9C9C' : '#858383',
    text7: darkMode ? '#64A121' : black,
    text8: darkMode ? white : '#D6D6D6',
    text9: darkMode ? white : '#8A8A8E',
    text10: darkMode ? '#757575' : '#9C9C9C',
    text11: '#757575',
    text12: '#9C9C9C',

    // button
    btnBG1: darkMode ? '#1A73E8' : '#1A73E8',
    btnBG2: darkMode ? '#404040' : white,
    btnBG3: darkMode ? '#404040' : '#F9F9F9',

    // border
    border1: darkMode ? '#484848' : '#F7F7F7',
    border2: darkMode ? white : black,
    border3: darkMode ? '#484848' : '#D6D6D6',
    border4: darkMode ? '#363636' : '#F2F4F5',

    contrast: darkMode ? white : black,

    // icon
    icon1: darkMode ? '#1A73E8' : '#1A73E8', // green - blue

    arrowRightIcon: darkMode ? '#9C9C9C' : black,

    // image
    image1: darkMode ? white : black,

    // border
    borderBaseTextInputColor: darkMode ? white : black,

    // colors
    against: darkMode ? '#FFFFFF' : '#000000',
    primary: darkMode ? '#000000' : '#FFFFFF',
    secondary: '#757575',
    grey1: '#9C9C9C',
    grey2: '#C0C0C0',
    grey3: '#DDDDDD',
    grey4: '#F5F5F5',
    grey7: '#404040',
    grey8: '#363636',
    grey9: '#303030',
    grey10: '#484848',
    ctaMain: '#1A73E8',
    ctaMain01: 'rgba(26, 115, 232, 0.1)',
    black1: '#191919',
    // text
    mainText: darkMode ? white : black,
    subText: darkMode ? '#858383' : '#858383',

    // button
    borderBtnColor: darkMode ? white : black,
    borderBtnSecondary: darkMode ? white : '#1A73E8',

    blue1: '#6BA0FB',
  };
}

import { ScreenWidth, ScreenHeight } from '@src/utils/devices';
import { isIOS } from '@utils/platform';
import COLORS from './colors';
import DECOR from './decor';
import FONTS from './font';
import SPACINGS from './spacing';

const fontSizes = {
  superSmall: 12,
  small: 14,
  regular: 16,
  medium: 18,
  superMedium: 20,
  large: 22,
  veryLarge: 38,
  superLarge: 40,
};


const SIZES = {
  pickerView: {
    height: 40,
  },
  button: {
    height: 50,
  }
};

const BORDER_RADIUS = {
  avatar: 12,
  picker: 12,
};

const text = {
  errorText: {
    ...FONTS.STYLE.normal,
    fontSize: fontSizes.superSmall,
    color: COLORS.red,
  },
  defaultTextStyle: {
    ...FONTS.STYLE.normal,
    fontSize: fontSizes.regular,
    letterSpacing: 0,
  },
  headerTextStyle: {
    ...FONTS.STYLE.bold,
    fontFamily: FONTS.NAME.medium,
    color: COLORS.black,
    fontSize: fontSizes.large,
  },
  regularTextStyle: {
    ...FONTS.STYLE.medium,
    color: COLORS.black,
    fontSize: fontSizes.large,
  },
  mediumTextStyle: {
    ...FONTS.STYLE.normal,
    color: COLORS.black,
    fontSize: fontSizes.medium,
  },
  boldTextStyle: {
    ...FONTS.STYLE.bold,
    color: COLORS.black,
    fontSize: fontSizes.regular,
  },
  boldTextStyleMedium: {
    ...FONTS.STYLE.bold,
    fontSize: fontSizes.medium,
  },
  boldTextStyleSuperMedium: {
    ...FONTS.STYLE.bold,
    fontSize: fontSizes.superMedium,
  },
  boldTextStyleLarge: {
    ...FONTS.STYLE.bold,
    color: COLORS.black,
    fontSize: fontSizes.large,
  },
  regularTextMotto: {
    ...FONTS.STYLE.medium,
    fontFamily: FONTS.NAME.regular,
    color: COLORS.newGrey,
    fontSize: fontSizes.regular,
  },
  mediumTextMotto: {
    ...FONTS.STYLE.medium,
    fontSize: fontSizes.medium,
  },
  mediumText: {
    ...FONTS.STYLE.normal,
    fontFamily: FONTS.NAME.medium,
    fontSize: fontSizes.medium,
  },
  mediumTextBold: {
    ...FONTS.STYLE.normal,
    fontFamily: FONTS.NAME.bold,
    color: COLORS.black,
    fontSize: fontSizes.medium,
  },
  greyTextBoldMediumSize: {
    ...FONTS.STYLE.bold,
    color: COLORS.newGrey,
    fontSize: fontSizes.medium,
  },
  defaultSize: FONTS.SIZE.regular,
  largeTitleSize: fontSizes.superLarge,
  alignCenterText: {
    textAlign: 'center'
  },
  TEXT_TITLE: {
    fontFamily: FONTS.NAME.default,
    fontSize: fontSizes.medium,
  },
  BUTTON_TITLE: {
    fontFamily: FONTS.NAME.bold,
    fontSize: fontSizes.medium,
  },
  BUTTON_TITLE_DISABLE: {
    fontFamily: FONTS.NAME.medium,
    fontSize: fontSizes.medium,
    color: COLORS.black,
  },
  regularSizeMediumFontGrey: {
    fontSize: fontSizes.regular,
    fontFamily: FONTS.NAME.medium,
  },
  regularSizeMediumFontBlack: {
    color: COLORS.black,
    fontSize: fontSizes.regular,
    fontFamily: FONTS.NAME.medium,
  },
  blackMedium: {
    fontSize: fontSizes.medium,
    fontFamily: FONTS.NAME.medium,
  },
  superMediumTextMotto: {
    fontSize: fontSizes.superMedium,
    fontFamily: FONTS.NAME.medium,
  },
};

const MARGIN = {
  margin: 10,
  marginRightDefault: {
    marginRight: 15,
  },
  marginLeftDefault: {
    marginLeft: 15,
  },
  marginBottomDefault: {
    marginBottom: 15,
  },
  marginBottomSmall: {
    marginBottom: 10,
  },
  marginTopDefault: {
    marginTop: 15,
  },
  marginTopAvg: {
    marginTop: 25,
  },
  marginTop30: {
    marginTop: 30,
  },
};


const header = {
  headerHeight: DECOR.scaleInApp(55),
  backgroundColor: COLORS.dark7,
  headerTintColor: COLORS.dark1,
};
const opacityButton = {
  button: {
    backgroundColor: COLORS.colorBlue,
    paddingHorizontal: 5,
    borderRadius: 8,
    borderWidth: DECOR.borderWidth,
    borderColor: COLORS.transparent,
    height: DECOR.buttonHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...text.defaultTextStyle,
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 0,
  },
  disabled: {
    opacity: 0.5
  },
};

const indicator = {
  color: COLORS.colorGreyBold,
};

const container = {
  padding: SPACINGS.small,
  backgroundColor: COLORS.grey,
};

const toast = {
  error: {
    backgroundColor: COLORS.red,
    textColor: COLORS.white,
  },
  warning: {
    backgroundColor: COLORS.orange,
    textColor: COLORS.white,
  },
  info: {
    backgroundColor: COLORS.primary,
    textColor: COLORS.white,
  },
};

const textInput = {
  ...text.defaultTextStyle,
  borderBottomWidth: DECOR.borderWidth,
  borderColor: COLORS.lightGrey4,
};

const divider = {
  color: COLORS.black,
  height: 1,
};

const modal = {
  headerHeight: DECOR.scaleInApp(44),
};

const FLEX = {
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContents: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContents: 'center',
  },
  rowSpaceBetweenDefault: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowSpaceBetweenCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  alignViewSelfCenter: {
    alignSelf: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  absoluteIndicator: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    top: ScreenHeight * 0.4,
  },
};

const SHADOW = {
  imageAvatar: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: isIOS ? 0 : 5,
  },
  normal: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.84,
    elevation: isIOS ? 0 : 5,
  },
};

const IMAGES = {
  avatar: {
    width: ScreenWidth * 0.22,
    height: ScreenWidth * 0.22,
    borderRadius: BORDER_RADIUS.avatar,
  },
  node: {
    width: ScreenWidth / 2.5,
    height: ScreenWidth * 0.5,
    borderRadius: BORDER_RADIUS.avatar,
  },
};

const RECT = {
  picker: {
    borderRadius: BORDER_RADIUS.picker,
    underlineColorAndroid: 'cyan',
    borderColor: COLORS.lightGrey2,
    borderWidth: 0.5,
    height: SIZES.pickerView.height,
  },
};

const INPUT = {
  picker: {
    inputIOS: {
      fontSize: FONTS.SIZE.medium,
      paddingVertical: 12,
      width: ScreenWidth * 0.4,
      paddingHorizontal: 10,
      borderWidth: 0.5,
      borderColor: 'gray',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30,
    },
    inputAndroid: {
      fontSize: FONTS.SIZE.medium,
      width: ScreenWidth * 0.4,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 20,
    },
  },
};

const BUTTON = {
  BLACK_TYPE: {
    width: '100%',
    height: SIZES.button.height,
  },
  BLACK_TYPE_DISABLE: {
    width: '100%',
    height: SIZES.button.height,
  },
  BLUE_TYPE: {
    width: '100%',
    height: SIZES.button.height,
  },

  NODE_BUTTON: {
    // backgroundColor: COLORS.blue5,
  },

  GRAY_TYPE_DISABLE: {
    backgroundColor: COLORS.colorGreyMedium,
    borderRadius: 25,
    width: '100%',
    height: SIZES.button.height,
  },
};

export default {
  header,
  IMAGES,
  RECT,
  FLEX,
  INPUT,
  BORDER_RADIUS,
  SIZES,
  MARGIN,
  SHADOW,
  BUTTON,
  opacityButton,
  text,
  indicator,
  container,
  textInput,
  toast,
  divider,
  modal,
  Button: {
    containerStyle: {
      backgroundColor: 'red',
    },
  },
};

import { StyleSheet } from 'react-native';
import { FONT, COLORS, UTILS } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  extra: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  extraTop: {
    marginBottom: 5,
  },
  name: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
    // maxWidth: '60%',
  },
  leftText: {
    textAlign: 'left',
  },
  rightText: {
    textAlign: 'right',
  },
  boldText: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
  },
  displayName: {
    maxWidth: '80%',
  },
  text: {
    fontFamily: FONT.NAME.medium,
    maxWidth: UTILS.screenWidth() / 2 - 50,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 4,
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  pSymbol: {
    fontFamily: FONT.NAME.specialRegular,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 4,
  },
  pSymbolBold: {
    fontFamily: FONT.NAME.specialRegular,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    color: COLORS.black,
  },
  redText: {
    color: COLORS.red,
  },
  greenText: {
    color: COLORS.green,
  },
  bottomText: {
    ...FONT.TEXT.incognitoP1,
  },
  normalText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followText: {
    fontFamily: FONT.NAME.regular,
    color: COLORS.colorGreyBold,
    lineHeight: FONT.SIZE.regular + 3,
    fontSize: FONT.SIZE.regular,
  },
});

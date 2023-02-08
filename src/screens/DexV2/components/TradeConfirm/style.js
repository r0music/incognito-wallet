import  {COLORS, FONT, UTILS } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    marginVertical: UTILS.heightScale(38),
  },
  buttonTitle: {
    fontSize: 20,
    ...FONT.STYLE.medium,
  },
  error: {
    color: COLORS.red,
    lineHeight: 22,
  },
  error1: {
    color: COLORS.red,
    lineHeight: 16,
    fontSize: 14,
    ...FONT.STYLE.normal,
  },
  bigText: {
    color: COLORS.blue5,
    fontSize: 40,
    lineHeight: 55,
    ...FONT.STYLE.bold,
  },
  mainInfo: {
    marginVertical: UTILS.heightScale(38),
  },
  bold: {
    ...FONT.STYLE.bold,
    color: COLORS.black,
  },
  extra: {
    color: COLORS.lightGrey17,
  },
  extraMedium: {
    ...FONT.STYLE.medium,
  },
  warning: {
    color: COLORS.orange,
  },
  row: {
    flexDirection: 'row'
  },
});

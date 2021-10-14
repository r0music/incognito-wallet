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
  },
  bigText: {
    color: COLORS.green2,
    fontSize: 30,
    lineHeight: 45,
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
    color: COLORS.newGrey,
    fontSize: 16,
    lineHeight: 19,
  },
  extraRight: {
    color: COLORS.black,
  },
  warning: {
    color: COLORS.orange,
  },
  row: {
    flexDirection: 'row'
  },
  label: {
    fontFamily: FONT.NAME.medium,
    fontSize: 16,
    lineHeight: 21,
  },
});

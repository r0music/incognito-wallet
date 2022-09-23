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
    marginVertical: UTILS.heightScale(10),
  },
  bold: {
    ...FONT.STYLE.bold,
  },
  extra: {
    fontSize: 16,
    lineHeight: 19,
  },
  extraRight: {},
  warning: {
    color: COLORS.orange,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontFamily: FONT.NAME.medium,
    fontSize: 16,
    lineHeight: 21,
  },
  networkBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: COLORS.gray1,
    marginLeft: 20,
  },
  networkText: {
    color: COLORS.lightGrey36,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
});

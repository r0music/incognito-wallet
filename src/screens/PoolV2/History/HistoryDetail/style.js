import {COLORS, FONT} from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    marginVertical: 50,
  },
  buttonTitle: {
    fontSize: FONT.SIZE.medium,
  },
  error: {
    color: COLORS.red,
  },
  bold: {
    ...FONT.STYLE.bold,
  },
  content: {
    fontFamily: FONT.STYLE.medium,
    fontSize: FONT.SIZE.superMedium,
    marginTop: 5,
    ...FONT.STYLE.bold,
  },
  historyItem: {
    marginBottom: 30,
  },
  right: {
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  extra: {
    ...FONT.STYLE.medium,
    fontSize: 18,
  },
  info: {
    fontSize: 18,
  },
});

import {COLORS, FONT} from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    marginVertical: 50,
  },
  buttonTitle: {
    fontSize: FONT.SIZE.incognitoP2,
    backgroundColor: '#404040',
    minHeight: 24,
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 5,
    overflow: 'hidden'
  },
  error: {
    color: COLORS.red,
  },
  bold: {
    ...FONT.STYLE.bold,
  },
  content: {
    ...FONT.TEXT.incognitoH2,
    marginTop: 5,
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
    fontSize: 16,
  },
  info: {
    fontSize: 16,
  },
});

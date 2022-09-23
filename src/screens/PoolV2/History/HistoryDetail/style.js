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
  descContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  historyType: {
    color: COLORS.lightGrey36,
    fontSize: 14,
  },
  networkBox: {
    backgroundColor: COLORS.gray1,
    marginLeft: 18,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  networkName: {
    color: COLORS.lightGrey36,
    fontSize: 16,
    lineHeight: 22,
  },
  error: {
    color: COLORS.red,
  },
  bold: {
    ...FONT.STYLE.bold,
  },
  content: {
    fontSize: 20,
    fontWeight: '500',
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

import {COLORS, FONT} from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    marginBottom: 10,
  },
  button: {
    marginVertical: 50,
  },
  buttonTitle: {
    fontSize: 20,
    marginBottom: 5,
    ...FONT.STYLE.bold,
  },
  error: {
    color: COLORS.red,
  },
  bold: {
    ...FONT.STYLE.bold,
    color: COLORS.black,
  },
  content: {
    fontSize: 18,
    color: COLORS.lightGrey16,
  },
  historyItem: {
    marginBottom: 30,
  },
  historyTitle: {
    paddingTop: 30,
  },
  right: {
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
  },
  ellipsis: {
    flex: 1,
    marginRight: 25,
  },
  emptyListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingBottom: 80,
  },
  emptyText: {
    marginTop: 16,
    fontFamily: FONT.NAME.regular,
    color: COLORS.newGrey,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  unlockDate: {
    fontFamily: FONT.NAME.regular,
    color: COLORS.newGrey,
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
    marginTop: 16,
  },
  endTermText: {
    fontFamily: FONT.NAME.regular,
    color: COLORS.black,
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 8,
    fontWeight: 'bold'
  },
});

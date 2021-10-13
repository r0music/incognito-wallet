import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';
import { isAndroid } from '@utils/platform';

export default StyleSheet.create({
  flex: {
    flex: 1,
  },
  coinContainer: {
    marginTop: 30,
    flex: 1,
  },
  coin: {
    marginBottom: 20,
  },
  coinName: {
    fontFamily: FONT.NAME.bold,
    fontSize: 20,
    marginBottom: 8,
  },
  coinInterest: {
    fontSize: 18,
    color: COLORS.green2,
    fontFamily: FONT.NAME.medium,
    marginBottom: 8,
  },
  coinExtra: {
    fontFamily: FONT.NAME.medium,
    color: COLORS.newGrey,
    fontSize: 18,
    marginBottom: 8,
  },
  coinExtraSmall: {
    fontFamily: FONT.NAME.medium,
    color: COLORS.newGrey,
    fontSize: 16,
    lineHeight: 18,
    marginBottom: 8,
  },
  coinExtraSmallWrapper: {
    marginVertical: 0,
  },
  textRight: {
    textAlign: 'right',
  },
  justifyRight: {
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: COLORS.green2,
  },
  error: {
    color: COLORS.red,
    fontSize: 16,
    minHeight: 20,
    fontFamily: FONT.NAME.regular,
    marginBottom: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    fontFamily: FONT.NAME.bold,
    fontSize: 26,
    height: isAndroid() ? 52 : 'auto',
    padding: 0,
    flex: 1,
    marginRight: 15,
    marginBottom: isAndroid() ? -8 : 0,
  },
  inputContainer: {
    marginBottom: 8,
    backgroundColor: COLORS.lightGrey31,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 8,
  },
  symbol: {
    fontSize: 20,
    fontFamily: FONT.NAME.bold,
  },
  wrapTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  wrapperLock: {
    paddingHorizontal: 8,
    alignItems: 'center',
    paddingVertical: 4,
    backgroundColor: COLORS.lightGrey19,
    marginLeft: 8,
    height: 24,
    borderRadius: 4
  },
  lockText: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
    color: COLORS.newGrey,
    marginLeft: 5
  },
  btnMirage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
    marginLeft: 8,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 4
  },
  mirageText: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
    color: COLORS.white,
  },
  btnViewDetail: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderColor: COLORS.black,
    borderWidth: 1,
  },
  viewDetailText: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
    color:  COLORS.black,
  },
  emptyRight: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconUp: {
    width: 14,
    height: 16,
    marginBottom: 8,
    marginRight: 9
  }
});

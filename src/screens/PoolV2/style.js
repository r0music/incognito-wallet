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
  coinContainerNoMargin: {
    flex: 1,
    paddingTop: 20,
  },
  coin: {
    marginBottom: 20,
  },
  coinName: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    marginBottom: 8,
  },
  coinInterest: {
    ...FONT.TEXT.incognitoP1,
    marginBottom: 8,
  },
  coinExtra: {
    ...FONT.TEXT.incognitoP1,
    marginBottom: 8,
  },
  coinExtraSmall: {
    fontFamily: FONT.NAME.medium,
    color: COLORS.newGrey,
    fontSize: FONT.SIZE.small,
    lineHeight: 18,
    marginBottom: 8,
  },
  coinExtraSmallWrapper: {
    marginVertical: 0,
  },
  textRight: {
    textAlign: 'right',
  },
  textCenter: {
    textAlign: 'center',
  },
  justifyRight: {
    justifyContent: 'flex-end',
  },
  button: {},
  error: {
    color: COLORS.red,
    fontSize: 16,
    minHeight: 20,
    fontFamily: FONT.NAME.regular,
    marginTop: 8
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    fontFamily: FONT.NAME.medium,
    fontSize: 26,
    height: isAndroid() ? 52 : 'auto',
    padding: 0,
    flex: 1,
    marginRight: 15,
    marginBottom: isAndroid() ? -8 : 0,
  },
  inputContainer: {
    marginBottom: 8,
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
    marginBottom: 8,
  },
  wrapperLock: {
    paddingHorizontal: 8,
    alignItems: 'center',
    marginLeft: 8,
    height: 24,
    borderRadius: 4,
  },
  lockText: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
    marginLeft: 5,
  },
  btnMirage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  mirageText: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
  },
  btnViewDetail: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  viewDetailText: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
  },
  emptyRight: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconUp: {
    width: 14,
    height: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  label: {
    fontSize: FONT.SIZE.small,
    ...FONT.STYLE.normal,
    lineHeight: 21,
  },
});

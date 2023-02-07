import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import { isIOS } from '@utils/platform';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const headerStyled = StyleSheet.create({
  container: {
    height: 45,
  },
  icon: {
    marginRight: 16,
  },
  notify: {
    position: 'absolute',
    width: 8,
    height: 8,
    right: 15,
    borderRadius: 4,
  },
});

export const styledBalance = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  wrapperAmount: {
    flexDirection: 'row',
    width: '100%'
  },
  title: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 7,
  },
  balance: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.veryLarge,
    lineHeight: FONT.SIZE.veryLarge + 10,
    maxWidth: '85%',
    height: '100%',
  },
  pSymbol: {
    fontFamily: FONT.NAME.specialRegular,
    fontSize: FONT.SIZE.veryLarge,
    lineHeight: FONT.SIZE.veryLarge + 10,
    height: '100%',
  },
  balanceContainer: {
    // width: '100%',
  },
  wrapBalance: {
    minHeight: FONT.SIZE.veryLarge + 10,
  },
  iconHide: {
    marginLeft: 5,
  },
  btnHideBalance: {
    // position: 'absolute',
    // right: -15,
    // top: -15,
    // width: 50,
    // height: 50,
    marginLeft: 6,
    paddingTop: 6
  },
});

export const groupButtonStyled = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  tooltip: {
    // backgroundColor: COLORS.colorBlue,
    borderRadius: 11,
    marginBottom: 20,
    borderColor: COLORS.colorBlue,
    borderWidth: 1,
  },
  triangleStyle: {
    bottom: -30,
    left: '48%',
    borderBottomColor: COLORS.colorBlue,
    borderBottomWidth: 10,
  },
  btnClose: {
    position: 'absolute',
    top: 5,
    right: 0,
    width: 32,
    height: 32,
    zIndex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 3,
    color: COLORS.black,
    marginBottom: 5,
  },
  desc: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small + 1,
    lineHeight: FONT.SIZE.small + 6,
    color: COLORS.black,
  },
  wrapHook: {
    padding: 20,
    paddingBottom: 0,
  },
});

export const tokenStyled = StyleSheet.create({
  container: {
    ...globalStyled.defaultPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  wrapFirst: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'space-between',
  },
  wrapSecond: {
    flex: 1,
    alignItems: 'flex-end',
    // height: '100%'
  },
  wrapThird: {
    flex: 1,
  },
  rowHeight: {
    height: FONT.SIZE.regular + 8,
  },
  mainText: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 7,
    textAlign: 'left',
    marginBottom: isIOS() ? 0 : 5,
  },
  grayText: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
  },
  centerVertical: {
    justifyContent: 'center',
  },
  iconVerify: {
    width: 12,
    height: 12,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  wrapHeader: {
    marginTop: 5,
    marginBottom: 10,
  },
  wrapLoader: {
    height: FONT.SIZE.medium + 9,
    justifyContent: 'center',
  },
});

export const styledAddToken = StyleSheet.create({
  container: {},
});

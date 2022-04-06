import { StyleSheet } from 'react-native';
import { FONT } from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import { isIOS } from '@utils/platform';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10
  },
  list: {
    paddingBottom: 50,
  },
});

export const portfolioItemStyled = StyleSheet.create({
  container: {
    // ...globalStyled.defaultPaddingHorizontal,
    paddingVertical: 16
  },
  hookContainer: {
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  hookLabel: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 3,
  },
  hookValue: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 3,
  },
  extraContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  extraLabel: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 9,
    marginBottom: isIOS() ? 0 : 7
  },
  btnSmall: {
    height: 28,
    width: 89,
    marginLeft: 5,
  },
  titleSmall: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small - 1,
    lineHeight: FONT.SIZE.small + 2,
  },
  withdrawBtn: {
    height: 28,
    width: 50,
  },
  withdrawing: {
    height: 28,
    width: 85,
  }
});

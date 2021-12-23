import { StyleSheet } from 'react-native';
import { FONT, COLORS, UTILS } from '@src/styles';
import { ScreenWidth } from '@utils/devices';
import globalStyled from '@src/theme/theme.styled';

const maxWidth = UTILS.screenWidth() - 190;

export const styled = StyleSheet.create({
  container: { flex: 1 },
  styledContainerHeaderTitle: {
    maxWidth,
  },
});

export const groupBtnStyled = StyleSheet.create({
  groupButton: {
    ...globalStyled.defaultPaddingHorizontal,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  btnStyle: {
    width: '49%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0
  },
  titleStyle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    color: COLORS.white,
  },
});

export const balanceStyled = StyleSheet.create({
  container: {
    marginBottom: 0
  },
  amount: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.veryLarge,
    maxWidth: '100%',
    lineHeight: FONT.SIZE.veryLarge + 4,
    textAlign: 'center',
  },
  amountBasePRV: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 10,
    maxWidth: ScreenWidth
  },
  changePrice: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 4,
  },
  hook: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 0
  },
  pSymbol: {
    fontFamily: FONT.NAME.specialRegular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.medium + 4,
  },
});

export const historyStyled = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
  },
});

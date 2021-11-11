import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

export const styled = StyleSheet.create({
  container: { flex: 1 },
  scrollview: { flex: 1 },
  btnRefresh: {
    marginRight: 12,
  },
  btnTrade: {
    marginBottom: 40,
  },
});

export const tabsStyled = StyleSheet.create({
  tabBtn: {
    height: 32,
    width: 62,
    backgroundColor: COLORS.black,
    maxWidth: 62,
  },
  tabBtnDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  tabTitleStyled: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 3,
    color: COLORS.white,
  },
  tabTitleDisabledStyled: {
    color: COLORS.colorGrey3,
  },
  styledTabList: {
    maxWidth: 132,
  },
});

export const inputGroupStyled = StyleSheet.create({
  selectPercentAmountContainer: {
    marginVertical: 30,
  },
  rightHeaderSell: {
    flex: 1,
    marginLeft: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  balanceStr: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.superSmall,
    lineHeight: FONT.SIZE.superSmall + 3,
    color: COLORS.colorGrey3,
  },
  btnStyle: {
    height: 20,
    marginLeft: 15,
    borderRadius: 4,
    paddingHorizontal: 5,
  },
  titleStyle: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superSmall,
    lineHeight: FONT.SIZE.superSmall + 3,
  },
  inputGroups: {
    marginTop: 24,
  },
});

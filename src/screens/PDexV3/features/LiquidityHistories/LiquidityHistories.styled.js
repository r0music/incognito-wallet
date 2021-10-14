import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  wrapper: {
    paddingTop: 20,
  },
  wrapperItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.colorGrey4
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  title: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 8,
    color: COLORS.black
  },
  status: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 7,
    color: COLORS.lightGrey33
  },
  desc: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 7,
    color: COLORS.lightGrey34
  },
  leftText: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 7,
    color: COLORS.lightGrey34
  },
  rightText: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 7,
    color: COLORS.black
  },
});

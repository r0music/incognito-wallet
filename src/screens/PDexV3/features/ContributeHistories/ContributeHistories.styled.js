import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  wrapper: {
    paddingTop: 20,
  },
  wrapperItem: {
    paddingBottom: 25,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  title: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.superMedium,
    color: COLORS.black
  },
  status: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.medium,
    color: COLORS.newGrey
  },
  desc: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.regular,
    color: COLORS.newGrey
  }
});

import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export const styled = StyleSheet.create({
  wrapper: {
    paddingBottom: 25
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.superMedium,
  },
  status: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.medium,
  },
  desc: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.regular,
  }
});

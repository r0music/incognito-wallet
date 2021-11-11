import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

export const styled = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  rowName: {
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    marginRight: 5,
    fontSize: FONT.SIZE.medium,
    color: COLORS.black,
    fontFamily: FONT.NAME.medium,
  },
  nameFollowed: {
    color: COLORS.black,
  },
  subText: {
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 2,
    color: COLORS.colorGrey3,
    fontFamily: FONT.NAME.medium,
    marginBottom: 8,
  },
  block1: {
    flex: 1,
    marginRight: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  block2: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: 5,
    width: 80,
  },
  block3: {
    width: 30,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

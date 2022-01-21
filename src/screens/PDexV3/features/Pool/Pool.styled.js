import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';
import globalStyled from '@src/theme/theme.styled';

export const styled = StyleSheet.create({
  container: {
    ...globalStyled.defaultPaddingHorizontal,
    paddingVertical: 16
  },
  rowName: {
    alignItems: 'center',
    // marginBottom: 8,
  },
  name: {
    marginRight: 5,
    fontSize: FONT.SIZE.medium,
    fontFamily: FONT.NAME.medium,
  },
  nameFollowed: {
    color: COLORS.black,
  },
  subText: {
    fontSize: FONT.SIZE.medium,
    fontFamily: FONT.NAME.medium,
    // marginBottom: 8,
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

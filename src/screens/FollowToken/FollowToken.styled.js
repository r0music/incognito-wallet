import { StyleSheet } from 'react-native';
import { FONT } from '@src/styles';
import globalStyled from '@src/theme/theme.styled';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    paddingTop: 27,
  },
  text: {
    ...FONT.STYLE.normal,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
  },
  boldText: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
  },
  addManually: {
    ...globalStyled.defaultPaddingHorizontal,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listToken: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
  },
});

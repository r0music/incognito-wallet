import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

export const styled = StyleSheet.create({
  container: { flex: 1 },
  scrollview: {
    flex: 1,
  },
  nftTokenItemContainer: {
    marginBottom: 15,
  },
  nftTokenItemWrapper: {
    justifyContent: 'space-between',
  },
  nftToken: {
    flex: 1,
    marginRight: 30,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 3,
    color: COLORS.colorGreyBold,
    maxWidth: '50%',
    textAlign: 'left',
  },
  amount: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 3,
    color: COLORS.colorGreyBold,
    flex: 1,
    textAlign: 'right',
  },
  listTitle: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 3,
    color: COLORS.black,
    marginBottom: 15,
  },
  list: {
    marginBottom: 30,
  },
});

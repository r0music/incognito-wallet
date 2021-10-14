import { COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

export const styled = StyleSheet.create({
  arrowWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  arrow: {
    marginHorizontal: 7.5,
    height: 40,
    resizeMode: 'contain',
  },
  divider: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey5,
  },
});

import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';

const styled = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 30,
  },
  title: {
    ...FONT.STYLE.bold,
    fontSize: FONT.SIZE.medium + 3,
    lineHeight: FONT.SIZE.medium + 15,
  },
  poolSize: {
    ...FONT.STYLE.medium,
    color: COLORS.newGrey,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 15,
  }
});

export default styled;

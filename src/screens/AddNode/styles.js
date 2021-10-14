import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

const styles = StyleSheet.create({
  container: {
  },
  content: {
    paddingTop: 32,
  },
  contentItem: {
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: FONT.NAME.bold,
    lineHeight: 24,
    marginBottom: 10,
    color: COLORS.black,
  },
  subTitle: {
    fontFamily: FONT.NAME.medium,
    lineHeight: 18,
    color: COLORS.newGrey,
    fontSize: FONT.SIZE.medium,
  },
});

export default styles;

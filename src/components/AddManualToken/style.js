import { StyleSheet } from 'react-native';
import { FONT } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  desc: {
    marginBottom: 10,
  },
  submitBtn: {
    marginTop: 50,
    height: 50,
  },
  input: {
  },
  text: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
  },
  boldText: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
  },
  form: {
    flex: 1,
  },
  submitBtnTitle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 3,
  },
});

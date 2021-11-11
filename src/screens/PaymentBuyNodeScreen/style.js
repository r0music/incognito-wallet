import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  content: {
    marginTop: 42,
  },
  field: {
    marginBottom: 30,
  },
  label: {
    ...FONT.STYLE.bold,
    color: COLORS.black,
    fontSize: 20,
    marginBottom: 10,
  },
  text: {
    ...FONT.STYLE.medium,
    color: COLORS.black,
    fontSize: 20,
  },
  error: {
    ...FONT.STYLE.medium,
    color: COLORS.orange,
    fontSize: 14,
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: COLORS.blue5,
  },
  buttonColor: {
    backgroundColor: COLORS.blue5,
  },
  feeText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14
  },
});

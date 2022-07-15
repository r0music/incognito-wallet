import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginBottom: 30,
  },
  title: {
    ...FONT.STYLE.bold,
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    ...FONT.STYLE.medium,
    fontSize: 16,
    textAlign: 'center',
  },
});

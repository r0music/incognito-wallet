import {COLORS, FONT, THEME} from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    ...THEME.opacityButton.button,
    borderRadius: 4,
  },
  text: {
    ...THEME.opacityButton.buttonText,
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.medium,
  },
  textContainer: {
    marginHorizontal: 5,
  },
  dangerStyle: {
    ...THEME.opacityButton.button,
    backgroundColor: COLORS.red
  },
  primaryStyle: {
    ...THEME.opacityButton.button,
    backgroundColor: COLORS.blue,
  },
  secondaryStyle: {
    ...THEME.opacityButton.button,
    backgroundColor: COLORS.dark3,
  },
  loadingIcon: {
    marginHorizontal: 4,
  },
  disabled: {
    ...THEME.opacityButton.disabled,
    opacity: 0.5,
  },
});

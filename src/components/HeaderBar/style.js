import { StyleSheet } from 'react-native';
import TextStyle, { scaleInApp, screenSize } from '@src/styles/TextStyle';
import { COLORS, THEME, FONT } from '@src/styles';

export const sizeHeader ={
  height:THEME.header.headerHeight,
  width: screenSize.width
}; 

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: sizeHeader.height,
    alignItems: 'center'
  },
  title: {
    ...TextStyle.bigText,
    ...FONT.STYLE.bold,
    color: COLORS.white,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  center: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

export default style;

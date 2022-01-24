import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export const styled = StyleSheet.create({

});

export const headerStyled = StyleSheet.create({
  title: {
    ...FONT.TEXT.incognitoH4,
    lineHeight: 28,
  },
  wrapTab: {
    width: 49,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 8,
  },
  tabText: {
    ...FONT.STYLE.normal,
    fontSize: FONT.SIZE.regular,
  },
  wrapSearch: {
    height: 60,
    marginBottom: 8,
  },
  iconButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.darkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    right: 10,
    borderWidth: 1,
    borderColor: COLORS.darkGrey
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconButtonSpacing: {
    width: 8,
  },
  wrapInput: {
    flex: 1,
  },
  rowStyle: {},
  rowTextStyle: {
    ...FONT.STYLE.normal,
    fontSize: FONT.SIZE.small,
  },
  dropdownStyle: {
    borderRadius: 8,
    width: 110,
  },
  buttonTextStyle: {
    ...FONT.STYLE.normal,
    color: COLORS.black,
    fontSize: FONT.SIZE.regular,
  },
  buttonStyle: {
    width: 98,
    borderRadius: 8,
    height: 40,
    backgroundColor: COLORS.lightGrey30,
  },
  wrapFilter: {
    paddingTop: 24,
  },
});

export const itemStyled = StyleSheet.create({
  wrapItem: {
    paddingBottom: 30,
  },
  blackLabel: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small + 1,
    textAlign: 'left',
    color: COLORS.black
  },
  icon: {
    marginRight: 16,
    width: 20,
    height: 20
  },
  sectionFirst: {
    flex: 0.6,
    paddingRight: 10
  },
  sectionSecond: {
    flex: 0.4,
    paddingRight: 10
  },
  sectionThird: {
    width: 80,
    paddingRight: 10
  }
});

import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingLeft: 25,
  },
  scrollViewContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  category: {
    marginTop: 30,
  },
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 4,
    color: COLORS.white,
    paddingLeft: 25,
  },
  subTitle: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
    color: COLORS.black,
  },
});

export const listNewsStyled = StyleSheet.create({
  highlights: {
    backgroundColor: '#D9F4FF',
    padding: 15,
  },

  hook: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  hook1: {
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  hook2: {
    marginTop: 30,
  },
  hook3: {
    marginTop: 15,
  },
  icon: {
    width: 55,
    height: 55,
    marginRight: 20,
  },
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    color: COLORS.white,
    flex: 1,
  },
  descContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  desc: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    color: COLORS.blue5,
    marginRight: 4,
    lineHeight: FONT.SIZE.regular
  },
  date: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    color: COLORS.lightGrey36,
    flex: 1,
    marginTop: 8,
  },
  descNoIcon: {
    flex: 0,
    marginRight: 2,
  },
  circle: {
    backgroundColor: COLORS.black,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  extra: {
    borderBottomWidth: 1,
    borderColor: '#363636',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  listNews: {},
});

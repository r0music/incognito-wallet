import {StyleSheet} from 'react-native';
import {COLORS, FONT, UTILS} from '@src/styles';
import {isAndroid} from '@utils/platform';

export const btnStyles = StyleSheet.create({
  button: {
    marginTop: UTILS.heightScale(25),
    marginHorizontal: 4,
    flex: 1,
    backgroundColor: COLORS.green2,
  },
});

export const coinStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  coinContainer: {
    marginTop: UTILS.heightScale(25),
    flex: 1,
  },
  coin: {
    marginBottom: UTILS.heightScale(20),
  },
  coinName: {
    fontFamily: FONT.NAME.bold,
    fontSize: 20,
    marginBottom: UTILS.heightScale(8),
  },
  coinInterest: {
    fontSize: 18,
    color: COLORS.green2,
    fontFamily: FONT.NAME.medium,
    marginBottom: UTILS.heightScale(8),
  },
  coinExtra: {
    fontFamily: FONT.NAME.medium,
    color: COLORS.newGrey,
    fontSize: 18,
  },
  textRight: {
    textAlign: 'right',
  },
  justifyRight: {
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: COLORS.green2,
    marginTop: 40,
    marginBottom: 30,
  },
  error: {
    color: COLORS.red,
    fontSize: 16,
    minHeight: 20,
    marginTop: 5
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    fontFamily: FONT.NAME.bold,
    fontSize: 26,
    height: isAndroid() ? 52 : 'auto',
    padding: 0,
    flex: 1,
    marginRight: 15,
    marginBottom: isAndroid() ? -UTILS.heightScale(8) : 0,
  },
  inputContainer: {
    marginBottom: UTILS.heightScale(8)
  },
  symbol: {
    fontSize: UTILS.heightScale(20),
    fontFamily: FONT.NAME.bold,
  },
  rateChange: {
    position: 'absolute',
    backgroundColor: 'white',
    paddingVertical: UTILS.heightScale(15),
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: UTILS.heightScale(15),
  },
  rateStyle: {
    fontFamily: FONT.NAME.medium,
    color: COLORS.newGrey,
    fontSize: 18,
  },
});

export const confirmStyle = StyleSheet.create({
  button: {
    marginVertical: UTILS.heightScale(38),
  },
  buttonTitle: {
    fontSize: 20,
    ...FONT.STYLE.medium,
  },
  error: {
    color: COLORS.red,
  },
  bigText: {
    color: COLORS.green2,
    fontSize: 40,
    lineHeight: 55,
    ...FONT.STYLE.bold,
  },
  mainInfo: {
    marginVertical: UTILS.heightScale(38),
  },
  bold: {
    ...FONT.STYLE.bold,
    color: COLORS.black,
  },
  extra: {
    color: COLORS.lightGrey17,
  },
  warning: {
    color: COLORS.orange,
  },
  row: {
    flexDirection: 'row'
  },
});

export const historyStyle = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginBottom: 10,
  },
  button: {
    marginVertical: 50,
  },
  buttonTitle: {
    fontSize: 20,
    marginBottom: 5,
    ...FONT.STYLE.bold,
  },
  error: {
    color: COLORS.red,
  },
  bold: {
    ...FONT.STYLE.bold,
    color: COLORS.black,
  },
  content: {
    fontSize: 18,
    color: COLORS.lightGrey16,
  },
  historyItem: {
    marginBottom: 30,
  },
  historyTitle: {
    paddingTop: 30,
  },
  right: {
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
  },
  ellipsis: {
    flex: 1,
    marginRight: 25,
  },
});
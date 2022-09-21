import { StyleSheet } from 'react-native';
import { COLORS, FONT, UTILS } from '@src/styles';
import { isAndroid } from '@utils/platform';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  extra: {
    // alignItems: 'center',
  },
  titleStyled: {
    textTransform: 'none',
  },
  shieldDescription: {
    fontSize: 14,
    color: COLORS.lightGrey36,
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 16,
  },
  shieldExpiration: {
    fontFamily: FONT.NAME.bold,
    lineHeight: FONT.SIZE.regular + 9,
    color: COLORS.orange,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 5,
  },
  text: {
    fontFamily: FONT.NAME.regular,
    lineHeight: FONT.SIZE.regular + 9,
    fontSize: FONT.SIZE.regular,
    color: COLORS.colorGreyBold,
    textAlign: 'center',
  },
  boldText: {
    fontFamily: FONT.NAME.medium,
    fontSize: 14,
  },
  smallText: {
    fontSize: 13,
    lineHeight: 15,
    marginTop: 5,
    color: COLORS.orange,
    fontFamily: FONT.NAME.bold,
  },
  errorIcon: {
    color: COLORS.orange,
    fontSize: 60,
  },
  hook: {
    alignItems: 'center',
    marginBottom: 30,
  },
  networkTypeLabel: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
    marginTop: 16,
  },
  questionIcon: {
    marginBottom: 10,
  },
  qrCode: {
    marginVertical: 30,
  },
  clockIcon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 7,
  },
  scrollViewContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  scrollview: {
    flexGrow: 1,
    padding: 24,
  },
  countdown: {
    paddingHorizontal: 10,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 42,
    padding: 16,
  },
  errorText: {
    fontFamily: FONT.NAME.medium,
    lineHeight: FONT.SIZE.regular + 5,
    fontSize: FONT.SIZE.regular,
    color: COLORS.colorGreyBold,
    textAlign: 'center',
    marginTop: 15,
  },
  btnRetry: {
    width: '100%',
    marginTop: 50,
  },
  titleBtnRetry: {
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 3,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  textContent: {
    fontFamily: FONT.NAME.medium,
    lineHeight: FONT.SIZE.regular + 3,
    fontSize: FONT.SIZE.regular,
    color: COLORS.white,
    textAlign: 'center',
  },
  centerRaw: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnInfo: {
    marginTop: 10,
  },
  input: {
    fontFamily: FONT.NAME.bold,
    fontSize: 26,
    height: isAndroid() ? 52 : 'auto',
    padding: 0,
    flex: 1,
    marginRight: 15,
    marginTop: 20,
    marginBottom: isAndroid() ? -UTILS.heightScale(16) : 10,
    textAlign: 'center',
  },

  disconnectButton: {
    fontFamily: FONT.NAME.bold,
    width: '50%',
    backgroundColor: 'red',
    marginTop: 2,
  },

  wrapConnect: {
    minWidth: 80,
    maxWidth: 120,
  },

  btnConnect: {
    height: 40,
    paddingHorizontal: 15,
    width: '100%',
  },
  connectStyle: {
    fontFamily: FONT.NAME.medium,
    fontSize: 15,
    lineHeight: 19,
    marginRight: 5,
  },
  btnShield: {
    marginTop: 40,
  },
  wrapMessage: {
    alignSelf: 'center',
    marginTop: 10,
  },
  shieldMessage: {
    fontSize: 13,
    lineHeight: 15,
    marginTop: 5,
    color: COLORS.orange,
    fontFamily: FONT.NAME.bold,
    textAlign: 'center',
  },
  selectedBtn: {
    backgroundColor: '#EFEFEF',
  },
  unSelectBtn: {
    borderColor: COLORS.colorGreyLight,
  },
  icon: {
    marginTop: 2,
    marginRight: 8,
  },
  optionBtn: {
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    width: '49%',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectBox: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSelectBox: {
    fontFamily: FONT.NAME.specialMedium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.medium + 4,
    marginLeft: 10,
  },
  warningBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  networkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: COLORS.gray1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  noteBoxContainer: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: COLORS.gray1,
    paddingVertical: 20,
    marginTop: 24,
  },
  noteItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray1,
    paddingHorizontal: 16,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5 / 2,
    backgroundColor: COLORS.gray2,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
  },
  space: {
    height: 8,
    backgroundColor: COLORS.gray1,
  },
  grayText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.lightGrey36,
  },
  redText: {
    fontSize: 12,
    color: COLORS.red,
    fontWeight: '400',
    lineHeight: 18,
  },
  orangeText: {
    fontSize: 12,
    color: COLORS.lightOrange,
    fontWeight: '400',
    lineHeight: 18,
  },
});

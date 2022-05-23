import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';
import { getBottomAreaHeight } from '@utils/SafeAreaHelper';

const BOTTOM_BAR_PADDING_BOTTOM = getBottomAreaHeight() + 10;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 60 + BOTTOM_BAR_PADDING_BOTTOM,
  },
  wrapper: {
    flex: 1,
    marginTop: 40,
  },
  arrowWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    height: 40,
    resizeMode: 'contain',
  },
  divider: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey18,
  },
  button: {
    marginVertical: 50,
    backgroundColor: COLORS.blue5,
    height: 50,
  },
  buttonTitle: {
    fontSize: 20,
    ...FONT.STYLE.medium,
  },
  error: {
    color: COLORS.red,
    fontSize: 14,
    marginTop: -10,
  },
  warning: {
    color: COLORS.orange,
  },
  bottomFloatBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomText: {
    color: COLORS.newGrey,
    ...FONT.STYLE.medium,
  },
  bottomBar: {
    position: 'absolute',
    justifyContent: 'center',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: BOTTOM_BAR_PADDING_BOTTOM,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row'
  },
  textLeft: {
    marginRight: 0
  },
  wrapperInfo: {
    marginTop: 26,
  },
  wrapperSegment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  btnRetry: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
  }
});

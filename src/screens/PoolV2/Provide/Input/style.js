import { StyleSheet } from 'react-native';
import { UTILS, COLORS, FONT} from '@src/styles';

export default StyleSheet.create({
  button: {
    marginTop: UTILS.heightScale(24),
    marginBottom: UTILS.heightScale(16),
  },
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedButton: {
    padding: 7,
    borderRadius: 16,
    borderWidth: 0,
    marginBottom: 5,
  },
  unSelectedButon: {
    padding: 7,
    borderRadius: 16,
    marginBottom: 5
  },
  textLeft: {
    fontFamily: FONT.NAME.specialMedium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.medium + 4,
  },
  textRight: {
    marginLeft: 10,
    tintColor: COLORS.green2,
    color: COLORS.green2,
  },
});

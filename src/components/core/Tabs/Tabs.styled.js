import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  tabs: {
    backgroundColor: 'transparent',
    minHeight: 50,
  },
  tabList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.colorGreyLight1,
    borderRadius: 40,
    flex: 1,
  },
  tabList1: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomColor: COLORS.colorGrey2,
    borderBottomWidth: 1,
  },
  tabContent: {
    flex: 1,
  },
});

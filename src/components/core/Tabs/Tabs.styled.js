import { StyleSheet } from 'react-native';
import { ScreenWidth } from '@utils/devices';

export const styled = StyleSheet.create({
  tabs: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabList: {
    flexDirection: 'row',
    flex: 1,
    borderBottomColor: '#484848',
    borderBottomWidth: 1,
  },
  tabList1: {
    borderRadius: 10,
    backgroundColor: 'transparent',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 0
  },
  tabContent: {
    flex: 1,
    overflow: 'hidden',
  },
  defaultTabHeader: {
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 24
  },
  wrapView: {
    width: ScreenWidth,
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    right: 0,
  }
});

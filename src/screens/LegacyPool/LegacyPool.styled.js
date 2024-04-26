import { StyleSheet } from 'react-native';

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginVertical: 12,
  },


  groupRadio: {
    display: 'flex',
    flexDirection: 'column',
  },

  rowRadio: {
    display: 'flex',
    flexDirection: 'row',
    alignItems:'center',
  },

  radioStyle: {
  }
});

export default styles;

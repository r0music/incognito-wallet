import React from 'react';
import { View, StyleSheet } from 'react-native';
import isEmpty from 'lodash/isEmpty';
import { useTabFactories } from './Swap.simpleTab';
import { Hook } from '../../Extra';

const styled = StyleSheet.create({
  container: {
    marginTop: 24,
  },
});

const SwapDetailsInfor = () => {
  console.log('SwapDetailsInfor RENDER');
  const { hooksFactories } = useTabFactories();
  return (
    <View style={styled.container}>
      {hooksFactories
        .filter((hook) => !isEmpty(hook))
        .map((hook) => (
          <Hook {...hook} key={hook.label} />
        ))}
    </View>
  );
};

SwapDetailsInfor.propTypes = {};

export default React.memo(SwapDetailsInfor);

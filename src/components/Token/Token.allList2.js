import { View, Text } from '@src/components/core';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import BigList from 'react-native-big-list';

const ListAllToken2 = (props) => {
  const { tokensFactories, renderItem } = props;

  const data = [tokensFactories[0].data, tokensFactories[1].data];

  const memoizedValue = useMemo(() => renderItem, [data]);

  return (
    <View defaultPadding={false} style={{ flex: 1 }}>
      <BigList sections={data} renderItem={memoizedValue} itemHeight={75} />
    </View>
  );
};

ListAllToken2.defaultProps = {
  styledContainer: null,
  styledCheckBox: null,
};

ListAllToken2.propTypes = {
  tokensFactories: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  styledContainer: PropTypes.any,
  styledCheckBox: PropTypes.any,
};

export default React.memo(ListAllToken2);

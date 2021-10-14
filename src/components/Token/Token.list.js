import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from '@src/components/core/FlatList';

const ListToken = (props) => {
  const { data, visible, styledListToken, renderItem } = props;
  if (!visible || data.length === 0) {
    return null;
  }
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      style={[{ flex: 1 }, styledListToken]}
      data={data}
      renderItem={renderItem}
      keyExtractor={(token) => token?.tokenId}
    />
  );
};

ListToken.defaultProps = {
  styledListToken: null,
};

ListToken.propTypes = {
  data: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  styledListToken: PropTypes.any,
  renderItem: PropTypes.any.isRequired,
};

export default ListToken;

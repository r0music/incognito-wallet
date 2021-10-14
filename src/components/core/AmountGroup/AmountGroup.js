import React, {memo} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import styled from './AmountGroup.styled';

const AmountGroup = ({ title, amountStr, subAmountStr, loading }) => {
  return (
    <View style={styled.wrapper}>
      <Text style={styled.title}>{title}</Text>
      {loading ?
        (
          <View style={styled.loading}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <Text style={styled.baseAmount}>{amountStr}</Text>
            <Text style={styled.compareAmount}>{subAmountStr}</Text>
          </>
        )}
    </View>
  );
};

AmountGroup.defaultProps = {
  title: 'Total rewards'
};

AmountGroup.propTypes = {
  title: PropTypes.string,
  amountStr: PropTypes.string.isRequired,
  subAmountStr: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default memo(AmountGroup);

import React from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Hook } from '../Extra';
import { detailsSelector } from './Chart.selector';

const styled = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
});

const Details = (props) => {
  const { factories } = useSelector(detailsSelector);
  return (
    <View style={styled.container}>
      {factories.map(({ label, value, color }) => (
        <Hook
          key={label}
          label={label}
          value={value}
          customStyledValue={{ color }}
        />
      ))}
    </View>
  );
};

Details.propTypes = {};

export default React.memo(Details);

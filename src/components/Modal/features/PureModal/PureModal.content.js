import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { colorsSelector } from '@src/theme';
import { useSelector } from 'react-redux';
import { UTILS } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    marginHorizontal: 24,
    borderRadius: 13,
    width: UTILS.deviceWidth() - 50,
    paddingHorizontal: 24,
    paddingVertical: 24,
    position: 'relative',
  },
});

const PureModalContent = (props) => {
  const { children, styledContainer, styledWrapper } = props;
  const colors = useSelector(colorsSelector);
  return (
    <View style={[styled.container, styledContainer]}>
      <View
        style={[
          styled.wrapper,
          { backgroundColor: colors.grey7 },
          styledWrapper,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

PureModalContent.propTypes = {
  styledContainer: PropTypes.any,
  styledWrapper: PropTypes.any,
};

export default React.memo(PureModalContent);

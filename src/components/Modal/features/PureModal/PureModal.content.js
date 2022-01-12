import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { colorsSelector } from '@src/theme';
import { useSelector } from 'react-redux';
import { UTILS } from '@src/styles';
import withLazy from '@components/LazyHoc/LazyHoc';
import { compose } from 'recompose';

const styled = StyleSheet.create({
  container: {
    flex: 1,
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
  emptyView: {
    flex: 1,
    opacity: 0,
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
  bowel: PropTypes.any.isRequired,
  styledContainer: PropTypes.any,
  styledWrapper: PropTypes.any,
};

export default compose(
  (Comp) => (props) =>
    <Comp emptyView={<View style={styled.emptyView} />} {...props} />,
  withLazy,
)(React.memo(PureModalContent));

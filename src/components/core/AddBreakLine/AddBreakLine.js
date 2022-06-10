import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { CirclePlusIcon } from '@components/Icons';

export const styles = StyleSheet.create({
  arrowWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16
  },
  addIcon: {
    position: 'absolute'
  }
});

const Divider = styled.View`
  background-color: ${({ theme }) => theme.border1};
  width: 100%;
  height: 1px;
`;

const AddBreakLine = ({ style, visibleAdd }) => {
  return (
    <View style={[styles.arrowWrapper, style]}>
      <Divider style={styles.divider} />
      {visibleAdd && (
        <View style={styles.addIcon}>
          <CirclePlusIcon />
        </View>
      )}
    </View>
  );
};

AddBreakLine.defaultProps = {
  style: undefined,
  visibleAdd: false
};

AddBreakLine.propTypes = {
  style: PropTypes.any,
  visibleAdd: PropTypes.bool
};

export default memo(AddBreakLine);

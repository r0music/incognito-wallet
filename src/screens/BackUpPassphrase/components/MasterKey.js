import React from 'react';
import PropTypes from 'prop-types';
import { Row } from '@src/components';
import { Text, TouchableOpacity } from '@components/core';
import { StyleSheet } from 'react-native';
import { COLORS, THEME, FONT } from '@src/styles';
import { ExportIcon } from '@components/Icons';
import Swipeout from 'react-native-swipeout';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme/theme.selector';

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  flex: {
    flex: 1,
  },
  name: {
    fontSize: FONT.SIZE.regular,
    ...FONT.TEXT.desc,
    minHeight: 35,
    justifyContent: 'center',
    textAlignVertical: 'center',
    lineHeight: 35,
  },
  number: {
    marginRight: 15,
  },
  swipeOutButton: {
    paddingHorizontal: 25,
    borderRadius: 4,
    marginBottom: 16
  },
  active: {
    ...FONT.STYLE.bold,
  }
});

const MasterKey = ({ name, number, onPress, onDelete, isActive }) => {
  const colors = useSelector(colorsSelector);
  return (
    <Swipeout
      style={[styles.swipeOutButton, { backgroundColor: colors.background5 }]}
      right={
        onDelete
          ? [{
            text: 'Delete',
            backgroundColor: COLORS.red,
            onPress: () => onDelete(name),
          }]
          : []
      }
    >
      <TouchableOpacity onPress={onPress}>
        <Row style={[styles.container, { backgroundColor: colors.background5 }]} spaceBetween center>
          <Text
            style={[styles.name, isActive && styles.active, styles.flex]}
            numberOfLines={1}
          >
            {name}
          </Text>
          <Row center style={{backgroundColor: colors.background5}}>
            <Text style={[styles.name, styles.number]}>{number}</Text>
            <ExportIcon />
          </Row>
        </Row>
      </TouchableOpacity>
    </Swipeout>
  );
};

MasterKey.propTypes = {
  name: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  isActive: PropTypes.bool,
};

MasterKey.defaultProps = {
  onDelete: undefined,
  isActive: false,
};

export default MasterKey;


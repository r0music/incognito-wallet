import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memmoize from 'memoize-one';
import { View, Text, TouchableOpacity } from '@src/components/core';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@src/styles';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import styles from './styles';

class StakeValidatorTypeSelector extends Component {
  constructor(props) {
    super(props);
  }

  isValidId = memmoize((id, types) => {
    if (types?.map(t => t?.id).includes(id)) {
      return true;
    }

    return false;
  });

  handleSelect = type => {
    const { onChange, stakeData } = this.props;

    if (this.isValidId(type?.id, stakeData) && typeof onChange === 'function') {
      onChange(type);
    }
  }

  renderItem = (type, isSelected) => {
    const onPress = () => this.handleSelect(type);

    return (
      <TouchableOpacity
        key={type?.id}
        onPress={onPress}
        style={[
          styles.itemContainer,
        ]}
      >
        <View style={styles.group}>
          <Icons 
            size={25}
            name={isSelected ? 'checkbox-marked-circle' : 'circle-outline'}
            color={isSelected ? COLORS.primary : COLORS.lightGrey1}
            style={styles.icon}
          />
          <Text
            style={[
              styles.text,
              isSelected && styles.activeText,
            ]}
          >
            {type?.name}
          </Text>
        </View>
        <Text
          style={[
            styles.text,
            isSelected && styles.activeText,
          ]}
        >
          {formatUtil.amount(type?.amount, CONSTANT_COMMONS.DECIMALS[CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV])} {CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { stakeTypeId, style, stakeData } = this.props;

    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>What kind of validator?</Text>
        {
          stakeData?.map(type => this.renderItem(type, stakeTypeId === type.id))
        }
      </View>
    );
  }
}

StakeValidatorTypeSelector.defaultProps = {
  stakeTypeId: null,
  onChange: null,
  style: null,
};

StakeValidatorTypeSelector.propTypes = {
  stakeTypeId: PropTypes.number,
  onChange: PropTypes.func,
  style: PropTypes.object,
  stakeData: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default StakeValidatorTypeSelector;

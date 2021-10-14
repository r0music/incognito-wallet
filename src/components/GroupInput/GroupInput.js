import React, {memo} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {Divider} from 'react-native-elements';
import {Image} from '@components/core';
import addIcon from '@assets/images/icons/add_liquidity.png';
import InputAmount from '@components/InputAmount';
import {styled} from '@components/GroupInput/GroupInput.styled';

const GroupInput = () => {
  return (
    <View>
      <InputAmount
        placeholder="0"
        disableChooseToken
      />
      <View style={styled.arrowWrapper}>
        <Divider style={styled.divider} />
        <Image source={addIcon} style={styled.arrow} />
        <Divider style={styled.divider} />
      </View>
      <InputAmount
        placeholder="0"
        disableChooseToken
      />
    </View>
  );
};

GroupInput.propTypes = {};


export default memo(GroupInput);

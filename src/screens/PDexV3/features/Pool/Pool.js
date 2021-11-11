import { Row } from '@src/components';
import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionToggleFollowingPool,
  getDataByPoolIdSelector,
} from '@screens/PDexV3/features/Pools';
import PropTypes from 'prop-types';
import { TouchableOpacity } from '@src/components/core';
import { BtnStar } from '@src/components/Button';
import { styled } from './Pool.styled';

export const PoolItem = React.memo((props) => {
  const { poolId, onPressPool, style } = props;
  const data = useSelector(getDataByPoolIdSelector)(poolId);
  if (!data) {
    return null;
  }
  const {
    volumeSuffixStr,
    isFollowed,
    poolTitle,
    apyStr,
  } = data || {};

  const dispatch = useDispatch();
  const handleToggleFollowingPool = () =>
    dispatch(actionToggleFollowingPool(poolId));
  return (
    <TouchableOpacity
      onPress={() => typeof onPressPool === 'function' && onPressPool(poolId)}
      style={[styled.container, style]}
    >
      <Row>
        <View style={styled.block1}>
          <Row style={styled.rowName}>
            <Text style={styled.name}>{poolTitle}</Text>
          </Row>
          <Text style={styled.subText}>{`Vol: ${volumeSuffixStr}`}</Text>
        </View>
        <View style={styled.block2}>
          <Text style={styled.subText}>{apyStr}</Text>
        </View>
        <View style={styled.block3}>
          <BtnStar onPress={handleToggleFollowingPool} isBlue={isFollowed} />
        </View>
      </Row>
    </TouchableOpacity>
  );
});

const Pool = (props) => {
  const { poolId, onPressPool } = props;
  if (!poolId) {
    return null;
  }
  return <PoolItem poolId={poolId} onPressPool={onPressPool} />;
};

Pool.defaultProps = {
  onPressPool: null,
};

Pool.propTypes = {
  poolId: PropTypes.string.isRequired,
  onPressPool: PropTypes.func,
};

PoolItem.defaultProps = {
  onPressPool: null,
  style: null,
};

PoolItem.propTypes = {
  poolId: PropTypes.string.isRequired,
  onPressPool: PropTypes.func,
  style: PropTypes.object,
};

export default React.memo(Pool);

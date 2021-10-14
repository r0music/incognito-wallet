import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {Row} from '@src/components';
import {ArrowDown} from '@components/Icons';
import {itemStyle as styled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {Icon} from '@components/Token/Token.shared';

export const HeaderRow = React.memo(({ array, style }) => (
  <Row spaceBetween style={style}>
    {array.map(text => (
      <Text style={styled.headerTitle} key={text}>{text}</Text>
    ))}
  </Row>
));

export const PoolItem = React.memo(({ item, onPress }) => {
  const { token } = item;
  return (
    <TouchableOpacity style={styled.wrapper} onPress={() => typeof onPress === 'function' && onPress(token.tokenId)}>
      <Row>
        <View style={styled.wrapImage}>
          <Icon iconUrl={token.iconUrl} style={styled.image} />
        </View>
        <View>
          <Text style={styled.title}>{token.symbol}</Text>
          <Text style={styled.subTitle}>{token.name || token.symbol}</Text>
        </View>
      </Row>
      <Text style={styled.title}>{item.apyStr}</Text>
    </TouchableOpacity>
  );
});

export const PortfolioItem = React.memo(({ item, onPressItem, onPressArrow }) => {
  const handlePressItem = () => typeof onPressItem === 'function' && onPressItem();
  const handlePressArrow = () => typeof onPressArrow === 'function' &&  onPressArrow(item.reward.rewardsMerged);
  if (!item) return;
  const { token, reward, staking } = item;
  return (
    <TouchableOpacity style={styled.wrapper} onPress={handlePressItem}>
      <Row>
        <View style={styled.wrapImage}>
          <Icon iconUrl={token.iconUrl} style={styled.image} />
        </View>
        <View>
          <Text style={styled.title}>{token.symbol}</Text>
          <Text style={styled.subTitle}>{token.name || token.symbol}</Text>
        </View>
      </Row>
      <View>
        <Text style={[styled.title, styled.rightText]}>{staking.stakingAmountStr}</Text>
        <TouchableOpacity style={styled.arrowRow} onPress={() => !!reward.totalRewardUSD && handlePressArrow()}>
          <Text style={[
            styled.subTitle,
            styled.rightText,
            reward.totalRewardUSD && styled.greenText
          ]}
          >{`+ ${reward.totalRewardUSDStr}`}
          </Text>
          {!!reward.totalRewardUSD && (<ArrowDown style={styled.arrow} />)}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

export const OneRowCoin = React.memo(({ token, valueText, onPress, data, disabled }) => {
  return React.useMemo(() => {
    const COMP = typeof onPress === 'function' ? TouchableOpacity : View;
    return (
      <COMP
        style={[styled.wrapper, {marginTop: 0, marginBottom: 24}, disabled && {opacity: 0.5}]}
        onPress={() => typeof onPress === 'function' && !disabled && onPress(data)}
      >
        <Row>
          <View style={styled.wrapImage}>
            <Icon iconUrl={token.iconUrl} style={styled.image} />
          </View>
          <View>
            <Text style={styled.title}>{token.symbol}</Text>
          </View>
        </Row>
        <Text style={styled.title}>{valueText}</Text>
      </COMP>
    );
  }, [token.amount, valueText, onPress]);
});

PoolItem.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

PortfolioItem.propTypes = {
  item: PropTypes.object.isRequired,
  onPressItem: PropTypes.func.isRequired,
  onPressArrow: PropTypes.func.isRequired,
};

OneRowCoin.defaultProps = {
  data: null,
  disabled: false,
  onPress: null,
};

OneRowCoin.propTypes = {
  token: PropTypes.object.isRequired,
  valueText: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  data: PropTypes.any,
  disabled: PropTypes.bool,
};

HeaderRow.defaultProps = {
  style: null,
};

HeaderRow.propTypes = {
  array: PropTypes.array.isRequired,
  style: PropTypes.any
};

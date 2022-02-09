import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Divider,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from '@src/components/core';
import { useSelector } from 'react-redux';
import { Row } from '@src/components';
import { FONT } from '@src/styles';
import formatUtil from '@src/utils/format';
import { swapHistorySelector } from './Swap.selector';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
  },
  flatlist: {
    flex: 1,
    paddingBottom: 24,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  itemTitle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    marginRight: 15,
    flex: 1,
  },
  itemDesc: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
  },
  itemWrapper: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const RewardHistoryItem = React.memo(({ data }) => {
  const {
    createdAt,
    fromTime,
    rewardAmount,
    sumTotalVolume,
    totalVolume,
    toTime,
  } = data;
  return (
    <TouchableOpacity style={styled.itemContainer}>
      <View style={styled.itemWrapper}>
        <Row style={{ ...styled.row, marginBottom: 4 }}>
          <Text style={[styled.itemTitle]}>Create At:</Text>
          <Text style={[styled.itemDesc]}>
            {formatUtil.formatDateTime(createdAt)}
          </Text>
        </Row>
        <Row style={{ ...styled.row, marginBottom: 4 }}>
          <Text style={[styled.swap]}>Sum Total Volume</Text>
          <Text style={[styled.itemDesc]}>{sumTotalVolume?.toFixed(4)}</Text>
        </Row>
        <Row style={{ ...styled.row, marginBottom: 4 }}>
          <Text style={[styled.swap]}>Total Volume</Text>
          <Text style={[styled.itemDesc]}>{totalVolume?.toFixed(4)}</Text>
        </Row>
        <Row style={{ ...styled.row, marginBottom: 4 }}>
          <Text style={[styled.swap]}>Reward Amount</Text>
          <Text style={[styled.itemDesc]}>
            {(rewardAmount / 1e9).toFixed(4)}
          </Text>
        </Row>
        <Row style={{ ...styled.row, marginBottom: 4 }}>
          <Text style={[styled.swap]}>From Time</Text>
          <Text style={[styled.itemDesc]}>
            {formatUtil.formatDateTime(fromTime)}
          </Text>
        </Row>
        <Row style={{ ...styled.row, marginBottom: 4 }}>
          <Text style={[styled.swap]}>To Time</Text>
          <Text style={[styled.itemDesc]}>
            {' '}
            {formatUtil.formatDateTime(toTime)}
          </Text>
        </Row>
      </View>
    </TouchableOpacity>
  );
});

const RewardHistory = () => {
  const { isFetching} = useSelector(swapHistorySelector);
  const rewardHistories = useSelector(
    (state) => state.pDexV3.swap.pancakeRewardHistories,
  );
  return (
    <View style={styled.container}>
      <FlatList
        refreshControl={<RefreshControl refreshing={isFetching} />}
        data={rewardHistories}
        keyExtractor={(item, index) => index?.toString()}
        renderItem={({ item, index }) => (
          <>
            <RewardHistoryItem
              data={item}
              visibleDivider={index !== rewardHistories.length - 1}
            />
            {index !== rewardHistories.length - 1 && <Divider />}
          </>
        )}
        contentContainerStyle={styled.flatlist}
      />
    </View>
  );
};

RewardHistory.propTypes = {};

export default React.memo(RewardHistory);

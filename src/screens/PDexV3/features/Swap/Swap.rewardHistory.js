import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Divider,
  Text,
  TouchableOpacity,
  View,
} from '@src/components/core';
// import { useSelector } from 'react-redux';
import { Row } from '@src/components';
import { FONT, COLORS } from '@src/styles';
import formatUtil from '@src/utils/format';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { PRV } from '@src/constants/common';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import PropTypes from 'prop-types';
// import { swapHistorySelector } from './Swap.selector';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  itemDesc: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
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
  const { createdAt, rewardAmount, tx } = data;

  const navigation = useNavigation();

  const navigateToRewardHistoryDetailScreen = () => {
    navigation.navigate(routeNames.SwapRewardHistoryDetail, {
      rewardHistoryDetail: data,
    });
  };
  return (
    <TouchableOpacity
      onPress={navigateToRewardHistoryDetailScreen}
      style={styled.itemContainer}
    >
      <View style={styled.itemWrapper}>
        <Row style={{ ...styled.row }}>
          <View style={{ flex: 1, marginRight: 48 }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[
                styled.itemDesc,
                { color: COLORS.lightGrey36, marginBottom: 4 },
              ]}
            >
              #{tx}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[styled.itemDesc, {}]}
            >
              {formatUtil.formatDateTime(createdAt)}
            </Text>
          </View>
          <View>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[styled.itemDesc]}
            >
              {formatUtil.amountVer2(rewardAmount, PRV.pDecimals)} PRV
            </Text>
          </View>
        </Row>
      </View>
    </TouchableOpacity>
  );
});

const RewardHistory = ({ page }) => {
  // const { isFetching } = useDebounceSelector(swapHistorySelector)();
  const rewardHistories = useDebounceSelector(
    (state) => state.pDexV3.swap.rewardHistories,
  );

  const historyDisplay = React.useMemo(() => {
    if (!page) return [];
    return rewardHistories.slice(0, page);
  }, [page, rewardHistories]);

  const renderItem = React.useCallback((item, index) => (
    <>
      <RewardHistoryItem
        data={item}
        key={`reward-${index}`}
        visibleDivider={index !== historyDisplay.length - 1}
      />
      {index !== historyDisplay.length - 1 && <Divider />}
    </>
  ), []);

  return (
    <View style={styled.container}>
      {(historyDisplay || []).map(renderItem)}
    </View>
  );
};

RewardHistory.propTypes = {
  page: PropTypes.number.isRequired,
};

export default React.memo(RewardHistory);

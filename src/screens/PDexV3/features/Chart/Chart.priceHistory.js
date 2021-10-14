import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VictoryLine } from 'victory-native';
import { COLORS, FONT } from '@src/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from '@src/components';
import { ButtonBasic } from '@src/components/Button';
import { screenSize } from '@src/styles/TextStyle';
import { ActivityIndicator } from '@src/components/core';
import { priceHistorySelector } from './Chart.selector';
import { actionChangePeriod, actionFetchPriceHistory } from './Chart.actions';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 24,
  },
  chart: {
    height: 200,
    width: '100%',
  },
  btnStyle: {
    minWidth: 40,
    height: 24,
    backgroundColor: COLORS.lightGrey19,
  },
  titleStyle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    color: COLORS.black,
  },
});

const periods = ['15m', '1h', '4h', '1d', 'W', 'M'];

const Period = React.memo(() => {
  const dispatch = useDispatch();
  const { period: actived } = useSelector(priceHistorySelector);
  return (
    <Row
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
      }}
    >
      {periods?.map((period) => (
        <ButtonBasic
          btnStyle={styled.btnStyle}
          titleStyle={{
            ...styled.titleStyle,
            ...(period === actived ? { color: COLORS.colorTradeBlue } : {}),
          }}
          title={period}
          key={period}
          onPress={async () => {
            if (actived === period) {
              return;
            }
            await dispatch(actionChangePeriod(period));
            dispatch(actionFetchPriceHistory());
          }}
        />
      ))}
    </Row>
  );
});

const PriceHistory = () => {
  const { history, fetching } = useSelector(priceHistorySelector);
  return (
    <View style={styled.container}>
      {fetching && <ActivityIndicator />}
      {history.length > 0 ? (
        <VictoryLine
          padding={0}
          width={screenSize.width - 50}
          height={200}
          style={{
            data: {
              stroke: COLORS.colorTradeBlue,
              strokeWidth: 3,
            },
          }}
          data={history}
        />
      ) : (
        <View style={styled.chart} />
      )}
      <Period />
    </View>
  );
};

PriceHistory.propTypes = {};

export default React.memo(PriceHistory);

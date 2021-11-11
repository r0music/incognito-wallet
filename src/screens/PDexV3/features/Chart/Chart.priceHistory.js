import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';
import { COLORS, FONT } from '@src/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from '@src/components';
import { ButtonBasic } from '@src/components/Button';
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

const periods = ['15m', '1h', '4h', '1d', 'W', 'M', 'Y'];

export const Period = React.memo(() => {
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
  const { history, fetching, period } = useSelector(priceHistorySelector);
  const dispatch = useDispatch();
  const handleFetchData = React.useCallback(
    () => dispatch(actionFetchPriceHistory()),
    [],
  );
  React.useEffect(() => {
    handleFetchData();
  }, []);
  return (
    <View style={styled.container}>
      {fetching && <ActivityIndicator />}
      {history.length > 0 ? (
        <VictoryChart
          scale={{
            x: 'time',
            y: 'linear',
          }}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) => {
                const { _xFormat = '', yFormat = '' } = datum;
                return `Price: ${yFormat}\nTime: ${_xFormat}`;
              }}
            />
          }
          padding={{ top: 60, bottom: 30, left: 0, right: 0 }}
        >
          <VictoryLine
            labelComponent={<VictoryTooltip />}
            height={200}
            style={{
              data: {
                stroke: COLORS.colorTradeBlue,
                strokeWidth: 3,
              },
            }}
            data={history}
          />
          <VictoryAxis
            tickValues={history.map((h) => h.x)}
            tickFormat={(x, index) => {
              const t = history[index];
              const { xVisible, xFormat } = t;
              return xVisible ? xFormat : '';
            }}
          />
        </VictoryChart>
      ) : (
        <View style={styled.chart} />
      )}
      <Period />
    </View>
  );
};

PriceHistory.propTypes = {};

export default React.memo(PriceHistory);

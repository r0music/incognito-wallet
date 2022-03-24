import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { WebView } from 'react-native-webview';
import { ButtonBasic } from '@src/components/Button';
import { Row } from '@src/components';
import { FONT } from '@src/styles';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { ExHandler } from '@src/services/exception';
import convert from '@src/utils/convert';
import { actionGetPDexV3Inst } from '@screens/PDexV3';
import { ScreenWidth } from '@src/utils/devices';
import Server from '@src/services/wallet/Server';
import { ActivityIndicator } from '@src/components/core';
import format from '@src/utils/format';
import minBy from 'lodash/minBy';
import { colorsSelector } from '@src/theme';
import BigNumber from 'bignumber.js';
import floor from 'lodash/floor';
import { rateDataSelector } from '@screens/PDexV3/features/OrderLimit';
import { poolSelectedSelector } from './Chart.selector';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 250,
  },
  btnStyle: {
    height: 24,
    flex: 1,
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  titleStyle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    textTransform: 'uppercase',
  },
});

const periods = [
  { label: '1D', period: '15m' },
  { label: '1W', period: '1h' },
  { label: '1M', period: '4h' },
  { label: '2M', period: '1d' },
  { label: '1Y', period: 'W' },
  // 'M',
  // 'Y'
];

export const Period = React.memo(({ handleFetchData }) => {
  const colors = useSelector(colorsSelector);
  const [actived, setActived] = React.useState(periods[0].period);
  return (
    <Row
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
      }}
    >
      {periods?.map(({ label, period }, index, arr) => (
        <ButtonBasic
          btnStyle={{
            ...styled.btnStyle,
            ...(index === arr.length - 1 ? { marginRight: 0 } : {}),
          }}
          titleStyle={{
            ...styled.titleStyle,
            ...(period === actived
              ? { color: colors.mainText }
              : { color: colors.subText }),
          }}
          title={label}
          key={period}
          onPress={async () => {
            if (actived === period) {
              return;
            }
            setActived(period);
            handleFetchData(period);
          }}
        />
      ))}
    </Row>
  );
});

const PriceHistoryCandles = () => {
  const { rateStr } = useSelector(rateDataSelector);
  const [initted, setInitted] = React.useState(false);
  const [uri, setURI] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef({});
  const pool = useSelector(poolSelectedSelector);
  const dispatch = useDispatch();
  const token2: SelectedPrivacy = pool?.token2;
  const colors = useSelector(colorsSelector);
  const handlePostMessage = (message) => {
    if (ref?.current) {
      ref.current.postMessage(message);
    }
  };
  const UTCToLocalTimeStamp = (timeStamp) => {
    const d = new Date(timeStamp * 1000);
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) / 1000;
  };
  const handleFetchData = async (actived) => {
    try {
      const pdexV3Inst = await dispatch(actionGetPDexV3Inst());
      let intervals = '';
      let period = '';
      switch (actived) {
      case '15m':
        period = 'PT15M';
        intervals = 'P1D';
        break;
      case '1h':
        period = 'PT1H';
        intervals = 'P7D';
        break;
      case '4h':
        period = 'PT4H';
        intervals = 'P30D';
        break;
      case '1d':
        period = 'P1D';
        intervals = 'P60D';
        break;
      case 'W':
        period = 'P1W';
        intervals = 'P1Y';
        break;
      default:
        break;
      }
      const { poolId: poolid } = pool;
      const { pDecimals }: SelectedPrivacy = pool?.token2;
      const res =
        (await pdexV3Inst.getPriceHistory({
          poolid,
          period,
          intervals,
        })) || [];
      const chartData = res.map((c) => {
        const { close, timestamp } = c;
        const value = convert.toHumanAmountVer2(close, pDecimals);
        const result = {
          ...c,
          time: UTCToLocalTimeStamp(timestamp),
          value,
        };
        return result;
      });
      const timeNow = new Date().getTime() / 1000;
      const rateNow = convert.toNumber(rateStr, true);
      const chartDataNow = {
        'close': rateNow,
        'high': rateNow,
        'low': rateNow,
        'open': rateNow,
        'time': UTCToLocalTimeStamp(timeNow),
        'timestamp': UTCToLocalTimeStamp(timeNow),
        'value': rateNow
      };
      chartData.push(chartDataNow);
      if (chartData.length > 0) {
        let width = Number(ScreenWidth);
        const minLow = minBy(chartData, (c) => c?.low)?.low || 0;
        const precision =
          format.getDecimalsFromHumanAmount(minLow) || token2?.pDecimals;
        const minMove = 1 / Math.pow(10, precision);
        handlePostMessage(
          `configsChart|${JSON.stringify({
            chartConfigs: {
              lwChartConfigs: {
                width,
                height: 250,
              },
              lwChartOptions: {
                timeScale: {
                  timeVisible: true,
                  visible: true,
                  borderColor: colors.grey8,
                  secondsVisible: false,
                },
                rightPriceScale: {
                  timeVisible: true,
                  visible: true,
                  borderColor: colors.grey8,
                },
                layout: {
                  backgroundColor: colors.grey9,
                  textColor: colors.against,
                },
                grid: {
                  vertLines: {
                    color: colors.grey8,
                    visible: true,
                  },
                  horzLines: {
                    color: colors.grey8,
                    visible: true,
                  },
                },
              },
              areaStickConfigs: {
                topColor: colors.ctaMain,
                bottomColor: colors.ctaMain01,
                lineColor: colors.ctaMain,
                lineWidth: 2,
              },
              areaStickOptions: {
                topColor: colors.ctaMain,
                bottomColor: colors.ctaMain01,
                lineColor: colors.ctaMain,
                lineWidth: 2,
                priceFormat: {
                  precision,
                  minMove,
                },
              },
              type: 'area',
            },
            candles: chartData,
          })}`,
        );
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const handleOnMessage = async (e) => {
    const data = e.nativeEvent.data;
    const parseData = JSON.parse(data);
    if (parseData?.initted) {
      await setInitted(true);
      handleFetchData(periods[0].period);
    }
  };
  const handleInit = async () => {
    try {
      const server = await Server.getDefault();
      setURI(server?.webviewChartServices);
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  React.useEffect(() => {
    handleInit();
  }, [rateStr]);
  return (
    <View style={[styled.container]}>
      {!initted && <ActivityIndicator />}
      <WebView
        ref={ref}
        style={{
          width: '100%',
          height: 250,
          backgroundColor: colors.grey9,
          opacity: visible ? 1 : 0,
        }}
        source={{ uri }}
        onMessage={handleOnMessage}
        onLoad={() => setVisible(true)}
        originWhitelist={['*']}
        incognito
      />
      <Period {...{ handleFetchData }} />
    </View>
  );
};

PriceHistoryCandles.propTypes = {};

export default React.memo(PriceHistoryCandles);

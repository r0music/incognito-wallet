import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Header, Row } from '@src/components';
import withHistories from '@screens/Dex/features/Histories/enhance';
import { useSelector } from 'react-redux';
import {getHistoryById, historyTabNameSelector, titleWithHistoryTab} from '@screens/Dex/Liquidity.selector';
import { styled } from '@screens/Dex/features/Histories/styled';
import { uniqBy, isEmpty, uniq } from 'lodash';
import {HEADER_TABS, LIQUIDITY_STATUS} from '@screens/Dex/Liquidity.constants';
import { selectedPrivacySelector } from '@src/redux/selectors';
import formatUtil from '@utils/format';
import Tabs from '@screens/Dex/components/Tabs';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import styleSheet from '@components/HistoryList/style';
import LoadingContainer from '@components/LoadingContainer';
import { LIMIT } from '@screens/DexV2/constants';
import { Text, View , Text3 } from '@components/core';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';
import globalStyled from '@src/theme/theme.styled';
import { BtnCircleBack } from '@components/Button';
import SelectAccountButton from '@components/SelectAccountButton';
import debounce from 'lodash/debounce';


const Description = React.memo(({ data }) => {
  if (isEmpty(data)) return null;
  const tokenIds = uniq(data.map(item => item.tokenId));
  const getPrivacyDataByTokenID = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID);
  const contributes = tokenIds.map((tokenId) => {
    const token = getPrivacyDataByTokenID(tokenId);
    const contribute = data.find(({ tokenId: contributeTokenId }) => tokenId === contributeTokenId);
    return {
      ...token,
      ...contribute
    };
  });
  const desc = React.useMemo(() => {
    if (isEmpty(contributes)) return null;
    let message = '';
    const contribute1 = contributes[0];
    message = `${formatUtil.amountFull(contribute1?.amount, contribute1.pDecimals)} ${contribute1.symbol}`;
    if (contributes.length === 2) {
      const contribute2 = contributes[1];
      message += ` + ${formatUtil.amountFull(contribute2?.amount, contribute2.pDecimals)} ${contribute2.symbol}`;
    }
    return message;
  }, [contributes]);
  return (
    <View>
      <Text3 style={styled.desc}>{desc}</Text3>
    </View>
  );
});

const DescriptionNormal = React.memo(({ history }) => {
  if (isEmpty(history)) return null;
  const { tokenId1, tokenId2, amount1, amount2, amount } = history;
  let token1, token2;
  const getPrivacyDataByTokenID = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID);
  if (tokenId1) { token1 = getPrivacyDataByTokenID(tokenId1); }
  if (tokenId2) { token2 = getPrivacyDataByTokenID(tokenId2); }

  const desc = React.useMemo(() => {
    if (!token1 && !token2) return '';
    let message = '';
    message = `${formatUtil.amountFull(amount1 || amount, token1.pDecimals)} ${token1.symbol}`;
    if (token2 && amount2) {
      message += ` + ${formatUtil.amountFull(amount2, token2.pDecimals)} ${token2.symbol}`;
    }
    return message;
  }, [token1, token2]);

  return (
    <View>
      <Text3 style={styled.desc}>{desc}</Text3>
    </View>
  );
});

const Item = React.memo(({ id }) => {
  const history = useSelector(getHistoryById)(id);
  const tabTitle = useSelector(titleWithHistoryTab);
  const historyTabName = useSelector(historyTabNameSelector);
  const navigation = useNavigation();
  const { statusText, contributes } = history;
  const uniqContribute = React.useMemo(() => {
    if (historyTabName !== HEADER_TABS.Add) return '';
    return uniqBy(contributes.filter(item => item.status !==LIQUIDITY_STATUS.REFUND), item => item.requestTx);
  }, [contributes, historyTabName]);

  const onNextPress = () => {
    if (historyTabName === HEADER_TABS.Add) {
      return navigation.navigate(routeNames.HistoryContributeDetail, { id });
    }
    navigation.navigate(routeNames.HistoryWithdrawDetail, { id });
  };
  return (
    <TouchableOpacity style={styled.wrapper} onPress={onNextPress}>
      <View style={styled.row}>
        <Text style={styled.title}>{tabTitle?.title}</Text>
        <Text style={styled.status}>{statusText}</Text>
      </View>
      <View style={[styled.row, { marginTop: 10 }]}>
        {historyTabName === HEADER_TABS.Add ?
          (<Description data={uniqContribute} />) :
          (<DescriptionNormal history={history} />)
        }
      </View>
    </TouchableOpacity>
  );
});

const Histories = React.memo(({ histories, historyTabName, onRefresh, onLoadMore, refreshing, isLoadMore }) => {
  const detectRef = React.useRef(null);
  const { goBack } = useNavigation();
  const handleGoBack = () => goBack();
  const _handleGoBack = debounce(handleGoBack, 100);
  const renderItem = (data) => {
    const id = data?.item?.pairId || data?.item?.id;
    return (<Item id={id} index={data?.index} />);
  };

  return (
    <>
      <Row style={[globalStyled.defaultPaddingHorizontal, { paddingTop: 10, paddingBottom: 15 }]} centerVertical spaceBetween>
        <Row centerVertical>
          <BtnCircleBack onPress={_handleGoBack} />
          <Tabs disable={false} selected={historyTabName} isHistory />
        </Row>
        <SelectAccountButton />
      </Row>
      <View paddingHorizontal fullFlex borderTop>
        <FlatList
          data={histories}
          renderItem={renderItem}
          keyExtractor={({ pairId, id }) => `item-key-${pairId || id}`}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          onRefresh={() => {
            if (typeof onRefresh === 'function') {
              onRefresh();
            }
          }}
          onEndReachedThreshold={0.7}
          onEndReached={() => detectRef.current = true}
          onMomentumScrollEnd={() => {
            if ((histories || []).length >= LIMIT && detectRef.current && typeof onLoadMore === 'function') {
              detectRef.current && onLoadMore();
              detectRef.current = false;
            }
          }}
          ListFooterComponent={
            isLoadMore ? (
              <View style={styleSheet.loadingContainer}>
                <LoadingContainer />
              </View>
            ) : null
          }
        />
      </View>
    </>
  );
});

Histories.propTypes = {
  histories: PropTypes.array.isRequired,
  historyTabName: PropTypes.string.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  isLoadMore: PropTypes.bool.isRequired
};

Description.propTypes = {
  data: PropTypes.array.isRequired
};

Item.propTypes = {
  id: PropTypes.string.isRequired,
};

DescriptionNormal.propTypes = {
  history: PropTypes.object.isRequired,
};

export default compose(withHistories, withLayout_2)(Histories);

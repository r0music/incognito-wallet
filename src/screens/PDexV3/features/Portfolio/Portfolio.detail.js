import React, { memo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { COLORS, FONT } from '@src/styles';
import { batch, useDispatch, useSelector } from 'react-redux';
import { getDataByShareIdSelector } from '@screens/PDexV3/features/Portfolio/Portfolio.selector';
import { Hook } from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import { liquidityActions } from '@screens/PDexV3/features/Liquidity';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { Row } from '@src/components';
import { actionToggleModal } from '@components/Modal';
import { BtnPrimary, BtnSecondary } from '@components/core/Button';
import PropTypes from 'prop-types';
import { Text } from '@components/core';
import { colorsSelector } from '@src/theme';
import TwoTokenImage from '@screens/PDexV3/features/Portfolio/Portfolio.image';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 16
  },
  content: {
    flex: 1,
  },
  title: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 9,
    marginLeft: 6
  },
  btnText: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
  },
  btnSmall: {
    height: 24,
    width: 75,
    marginLeft: 5,
    borderRadius: 14,
    marginBottom: 0
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  warning: {
    color: COLORS.orange,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 9,
    fontFamily: FONT.NAME.medium,
  },
  leftText: {
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 7,
    fontFamily: FONT.NAME.medium,
  },
  rightText: {
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 7,
    fontFamily: FONT.NAME.medium,
  },
  wrapHook: {
    marginTop: 8,
  },
});

const PortfolioModal = ({ shareId, onWithdrawFeeLP, showRemove = true }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colors = useDebounceSelector(colorsSelector);
  const data = useDebounceSelector(getDataByShareIdSelector)(shareId);
  const onClose = () => dispatch(actionToggleModal());
  const onWithdrawPress = () => {
    batch(() => {
      onClose();
      dispatch(
        liquidityActions.actionSetRemovePoolToken({
          inputToken: token1.tokenId,
          outputToken: token2.tokenId,
        }),
      );
      dispatch(liquidityActions.actionSetRemoveShareID(data.shareId));
      navigation.navigate(routeNames.NFTRemovePool);
    });
  };
  const onInvestPress = () => {
    batch(() => {
      onClose();
      dispatch(
        liquidityActions.actionSetContributeID({
          poolId: data.poolId,
          accessID: data.nftId || '',
        }),
      );
      navigation.navigate(routeNames.OTAContributePool);
    });
  };
  const onClaimReward = () => {
    onClose();
    setTimeout(() => {
      onWithdrawFeeLP({ poolId: data.poolId, shareId });
    }, 500);
  };
  if (!data) return null;
  const { withdrawable, withdrawing, validNFT, disableBtn, share, } = data;
  const { hookFactoriesDetail, token1, token2 } = data || {};
  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <Row style={styles.row} centerVertical>
          <Row centerVertical>
            <TwoTokenImage iconUrl1={token1.iconUrl} iconUrl2={token2.iconUrl} />
            <Text
              style={[styles.title, { marginLeft: 0 }]}
            >{`${token1.symbol} / ${token2.symbol}`}
            </Text>
          </Row>
          {showRemove && (
            <BtnPrimary
              title="Remove"
              textStyle={[styles.btnText, { color: colors.background10 }]}
              wrapperStyle={[styles.btnSmall, { backgroundColor: colors.background4 }]}
              onPress={onWithdrawPress}
              disabled={disableBtn || !share}
            />
          )}
        </Row>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {hookFactoriesDetail.map((hook) => (
            <Hook
              key={hook?.label}
              {...hook}
              labelStyle={[styles.leftText, { color: colors.text3 }]}
              valueTextStyle={[styles.rightText, { color: colors.text1 }]}
              style={styles.wrapHook}
            />
          ))}
        </ScrollView>
        {!validNFT && (
          <Text style={styles.warning}>
            You don&apos;t have any spare tickets to make this transaction. Wait
            for one to free up.
          </Text>
        )}
        <Row spaceBetween style={{ marginTop: 10 }}>
          {!!withdrawable && (
            <BtnSecondary
              title="Withdraw rewards"
              onPress={onClaimReward}
              wrapperStyle={[{ flex: 1 }, !!share && { marginRight: 8 }]}
              textStyle={{ color: COLORS.colorBlue }}
              disabled={withdrawing || disableBtn}
            />
          )}
          {!!share && (
            <BtnPrimary
              title="Contribute more"
              onPress={onInvestPress}
              wrapperStyle={{ flex: 1 }}
              background={COLORS.colorBlue}
              disabled={!validNFT}
            />
          )}
        </Row>
      </View>
    </View>
  );
};

PortfolioModal.propTypes = {
  shareId: PropTypes.string.isRequired,
  onWithdrawFeeLP: PropTypes.func.isRequired,
};

export default memo(PortfolioModal);

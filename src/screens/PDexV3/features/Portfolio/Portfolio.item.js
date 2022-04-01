import {Row, RowSpaceText} from '@src/components';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { batch, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { actionToggleModal } from '@components/Modal';
import ModalBottomSheet from '@components/Modal/features/ModalBottomSheet';
import PortfolioModal from '@screens/PDexV3/features/Portfolio/Portfolio.detail';
import styled from 'styled-components/native';
import TwoTokenImage from '@screens/PDexV3/features/Portfolio/Portfolio.image';
import { NormalText } from '@components/Token/Token';
import { isIOS } from '@utils/platform';
import { portfolioItemStyled as styles } from './Portfolio.styled';
import { getDataByShareIdSelector } from './Portfolio.selector';

export const Hook = React.memo(({ label, value }) => (
  <RowSpaceText
    label={label}
    value={value}
    style={{ marginBottom: isIOS() ? 1 : 7 }}
  />
));

const CustomTouchableOpacity = styled(TouchableOpacity)`
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.border4};
`;

export const Extra = React.memo(({ shareId }) => {
  const data = useSelector(getDataByShareIdSelector)(shareId);
  const { token1, token2, principalUSD } = data || {};
  return (
    <Row style={[styles.extraContainer]} centerVertical spaceBetween>
      <NormalText
        style={styles.extraLabel}
        text={`${token1?.symbol} / ${token2?.symbol}`}
      />
      <NormalText
        style={styles.extraLabel}
        text={`$${principalUSD}`}
      />
    </Row>
  );
});

const PortfolioItem = ({ shareId, isLast, onWithdrawFeeLP }) => {
  const dispatch = useDispatch();
  const data = useSelector(getDataByShareIdSelector)(shareId);
  if (!data) {
    return null;
  }
  const onPress = () => {
    batch(() => {
      dispatch(actionToggleModal({
        visible: true,
        shouldCloseModalWhenTapOverlay: true,
        data: (
          <ModalBottomSheet
            style={{ height: '60%' }}
            customContent={
              <PortfolioModal shareId={data.shareId} onWithdrawFeeLP={onWithdrawFeeLP} />
            }
          />
        )})
      );
    });
  };
  const { hookFactories, token1, token2 } = data || {};
  return (
    <CustomTouchableOpacity
      style={[styles.container, isLast && { borderBottomWidth: 0, marginBottom: 50 }]}
      onPress={onPress}
      key={shareId}
    >
      <TwoTokenImage iconUrl1={token1.iconUrl} iconUrl2={token2.iconUrl} />
      <Extra shareId={shareId} />
      {hookFactories.map((hook) => (
        <Hook {...hook} key={hook.label} />
      ))}
    </CustomTouchableOpacity>
  );
};

PortfolioItem.propTypes = {
  shareId: PropTypes.string.isRequired,
  isLast: PropTypes.bool.isRequired,
  onWithdrawFeeLP: PropTypes.func.isRequired,
};

Extra.propTypes = {
  shareId: PropTypes.string.isRequired
};

Hook.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default React.memo(PortfolioItem);

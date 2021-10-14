import React from 'react';
import { StyleSheet } from 'react-native';
import ClipboardService from '@src/services/clipboard';
import { COLORS, FONT } from '@src/styles';
import { Row } from '@src/components';
import { Text } from '@src/components/core';
import { BtnCopy, BtnOpenUrl } from '@src/components/Button';

export const styled = StyleSheet.create({
  label: {
    fontFamily: FONT.NAME.medium,
    color: COLORS.colorGrey3,
    fontSize: FONT.SIZE.small,
    width: 120,
  },
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  btn: {
    // marginLeft: 2,
  },
  value: {
    fontFamily: FONT.NAME.medium,
    color: COLORS.black,
    fontSize: FONT.SIZE.small,
    textAlign: 'left',
    flex: 1,
  },
  rowValue: {
    alignItems: 'flex-end',
    marginLeft: 15,
    flex: 1,
  },
});

const OrderDetail = ({
  label,
  value,
  copiable,
  openUrl,
  handleOpenUrl,
  customValue,
  hookStyled,
}) => {
  const handleCopy = () => ClipboardService.set(value);
  return (
    <Row style={{ ...styled.row, ...hookStyled }}>
      <Text style={styled.label} ellipsizeMode="middle" numberOfLines={1}>
        {`${label}: `}
      </Text>
      {customValue ? (
        customValue
      ) : (
        <Row style={styled.rowValue}>
          <Text style={styled.value} ellipsizeMode="middle" numberOfLines={1}>
            {value}
          </Text>
          {copiable && <BtnCopy onPress={handleCopy} style={styled.btn} />}
          {openUrl && <BtnOpenUrl onPress={handleOpenUrl} style={styled.btn} />}
        </Row>
      )}
    </Row>
  );
};

OrderDetail.propTypes = {};

export default React.memo(OrderDetail);

import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { TouchableOpacity } from '@src/components/core';
import { Row } from '@src/components';
import { FONT } from '@src/styles';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme';
import { Name, Symbol } from './Token';
import { Icon } from './Token.shared';
import withToken from './Token.enhance';

const styled = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  row: {
    alignItems: 'center',
  },
  row1: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
  },
  name: {
    ...FONT.TEXT.incognitoP2,
  },
  symbol: {
    marginBottom: 2,
    ...FONT.TEXT.incognitoH6,
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 14,
  },
});

const TokenTrade = (props) => {
  const { style, onPress, ...rest } = props;
  const colors = useSelector(colorsSelector);
  return (
    <TouchableOpacity
      style={[styled.container, { borderBottomColor: colors.grey8 }]}
      onPress={onPress}
    >
      <Row style={styled.row}>
        <Icon {...rest} style={styled.icon} />
        <Row style={styled.row1}>
          <Symbol
            {...rest}
            styledSymbol={styled.symbol}
            visibleNetworkName={false}
          />
          <Name
            {...rest}
            styledName={[styled.name, { color: colors.subText }]}
            shouldShowInfo={false}
            isVerified={false}
          />
        </Row>
      </Row>
    </TouchableOpacity>
  );
};

TokenTrade.defaultProps = {
  style: null,
  showBalance: false,
  rightTopExtra: null,
  shouldShowFollowed: false,
};
TokenTrade.propTypes = {
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any,
  showBalance: PropTypes.bool,
  rightTopExtra: PropTypes.element,
  shouldShowFollowed: PropTypes.bool,
};

export default withToken(React.memo(TokenTrade));

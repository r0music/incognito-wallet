import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { TouchableOpacity } from '@src/components/core';
import { Row } from '@src/components';
import { COLORS, FONT } from '@src/styles';
import { Name } from './Token';
import { Icon } from './Token.shared';
import withToken from './Token.enhance';

const styled = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  row: {
    alignItems: 'center',
  },
  name: {
    fontSize: FONT.SIZE.medium,
    fontFamily: FONT.NAME.medium,
    color: COLORS.black,
    marginLeft: 12,
  },
});

const TokenTrade = (props) => {
  const { style, ...rest } = props;
  return (
    <TouchableOpacity style={styled.container} {...rest}>
      <Row style={styled.row}>
        <Icon {...props} />
        <Name
          styledName={styled.name}
          shouldShowInfo={false}
          {...props}
          isVerified={false}
        />
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

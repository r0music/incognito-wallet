import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from '@src/components/core';
import { BtnChecked } from '@src/components/Button';
import { ListToken } from '@src/components/Token';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  hook: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
  },
  hookText: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    color: COLORS.black,
    marginLeft: 5,
  },
});

const ListAllToken = (props) => {
  const {
    tokensFactories,
    onToggleUnVerifiedTokens,
    toggleUnVerified,
    renderItem,
  } = props;
  return (
    <KeyboardAwareScrollView>
      <ListToken {...tokensFactories[0]} renderItem={renderItem} />
      <BtnChecked
        btnStyle={[
          styled.hook,
          tokensFactories[1]?.visible ? null : { marginBottom: 50 },
        ]}
        onPress={onToggleUnVerifiedTokens}
        checked={toggleUnVerified}
        hook={<Text style={styled.hookText}>Show unverified coins</Text>}
      />
      <ListToken {...tokensFactories[1]} renderItem={renderItem} />
    </KeyboardAwareScrollView>
  );
};

ListAllToken.propTypes = {
  tokensFactories: PropTypes.array.isRequired,
  onToggleUnVerifiedTokens: PropTypes.func.isRequired,
  toggleUnVerified: PropTypes.bool.isRequired,
  renderItem: PropTypes.func.isRequired,
};

export default React.memo(ListAllToken);

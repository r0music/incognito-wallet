import React, {memo} from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { ListView } from '@components/Token/index';
import { BtnChecked } from '@components/Button';
import { FONT } from '@src/styles';
import { useDispatch } from 'react-redux';
import { getPTokenList } from '@src/redux/actions/token';
import { RefreshControl, ScrollView, Text } from '@components/core';
import globalStyled from '@src/theme/theme.styled';

const styled = StyleSheet.create({
  hook: {
    ...globalStyled.defaultPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
  },
  hookText: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    marginLeft: 5,
  },
  scrollView: {
    paddingLeft: 0,
    paddingRight: 0
  }
});

const MarketList = (props) => {
  const {
    tokensFactories,
    onToggleUnVerifiedTokens,
    toggleUnVerified,
    renderItem,
    keySearch,
  } = props;
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);

  const onRefresh = async () => {
    try {
      setLoading(true);
      await dispatch(getPTokenList());
      setLoading(false);
    } catch (e) {
      console.log('MarketList: error', );
      setLoading(false);
    }
  };

  const AlList = React.useMemo(() => {
    return (
      <>
        <ListView {...tokensFactories[0]} renderItem={renderItem} />
        <BtnChecked
          btnStyle={[
            styled.hook,
            tokensFactories[1]?.visible ? null : { marginBottom: 50 },
          ]}
          onPress={onToggleUnVerifiedTokens}
          checked={toggleUnVerified}
          hook={<Text style={styled.hookText}>Show unverified coins</Text>}
        />
        <ListView {...tokensFactories[1]} renderItem={renderItem} />
      </>
    );
  }, [toggleUnVerified, tokensFactories]);

  const isLoading = React.useMemo(() => {
    return loading
      || !tokensFactories
      || tokensFactories[0]?.data.length === 0;
  }, [loading, tokensFactories]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styled.scrollView}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
    >
      {!keySearch && (
        <ListView {...tokensFactories[2]} renderItem={renderItem} />
      )}
      {!!keySearch && (
        AlList
      )}
    </ScrollView>
  );
};

MarketList.defaultProps = {
  keySearch: ''
};

MarketList.propTypes = {
  tokensFactories: PropTypes.array.isRequired,
  onToggleUnVerifiedTokens: PropTypes.func.isRequired,
  toggleUnVerified: PropTypes.bool.isRequired,
  renderItem: PropTypes.func.isRequired,
  keySearch: PropTypes.string,
};

export default memo(MarketList);

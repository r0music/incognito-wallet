import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { InfoIcon } from '@src/components/Icons';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { useDispatch } from 'react-redux';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';

const styled = StyleSheet.create({
  btnInfo: {
    padding: 5,
  },
});

const BtnInfo = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { tokenId } = props;
  const onNavTokenInfo = async() => {
    if(tokenId) {
      await dispatch(setSelectedPrivacy(tokenId));
    }
    navigation.navigate(routeNames.CoinInfo);
  };
  return (
    <TouchableOpacity
      {...{
        ...props,
        onPress:
          typeof props?.onPress === 'function'
            ? props?.onPress
            : onNavTokenInfo,
        style: [styled.btnInfo, props?.style],
      }}
    >
      <InfoIcon isBlack={props?.isBlack} />
    </TouchableOpacity>
  );
};

BtnInfo.defaultProps = {
  tokenId: null
};

BtnInfo.propTypes = {
  tokenId: PropTypes.string,
};

export default React.memo(BtnInfo);

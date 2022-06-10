import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { InfoIcon } from '@src/components/Icons';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { useDispatch } from 'react-redux';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import InfoVer2Icon from '@components/Icons/icon.i';

const styled = StyleSheet.create({
  btnInfo: {
    padding: 5,
  },
});

const BtnInfo = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { tokenId, version = 1 } = props;
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
      {version === 1 ? (
        <InfoIcon isBlack={props?.isBlack} />
      ) : (
        <InfoVer2Icon />
      )}
    </TouchableOpacity>
  );
};

BtnInfo.defaultProps = {
  tokenId: null,
  version: 1
};

BtnInfo.propTypes = {
  tokenId: PropTypes.string,
  version: PropTypes.number
};

export default React.memo(BtnInfo);

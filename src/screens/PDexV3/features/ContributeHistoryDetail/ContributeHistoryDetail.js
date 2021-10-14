import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {Header} from '@src/components';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Hook} from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import {compose} from 'recompose';
import withFactories from './ContributeHistoryDetail.enhance';

const ContributeHistoryDetail = ({ hookFactories }) => {
  return (
    <View style={mainStyle.container}>
      <Header title="" />
      <ScrollView>
        {hookFactories.map(data => <Hook key={data?.label} {...data} />)}
      </ScrollView>
    </View>
  );
};

ContributeHistoryDetail.propTypes = {
  hookFactories: PropTypes.array.isRequired
};

export default compose(
  withFactories
)(memo(ContributeHistoryDetail));

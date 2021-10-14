import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import {Hook} from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import withFactories from './WithdrawRewardHistoriesDetail.enhance';

const WithdrawRewardHistoriesDetail = ({ hookFactories }) => {
  return (
    <View style={mainStyle.container}>
      <Header title="" />
      <ScrollView>
        {hookFactories.map(data => <Hook key={data?.label} {...data} />)}
      </ScrollView>
    </View>
  );
};

WithdrawRewardHistoriesDetail.propTypes = {
  hookFactories: PropTypes.array.isRequired
};


export default withFactories(memo(WithdrawRewardHistoriesDetail));

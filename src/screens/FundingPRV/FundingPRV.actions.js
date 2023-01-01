import {
  TYPES
} from './FundingPRV.constant';

const actionFundingPRVModalVisible = (isVisble) => ({
  type: TYPES.ACTION_SET_MODAL_VISIBLE,
  payload: isVisble,
});


export {
  actionFundingPRVModalVisible
};
import {ACCOUNT_CONSTANT, PRVIDSTR} from 'incognito-chain-web-js/build/wallet';
import { TYPES, PRV_MIN_NEEDED } from './FundingPRV.constant';

const initialState = {
  isVisible: false,
  feeTx: ACCOUNT_CONSTANT.MAX_FEE_PER_TX || 0,
  prvId: PRVIDSTR,
  minPRVNeeded: PRV_MIN_NEEDED
};

const fundingPRVReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.ACTION_SET_MODAL_VISIBLE: {
      const isVisible = action.payload;
      return {
        ...state,
        isVisible: isVisible
      };
    }
    default:
      return state;
  }
};

export default fundingPRVReducer;

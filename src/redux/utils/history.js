import { COLORS } from '@src/styles';
import {
  ACCOUNT_CONSTANT,
  Validator,
} from 'incognito-chain-web-js/build/wallet';

export const {
  TX_STATUS,
  STATUS_CODE_SHIELD_DECENTRALIZED,
  STATUS_CODE_SHIELD_CENTRALIZED,
  STATUS_CODE_UNSHIELD_DECENTRALIZED,
  STATUS_CODE_UNSHIELD_CENTRALIZED,
  TX_TYPE,
  STATUS_CODE_SHIELD_PORTAL,
  STATUS_CODE_UNSHIELD_PORTAL,
} = ACCOUNT_CONSTANT;

const PORTAL_UNSHIELD_STATUS_DETAIL = {
  [STATUS_CODE_UNSHIELD_PORTAL.PENDING]:
    'The unshielding request is waiting for processing.',
  [STATUS_CODE_UNSHIELD_PORTAL.PROCESSING]:
    'The unshielding request is processing.',
  [STATUS_CODE_UNSHIELD_PORTAL.COMPLETE]:
    'The public token has been sent to your external address.',
  [STATUS_CODE_UNSHIELD_PORTAL.REFUND]:
    'The unshielding request was refunded to your account. Please try again.',
};

const PORTAL_SHIELD_STATUS_DETAIL = {
  [STATUS_CODE_SHIELD_PORTAL.PENDING]:
    'The shielding transaction is waiting for confirmation.',
  [STATUS_CODE_SHIELD_PORTAL.PROCESSING]: 'The shielding transaction has ', // + 2/6 block confirmations.
  [STATUS_CODE_SHIELD_PORTAL.FAILED]:
    'The shielding request is rejected because the shielding amount is smaller than the minimum amount.',
  [STATUS_CODE_SHIELD_PORTAL.SUCCESS]: '',
};

export const TX_STATUS_COLOR = {
  [TX_STATUS.PROCESSING]: COLORS.lightGrey36,
  [TX_STATUS.TXSTATUS_CANCELED]: COLORS.orange,
  [TX_STATUS.TXSTATUS_FAILED]: COLORS.red,
  [TX_STATUS.TXSTATUS_PENDING]: COLORS.colorBlue,
  [TX_STATUS.TXSTATUS_SUCCESS]: COLORS.green,
};

export const CENTRALIZED_ARRAY = [0];
export const DECENTRALIZE_ARRAY = [1, 2, 3, 4, 5];

export const getStatusColorShield = (history) => {
  let statusColor = '';
  try {
    new Validator('getStatusColorShield-history', history).required().object();
    const { decentralized, status } = history;
    // Case1: Check centralized
    if (CENTRALIZED_ARRAY.includes(decentralized)) {
      if (
        STATUS_CODE_SHIELD_CENTRALIZED.COMPLETE.includes(status)
      ) {
        statusColor = COLORS.green;
      } else if (
        STATUS_CODE_SHIELD_CENTRALIZED.TIMED_OUT.includes(status)
      ) {
        statusColor = COLORS.orange;
      } else {
        statusColor = COLORS.lightGrey36;
      }
    }
    // Case 2: Check decentralized
    else if (DECENTRALIZE_ARRAY.includes(decentralized)) {
      if (
        STATUS_CODE_SHIELD_DECENTRALIZED.COMPLETE === status
      ) {
        statusColor = COLORS.green;
      } else if (
        STATUS_CODE_SHIELD_DECENTRALIZED.TIMED_OUT === status
      ) {
        statusColor = COLORS.orange;
      } else {
        statusColor = COLORS.lightGrey36;
      }
    } else {
      statusColor = COLORS.lightGrey36;
    }
  } catch (error) {
    console.log('getStatusColorShield', error);
  }
  return statusColor || COLORS.lightGrey36;
};

export const getStatusColorUnshield = (history) => {
  let statusColor = '';
  try {
    new Validator('getStatusColorUnshield-history', history)
      .required()
      .object();
    const { decentralized, status } = history;
    // Check centralized
    if (CENTRALIZED_ARRAY.includes(decentralized)) {
      if (STATUS_CODE_UNSHIELD_CENTRALIZED.COMPLETE === status) {
        statusColor = COLORS.green;
      } else {
        statusColor = COLORS.lightGrey36;
      }
    }
    // Check decentralized
    else if (DECENTRALIZE_ARRAY.includes(decentralized)) {
      if (STATUS_CODE_UNSHIELD_DECENTRALIZED.COMPLETE.includes(status)) {
        statusColor = COLORS.green;
      } else {
        statusColor = COLORS.lightGrey36;
      }
    } else {
      statusColor = COLORS.lightGrey36;
    }
  } catch (error) {
    console.log('getStatusColorUnshield', error);
  }

  return statusColor;
};

export const getPortalStatusColor = (history) => {
  let statusColor = '';
  try {
    new Validator('getPortalStatusColor-history', history).required().object();
    const { txType, status } = history;
    switch (txType) {
    case TX_TYPE.SHIELDPORTAL: {
      // shield
      if (status === STATUS_CODE_SHIELD_PORTAL.SUCCESS) {
        statusColor = COLORS.green;
      } else if (status === STATUS_CODE_SHIELD_PORTAL.FAILED) {
        statusColor = COLORS.red;
      } else {
        statusColor = COLORS.lightGrey36;
      }
      break;
    }
    case TX_TYPE.UNSHIELDPORTAL: {
      // unshield
      if (status === STATUS_CODE_UNSHIELD_PORTAL.COMPLETE) {
        statusColor = COLORS.green;
      } else if (status === STATUS_CODE_UNSHIELD_PORTAL.REFUND) {
        statusColor = COLORS.red;
      } else {
        statusColor = COLORS.lightGrey36;
      }
      break;
    }
    default:
      break;
    }
  } catch (error) {
    console.log('getPortalStatusColor', error);
  }
  return statusColor;
};

export const getPortalStatusDetail = (history) => {
  let statusDetail = '';
  try {
    new Validator('getPortalStatusDetail-history', history).required().object();
    const { txType, status } = history;
    switch (txType) {
    case TX_TYPE.SHIELDPORTAL: {
      statusDetail = PORTAL_SHIELD_STATUS_DETAIL[status];
      if (status === STATUS_CODE_SHIELD_PORTAL.PROCESSING) {
        const { confirmations } = history;
        if (confirmations === undefined) {
          statusDetail = '';
        } else {
          statusDetail =
              statusDetail +
              confirmations.toString() +
              '/6 block confirmations.';
        }
      }
      break;
    }
    case TX_TYPE.UNSHIELDPORTAL: {
      statusDetail = PORTAL_UNSHIELD_STATUS_DETAIL[status];
      break;
    }
    default:
      break;
    }
  } catch (error) {
    console.log('getPortalStatusDetail', error);
  }
  return statusDetail;
};

export const checkShieldProcessing = (status, decentralized) => {
  // case shield decentralize
  if (DECENTRALIZE_ARRAY.includes(decentralized)) {
    if (
      status === STATUS_CODE_SHIELD_DECENTRALIZED.COMPLETE ||
      status === STATUS_CODE_SHIELD_DECENTRALIZED.TIMED_OUT ||
      status === STATUS_CODE_SHIELD_DECENTRALIZED.RETRYING ||
      status === STATUS_CODE_SHIELD_DECENTRALIZED.REPLACED
    ) {
      return false;
    }
    return true;
  }

  // case shield centralized
  if (CENTRALIZED_ARRAY.includes(decentralized)) {
    if (
      STATUS_CODE_SHIELD_CENTRALIZED.COMPLETE.includes(status) ||
      STATUS_CODE_SHIELD_CENTRALIZED.TIMED_OUT.includes(status) ||
      STATUS_CODE_SHIELD_CENTRALIZED.INVALID_AMOUNT.includes(status)
    ) {
      return false;
    }
    return true;
  }
  return false;
};

export const checkShieldPortalProcessing = (status) => {
  if (status === STATUS_CODE_SHIELD_PORTAL.PROCESSING) {
    return true;
  }
  return false;
};
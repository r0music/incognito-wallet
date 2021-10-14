import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';

export const openLink = ({ url, txID }) => {
  let _url = url;
  if (txID) {
    _url = `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txID}`;
  }
  linkingService.openUrl(_url);
};

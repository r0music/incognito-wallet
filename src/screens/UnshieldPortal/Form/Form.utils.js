import { isEmpty } from 'lodash';

export const removeAllSpace = (str) => {
  if (isEmpty(str)) return str;
  return str.replace(/\s/g,'');
};

export const standardizedAddress = (address) => {
  if (!address) {
    return '';
  }
  let indexParams = address?.indexOf('?');
  let newAddress = address;
  if (indexParams !== -1) {
    newAddress = address.substring(0, indexParams);
  }
  return removeAllSpace(newAddress);
};
import { genNamspace } from '@src/utils/reduxUtils';

const n = genNamspace('CHILD_SELECTED_PRIVACY');

// define types here
const TYPES = {
  SET: n('SET'),
  CLEAR: n('CLEAR'),
};

export default TYPES;

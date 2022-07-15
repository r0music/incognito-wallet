import type from '@src/redux/types/childSelectedPrivacy';

export const setChildSelectedPrivacy = (data) => ({
  type: type.SET,
  data,
});

export const clearChildSelectedPrivacy = () => ({
  type: type.CLEAR,
});

import { Clipboard } from 'react-native';
import { Toast } from '@src/components/core';

const ClipboardService = {
  set(str, { copiedMessage = 'Copied', errorMessage = '' } = {}) {
    try {
      if (str && typeof str === 'string') {
        Clipboard.setString(str);
        Toast.showSuccess(copiedMessage ?? 'Copied');
      } else {
        throw new Error('Clipboard data must be string');
      }
    } catch {
      Toast.showError(errorMessage ?? 'Please tap again to copy.');
    }
  },

  get() {
    return Clipboard.getString();
  },
};

export default ClipboardService;

import { I18nManager } from 'react-native';

export const setupRTL = (): void => {
  I18nManager.allowRTL(true);

  if (!I18nManager.isRTL) {
    I18nManager.forceRTL(true);
  }
};

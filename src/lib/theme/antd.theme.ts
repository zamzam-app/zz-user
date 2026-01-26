import type { ThemeConfig } from 'antd';
import { tokens } from './tokens';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: tokens.primaryColor,
    colorTextBase: tokens.textColor,
    borderRadius: tokens.borderRadius,
    fontFamily: tokens.fontFamily,
  },
};

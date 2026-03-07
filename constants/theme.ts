import { Platform } from 'react-native';
import { greenTheme, blueTheme } from '@/styles/themes';

const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: greenTheme.colors.text.primary,
    background: greenTheme.colors.background,
    tint: greenTheme.colors.primary,
    icon: greenTheme.colors.text.secondary,
    tabIconDefault: greenTheme.colors.text.secondary,
    tabIconSelected: greenTheme.colors.primary,
  },
  dark: {
    text: blueTheme.colors.text.primary,
    background: blueTheme.colors.background,
    tint: tintColorDark,
    icon: blueTheme.colors.text.secondary,
    tabIconDefault: blueTheme.colors.text.secondary,
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

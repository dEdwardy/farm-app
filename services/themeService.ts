import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultTheme, Theme, ThemeName, themes } from '../styles/themes';

const THEME_KEY = 'app_theme';

// 主题管理服务
export const themeService = {
  // 获取当前主题
  async getCurrentTheme(): Promise<Theme> {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme && savedTheme in themes) {
        return themes[savedTheme as ThemeName];
      }
      return themes[defaultTheme];
    } catch (_) {
      return themes[defaultTheme];
    }
  },

  // 切换主题
  async setTheme(themeName: ThemeName): Promise<Theme> {
    try {
      await AsyncStorage.setItem(THEME_KEY, themeName);
      return themes[themeName];
    } catch (_) {
      return themes[defaultTheme];
    }
  },

  // 获取所有可用主题
  getAvailableThemes(): { name: ThemeName; displayName: string }[] {
    return [
      { name: 'green', displayName: '绿色主题' },
      { name: 'blue', displayName: '蓝色主题' },
    ];
  },

  // 重置为默认主题
  async resetToDefaultTheme(): Promise<Theme> {
    try {
      await AsyncStorage.removeItem(THEME_KEY);
      return themes[defaultTheme];
    } catch (_) {
      return themes[defaultTheme];
    }
  },
};

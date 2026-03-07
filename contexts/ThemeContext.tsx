import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { themeService } from '../services/themeService';
import { Theme, ThemeName } from '../styles/themes';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeName: ThemeName) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载初始主题
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const currentTheme = await themeService.getCurrentTheme();
        setThemeState(currentTheme);
      } catch (_) {
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // 切换主题
  const setTheme = async (themeName: ThemeName) => {
    try {
      const newTheme = await themeService.setTheme(themeName);
      setThemeState(newTheme);
    } catch (_) {
    }
  };

  if (isLoading || !theme) {
    // 可以返回一个加载组件或默认主题
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

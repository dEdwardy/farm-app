// 主题配置文件

// 基础主题结构
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    success: string;
    text: {
      primary: string;
      secondary: string;
      light: string;
      white: string;
    };
    border: string;
    divider: string;
    shadow: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadow: {
    sm: {
      shadowColor: string;
      shadowOpacity: number;
      shadowRadius: number;
      shadowOffset: {
        width: number;
        height: number;
      };
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOpacity: number;
      shadowRadius: number;
      shadowOffset: {
        width: number;
        height: number;
      };
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOpacity: number;
      shadowRadius: number;
      shadowOffset: {
        width: number;
        height: number;
      };
      elevation: number;
    };
  };
  layout: {
    screenPadding: number;
    headerHeight: number;
    footerHeight: number;
  };
}

// 绿色主题（养殖场主题）
export const greenTheme: Theme = {
  name: 'green',
  colors: {
    primary: '#4CAF50',
    secondary: '#81C784',
    background: '#F5F5F5',
    surface: '#ffffff',
    error: '#FF5722',
    success: '#4CAF50',
    text: {
      primary: '#333333',
      secondary: '#757575',
      light: '#9E9E9E',
      white: '#ffffff',
    },
    border: '#E0E0E0',
    divider: '#F0F0F0',
    shadow: 'rgba(0, 0, 0, 0.12)',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 28,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
    },
  },
  layout: {
    screenPadding: 16,
    headerHeight: 64,
    footerHeight: 64,
  },
};

// 蓝色主题（默认主题）
export const blueTheme: Theme = {
  name: 'blue',
  colors: {
    primary: '#1976d2',
    secondary: '#64b5f6',
    background: '#f5f7fa',
    surface: '#ffffff',
    error: '#dc3545',
    success: '#28a745',
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#999999',
      white: '#ffffff',
    },
    border: '#e0e0e0',
    divider: '#f0f0f0',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 28,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
    },
  },
  layout: {
    screenPadding: 16,
    headerHeight: 64,
    footerHeight: 64,
  },
};

// 主题列表
export const themes = {
  green: greenTheme,
  blue: blueTheme,
};

// 主题类型
export type ThemeName = keyof typeof themes;

// 默认主题
export const defaultTheme: ThemeName = 'green';

// 主题变量定义
export const theme = {
  // 颜色
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
  // 字体大小
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 28,
  },
  // 间距
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  // 圆角
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  // 阴影
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
  // 布局
  layout: {
    screenPadding: 16,
    headerHeight: 64,
    footerHeight: 64,
  },
};
import { Toast } from 'toastify-react-native';

export interface ToastOptions {
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message?: string;
  position?: 'top' | 'center' | 'bottom';
  useModal?: boolean;
  onPress?: () => void;
}

export const toast = {
  success: (message: string, title?: string, position: 'top' | 'center' | 'bottom' = 'top') => {
    Toast.success(title || '成功', position);
  },

  error: (message: string, title?: string, position: 'top' | 'center' | 'bottom' = 'top') => {
    Toast.error(title || '错误', position);
  },

  info: (message: string, title?: string, position: 'top' | 'center' | 'bottom' = 'top') => {
    Toast.info(title || '提示', position);
  },

  warning: (message: string, title?: string, position: 'top' | 'center' | 'bottom' = 'top') => {
    Toast.warn(title || '警告', position);
  },

  show: (options: ToastOptions) => {
    const type = options.type || 'info';
    const title = options.title || (type === 'success' ? '成功' : type === 'error' ? '错误' : type === 'warning' ? '警告' : '提示');
    
    Toast.show({
      type: type === 'warning' ? 'warn' : type,
      text1: title,
      text2: options.message,
      position: options.position || 'top',
      useModal: options.useModal,
      onPress: options.onPress,
    });
  }
};

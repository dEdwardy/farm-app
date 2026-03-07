import { checkSupabase, handleError } from '@/utils/apiHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const UINFO_KEY = 'user_info';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const check = await checkSupabase();
    if (!check.ok) {
      return { success: false, error: check.error };
    }

    try {
      const { data, error: authError } = await check.client.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        return {
          success: false,
          error: authError.code === 'invalid_credentials' ? '邮箱或密码错误' : '登录失败，请稍后重试'
        };
      } else if (data.user) {
        try {
          await AsyncStorage.setItem(TOKEN_KEY, 'logged_in');
          await AsyncStorage.setItem(UINFO_KEY, JSON.stringify(data.user ?? {}) );
        } catch (_) {
        }
        return { success: true };
      } else {
        return { success: false, error: '邮箱或密码错误' };
      }
    } catch (error) {
      return { success: false, error: handleError(error, '登录失败，请稍后重试') };
    }
  },

  async loginWithMagicLink(email: string): Promise<AuthResponse> {
    const check = await checkSupabase();
    if (!check.ok) {
      return { success: false, error: check.error };
    }

    try {
      const { error: authError } = await check.client.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'com.your-app-name://login',
        },
      });

      if (authError) {
        return { success: false, error: '发送登录链接失败，请稍后重试' };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: handleError(error, '发送登录链接失败，请稍后重试') };
    }
  },

  async logout(): Promise<boolean> {
    const check = await checkSupabase();
    if (!check.ok) {
      return false;
    }

    try {
      const { error } = await check.client.auth.signOut();
      if (error) {
        return false;
      }
      try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(UINFO_KEY);
      } catch (_) {
      }
      return true;
    } catch (_) {
      return false;
    }
  },

  async checkAuthStatus(): Promise<boolean> {
    const check = await checkSupabase();
    if (!check.ok) {
      return false;
    }

    try {
      const { data: { session } } = await check.client.auth.getSession();
      if (session) {
        return true;
      }
      
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return !!token;
    } catch (_) {
      return false;
    }
  },

  async getCurrentUser() {
    const check = await checkSupabase();
    if (!check.ok) {
      return null;
    }

    try {
      const { data: { user } } = await check.client.auth.getUser();
      return user;
    } catch (_) {
      return null;
    }
  }
};

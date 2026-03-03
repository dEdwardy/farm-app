import { supabase, supabaseInitError } from '@/lib/supabase';
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
    if (!supabase) {
      return {
        success: false,
        error: supabaseInitError ?? 'Supabase 未初始化'
      };
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        console.warn('Auth error:', authError);
        return {
          success: false,
          error: authError.code === 'invalid_credentials' ? '邮箱或密码错误' : '登录失败，请稍后重试'
        };
      } else if (data.user) {
        try {
          await AsyncStorage.setItem(TOKEN_KEY, 'logged_in');
          await AsyncStorage.setItem(UINFO_KEY, JSON.stringify(data.user ?? {}) );
        } catch (e) {
          // ignore storage error, still allow access
        }
        return {
          success: true
        };
      } else {
        return {
          success: false,
          error: '邮箱或密码错误'
        };
      }
    } catch (e) {
      console.error('Login error:', e);
      return {
        success: false,
        error: '登录失败，请稍后重试'
      };
    }
  },

  async loginWithMagicLink(email: string): Promise<AuthResponse> {
    if (!supabase) {
      return {
        success: false,
        error: supabaseInitError ?? 'Supabase 未初始化'
      };
    }

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'com.your-app-name://login',
        },
      });

      if (authError) {
        console.warn('Magic link error:', authError);
        return {
          success: false,
          error: '发送登录链接失败，请稍后重试'
        };
      } else {
        return {
          success: true
        };
      }
    } catch (e) {
      console.error('Magic link error:', e);
      return {
        success: false,
        error: '发送登录链接失败，请稍后重试'
      };
    }
  },

  async logout(): Promise<boolean> {
    try {
      // Clear auth token
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(UINFO_KEY);
      
      // Sign out from Supabase
      if (supabase) {
        await supabase.auth.signOut();
      }
      
      return true;
    } catch (e) {
      console.error('Logout error:', e);
      return false;
    }
  },

  async checkAuthStatus(): Promise<boolean> {
    if (!supabase) {
      return false;
    }

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Check auth status error:', error);
        return false;
      }

      return !!user;
    } catch (e) {
      console.error('Check auth status unexpected error:', e);
      return false;
    }
  },

  async getCurrentUser() {
    if (!supabase) {
      return null;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (e) {
      console.error('Get current user error:', e);
      return null;
    }
  }
};
